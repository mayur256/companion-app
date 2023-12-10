"use client"

// top level imports
import { ReactElement } from "react"

// UI 
import { Avatar, AvatarImage } from "@/components/ui/avatar"

// props type definition
interface IBotAvatar {
    src: string
}

// Component definition
export function BotAvatar({ src }: IBotAvatar): ReactElement {

    // main content render
    return (
        <Avatar className="h-12 w-12">
            <AvatarImage src={src} />
        </Avatar>
    )
}