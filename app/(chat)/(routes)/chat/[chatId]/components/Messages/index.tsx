"use client"

// top level imports
import { ReactElement } from "react";
import { Companion } from "@prisma/client";

// props type definition
interface IChatMessages {
    companion: Companion;
    messages: any[];
    isLoading: boolean;
}

// Component definition
export function ChatMessages({
    companion,
    messages = [],
    isLoading
}: IChatMessages): ReactElement {
    return (
        <div className="flex-1 overflow-y-auto pr-4">Chat messages</div>
    )
}