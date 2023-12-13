// top level imports
import { NextResponse } from "next/server";

// Clerk auth
import { auth, currentUser } from "@clerk/nextjs";

// AI SDK
import { StreamingTextResponse, LangChainStream } from "ai";
import { Replicate } from "langchain/llms/replicate";
import { CallbackManager } from "langchain/callbacks";

// Utils
import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import { prismadb } from "@/lib/prismadb";

// route handler
export async function POST(
    request: Request,
    { params }: { params: { chatId: string } }
) {
    try {
        const { prompt } = await request.json();

        // authentication validation
        const user = await currentUser();

        if (!user || !user.firstName || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Rate limit validations
        const identifier = request.url + "-" + user.id;
        const { success } = await rateLimit(identifier);

        if (!success) {
            return new NextResponse("Rate limit exceeded", { status: 429 });
        }

        // Identify the companion and store chat message in our database
        const companion = await prismadb.companion.update({
            where: { id: params.chatId },
            data: {
                messages: {
                    create: { content: prompt, role: "user", userId: user.id },
                },
            }
        });

        if (!companion) {
            return new NextResponse("Companion not found", { status: 404 });
        }

        const name = companion.id;
        const companion_file_name = name + ".txt";

        const companionKey = {
            companionName: name!,
            userId: user.id,
            modelName: "llama2-13b",
        };
        
        const memoryManager = MemoryManager.getInstance();
        
        // Check for initial conversation records
        const records = await memoryManager.readLatestHistory(companionKey);

        // seed companion to redix db
        if (records.length === 0) {
            await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
        }

        // add conversation to the redis db for the current companion
        await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

        // get latest conversations from db
        const recentChatHistory = await memoryManager.readLatestHistory(companionKey);

        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory,
            companion_file_name
        );
        
        // get relevant history based on ANN strategy
        let relevantHistory = "";
        if (!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
        }

        // Initialise and employ LLMs with Langchain
        const { handlers } = LangChainStream();
        // Initialise API settings for the LLM
        const model = new Replicate({
            model:
                "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            input: {
                max_length: 2048,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbackManager: CallbackManager.fromHandlers(handlers),
        });

        // Turn verbose on for debugging
        model.verbose = true;

        // Instruction specification (prompts) for models
        const resp = String(
            await model
                .call(
                    `
                    ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 

                    ${companion.instructions}

                    Below are relevant details about ${companion.name}'s past and the conversation you are in.
                    ${relevantHistory}


                    ${recentChatHistory}\n${companion.name}:`
                )
                .catch(console.error)
        );
        

        const cleaned = resp.replaceAll(",", ""); // Cleaning response from replicate API
        const chunks = cleaned.split("\n"); // chunkif
        const response = chunks[0];
        
        // store the LLM conversation response in redis
        await memoryManager.writeToHistory("" + response.trim(), companionKey);
        
        // Create a readable stream and fill that with response
        var Readable = require("stream").Readable;
        let s = new Readable();
        s.push(response);
        s.push(null);

        if (response !== undefined && response.length > 1) {
            memoryManager.writeToHistory("" + response.trim(), companionKey);

            await prismadb.companion.update({
                where: { id: params.chatId },
                data: {
                    messages: {
                        create: {
                            content: response.trim(),
                            role: "system",
                            userId: user.id,
                        },
                    },
                }
            });
        }

        return new StreamingTextResponse(s);
    } catch (error) {
        console.log(`Error in chat/chatId::${error}`)
    }
}