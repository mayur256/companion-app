// top level imports
import { ReactElement } from "react";
import { redirect } from "next/navigation";

// Clerk auth
import { auth, redirectToSignIn } from "@clerk/nextjs";

// Library utils
import { prismadb } from "@/lib/prismadb";
import { ChatClient } from "./components/Client";

// props type definition
interface IChat {
    params: { chatId: string }
}

// Page component definition
export default async function Chat({ params }: IChat): Promise<ReactElement> {
    // Server context data
    const { userId } = auth();

    // if unauthenticated, ask to sign-in
    if (!userId) {
        return redirectToSignIn();
    }

    // Fetch required server data for the component
    const companion = await prismadb.companion.findUnique({
        where: { id: params.chatId },
        include: {
            messages: {
                where: { userId }, // loading messages of current logged in user only
                orderBy: { createdAt: "desc" }
            },
            _count: { select: { messages: true } }
        }
    });

    if (!companion) {
        return redirect("/")
    }

    // main content renderer
    return (
        <div className="h-full p-4 space-y-2">
            <ChatClient companion={companion} />
        </div>
    )
}
