"use client"

// top level imports
import { ReactElement } from "react";
import { useTheme } from "next-themes";

// UI
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";
import { BotAvatar } from "../BotAvatar";
import { UserAvatar } from "@/components/UserAvatar";
import { BeatLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

// Utils
import { cn } from "@/lib/utils";

// props type definition
export interface IChatMessage {
    role: 'system' | 'user';
    isLoading?: boolean;
    content?: string;
    src?: string;
}

// Component definition
export function ChatMessage({
    role,
    isLoading,
    content,
    src
}: IChatMessage): ReactElement {

    // hooks
    const { toast } = useToast();
    const { theme } = useTheme();

    const onCopy = () => {
        if (!content) {
            return;
        }

        navigator.clipboard.writeText(content);
        toast({ description: "Message copied to clipboard.", duration: 3000 });
    }

    // main content renderer
    return (
        <div className={cn(
            "group flex items-start gap-x-3 py-4 w-full",
            role === "user" && "justify-end"
        )}>
            {role !== "user" && src && <BotAvatar src={src} />}
            <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
                {isLoading && role !== "user"
                    ? <BeatLoader color={theme === "light" ? "black" : "white"} size={5} />
                    : content
                }
            </div>
            {role === "user" && <UserAvatar />}
            {role !== "user" && !isLoading && (
                <Button
                    onClick={onCopy}
                    className="opacity-0 group-hover:opacity-100 transition"
                    size="icon"
                    variant="ghost"
                >
                    <Copy className="w-4 h-4" />
                </Button>
            )}
        </div>
    )
}