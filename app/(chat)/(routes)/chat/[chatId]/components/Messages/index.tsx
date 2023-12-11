"use client"

// top level imports
import { ReactElement, useEffect, useRef, useState } from "react";
import { Companion } from "@prisma/client";

// Constituent components
import { ChatMessage, IChatMessage } from "../Message";

// props type definition
interface IChatMessages {
    companion: Companion;
    messages: IChatMessage[];
    isLoading: boolean;
}

// Component definition
export function ChatMessages({
    companion,
    messages = [],
    isLoading
}: IChatMessages): ReactElement {
    // state defintions
    const [fakeLoading, setFakeLoading] = useState(messages.length === 0 ? true : false);

    // Refs
    const tailDiv = useRef<HTMLDivElement| null>(null)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFakeLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        }
    }, []);

    useEffect(() => {
        tailDiv.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length])

    // main content render
    return (
        <div className="flex-1 overflow-y-auto pr-4">
            {/** Introductory message */}
            {/** showing a fake loading effect if there are no messages */}
            <ChatMessage
                role="system"
                content={`Hello, I am ${companion.name}, ${companion.description}`}
                src={companion.src}
                isLoading={fakeLoading}
            />

            {messages.map((message: IChatMessage): ReactElement => (
                <ChatMessage
                    key={message.content}
                    role={message.role}
                    content={message.content}
                    src={companion.src}
                    isLoading={isLoading}
                />
            ))}
            
            {/** Placeholder message shown while system generates its content */}
            {isLoading && (
                <ChatMessage
                    src={companion.src}
                    role="system"
                    isLoading
                />
            )}

            <div ref={tailDiv} />
        </div>
    )
}