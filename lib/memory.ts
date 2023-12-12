// Required module imports
import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

// type definitions
export type CompanionKey = {
    companionName: string;
    modelName: string;
    userId: string;
};

/**
 * Class to communicate with redis database
 */
export class MemoryManager {
    // instance data members
    private static instance: MemoryManager;
    private history: Redis;
    private vectorDBClient: Pinecone;


    public constructor() {
        this.history = Redis.fromEnv();
        this.vectorDBClient = this.initPincone();
    }

    private initPincone() {
        return new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
            environment: process.env.PINECONE_ENVIRONMENT!,
        });
    }

    /**
     * @description - Configures search for redis db
     * @param recentChatHistory 
     * @param companionFileName
     */
    public async vectorSearch(recentChatHistory: string, companionFileName: string) {
        // initialising the client
        const pineconeClient = <Pinecone>this.vectorDBClient;

        // initialising the database index
        const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX! || "");

        // instantiate a vector store
        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
            { pineconeIndex }
        );
        
        // create a search query template
        const similarDocs = await vectorStore
            .similaritySearch(recentChatHistory, 3, { fileName: companionFileName })
            .catch((err) => {
                console.log("WARNING: failed to get vector search results.", err);
            });
        
        return similarDocs;
    }

    /**
     * @description - Returns an instance of MemoryManager
     */
    public static async getInstance(): Promise<MemoryManager> {
        if (!MemoryManager.instance) {
            MemoryManager.instance = new MemoryManager();
        }
        return MemoryManager.instance;
    }

    /**
     * @description - Generates and return redis key
     * @param companionKey 
     * @returns {String}
     */
    private generateRedisCompanionKey(companionKey: CompanionKey): string {
        return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
    }

    /**
     * @description - writes the chat history to redis database
     * @param {String} text 
     * @param {CompanionKey} companionKey
     */
    public async writeToHistory(text: string, companionKey: CompanionKey): Promise<any> {
        if (!companionKey || typeof companionKey.userId == "undefined") {
            console.log("Companion key set incorrectly");
            return "";
        }

        const key = this.generateRedisCompanionKey(companionKey);
        const result = await this.history.zadd(key, {
            score: Date.now(),
            member: text,
        });

        return result;
    }

    /**
     * @description - returns recent chats from db
     * @param {CompanionKey} companionKey
     */
    public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
        if (!companionKey || typeof companionKey.userId == "undefined") {
            console.log("Companion key set incorrectly");
            return "";
        }

        const key = this.generateRedisCompanionKey(companionKey);
        let result = await this.history.zrange(key, 0, Date.now(), {
            byScore: true,
        });

        result = result.slice(-30).reverse();
        const recentChats = result.reverse().join("\n");
        return recentChats;
    }

    /**
     * @description - 
     * @param {String} seedContent
     * @param {string} delimiter
     * @param {CompanionKey} companionKey
     */
    public async seedChatHistory(
        seedContent: String,
        delimiter: string = "\n",
        companionKey: CompanionKey
    ) {
        const key = this.generateRedisCompanionKey(companionKey);
        if (await this.history.exists(key)) {
            console.log("User already has chat history");
            return;
        }

        const content = seedContent.split(delimiter);
        let counter = 0;
        for (const line of content) {
            await this.history.zadd(key, { score: counter, member: line });
            counter += 1;
        }
    }
}