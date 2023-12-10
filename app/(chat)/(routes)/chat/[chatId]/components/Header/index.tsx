"use client"

// top level imports
import { ReactElement } from "react"
import axios from "axios";
import { useRouter } from "next/navigation";
import { Companion, Message } from "@prisma/client"
import { useUser } from "@clerk/nextjs";

// UI lib
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, MessagesSquare, MoreVertical, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

// Constituent components
import { BotAvatar } from "../BotAvatar";


// props type definition
interface IChatHeader {
    companion: Companion & {
        messages: Message[];
        _count: { messages: number }
    }
}

// Component definition
export function ChatHeader({ companion }: IChatHeader): ReactElement {

    // hooks
    const router = useRouter();
    const { user } = useUser();
    const { toast } = useToast();

    const onDelete = async () => {
        try {
            await axios.delete(`/api/companion/${companion.id}`);
            toast({ description: 'Toast deleted!' });
            router.refresh();
            router.push("/");
        } catch {
            toast({ variant: "destructive", description: "Something went wrong!" });
        }
    }

    // main content render
    return (
        <div className="flex items-center justify-between border-b border-primaty/10 pb-4 w-full">
            <div className="flex gap-x-2 items-center">
                <Button size="icon" variant="ghost" onCanPlay={() => router.back()}>
                    <ChevronLeft className="h-8 w-8" />
                </Button>

                <BotAvatar src={companion.src} />

                {/** Name and messages count */}
                <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <p className="font-bold">{companion.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <MessagesSquare className="w-3 h-3 mr-1" />
                            {companion._count.messages}
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground"> Created by {companion.userName}</p>
                </div>
            </div>

            {user?.id === companion.userId && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="secondary">
                            <MoreVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/companion/${companion.id}`)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onDelete}> <Trash className="w-4 h-4 mr-2" /> Delete </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}