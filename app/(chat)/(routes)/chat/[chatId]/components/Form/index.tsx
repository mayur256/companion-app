"use client"

// top level imports
import { ChangeEvent, FormEvent, ReactElement } from "react";

// AI lib
import type { ChatRequestOptions } from "ai";

// UI
import { SendHorizonal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// props type definition
interface IForm {
    input: string;
    handleInputChange: (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>, chatReqOptions?: ChatRequestOptions | undefined) => void;
    isLoading: boolean;
}

// Component definition
export function ChatForm({
    onSubmit,
    input,
    handleInputChange,
    isLoading
}: IForm): ReactElement {
    return (
        <form
            className="border-t border-primary/10 py-4 flex items-center gap-x-2"
            onSubmit={onSubmit}
        >
            <Input
                disabled={isLoading}
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message"
                className="rounded-lg bg-primary/10"
            />

            <Button disabled={isLoading} variant="ghost">
                <SendHorizonal className="w-6 h-6" />
            </Button>
        </form>
    )
}