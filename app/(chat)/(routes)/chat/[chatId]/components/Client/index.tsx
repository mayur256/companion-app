"use client"

// top level imports
import { ReactElement } from "react"
import { Companion, Message } from "@prisma/client"

// Constituent components
import { ChatHeader } from "../Header";

// props type definition
interface IChatClient {
    companion: Companion & {
        messages: Message[];
        _count: { messages: number }
    }
}

// Component definition
export function ChatClient({ companion }: IChatClient): ReactElement {
    return (
        <div className="flex flex-col h-full p-4 space-y-2">
            <ChatHeader companion={companion} />
        </div>
    )
}