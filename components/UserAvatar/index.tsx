"use client"

// top level imports
import { ReactElement } from "react"
import { useUser } from "@clerk/nextjs"

// UI 
import { Avatar, AvatarImage } from "@/components/ui/avatar"

// Component definition
export function UserAvatar(): ReactElement {
    const { user } = useUser();

    // main content render
    return (
        <Avatar className="h-12 w-12">
            <AvatarImage src={user?.imageUrl} />
        </Avatar>
    )
}