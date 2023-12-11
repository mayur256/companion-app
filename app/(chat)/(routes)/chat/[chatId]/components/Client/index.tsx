"use client"

// top level imports
import { FormEvent, ReactElement, useState } from "react"
import { useRouter } from "next/navigation";
import { Companion, Message } from "@prisma/client"

// AI lib
import { useCompletion } from "ai/react";

// Constituent components
import { ChatHeader } from "../Header";
import { ChatForm } from "../Form";

// props type definition
interface IChatClient {
    companion: Companion & {
        messages: Message[];
        _count: { messages: number }
    }
}

// Component definition
export function ChatClient({ companion }: IChatClient): ReactElement {
    // state definitions
    const [messages, setMessages] = useState<any[]>(companion.messages);

    // hooks
    const router = useRouter();
    const { input, isLoading, handleInputChange, handleSubmit, setInput } = useCompletion({
        api: `/api/chat/${companion.id}`,
        onFinish: (prompt, completion) => {
            const sysMsg = { role: 'system', content: completion };

            setMessages((prevMsgs) => [...prevMsgs, sysMsg]);
            setInput("");

            router.refresh();
        }
    });

    /** Handler / Utility functions - starts */
    const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
        const newMsg = { role: 'user', content: input };

        setMessages((prevMsgs) => [...prevMsgs, newMsg]);
        setInput("");

        handleSubmit(event);
    }

    /** Handler / Utility functions - ends */

    // main content renderer
    return (
        <div className="flex flex-col h-full p-4 space-y-2">
            <ChatHeader companion={companion} />

            <ChatForm
                onSubmit={onSubmit}
                input={input}
                handleInputChange={handleInputChange}
                isLoading={isLoading}
            />
        </div>
    )
}
