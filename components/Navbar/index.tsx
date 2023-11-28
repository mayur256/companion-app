"use client"
// top level imports
import Link from "next/link"
import { Poppins } from "next/font/google"

// UI
import { Menu, Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "../ModeToggle"

// Clerk
import { UserButton } from "@clerk/nextjs"

// Utils
import { cn } from "@/lib/utils"

const font = Poppins({
    weight: "600",
    subsets: ["latin"]
})

// Component definition
export function Navbar() {
    return (
        <nav className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary">
            <div className="flex items-center" >
                <Menu className="block md:hidden" />
                <Link href="/">
                    <h1 className={cn("hidden md:block text-xl md:text-3xl font-bold text-primary", font.className)}>
                        companion.ai
                    </h1>
                </Link>
            </div>

            <div className="flex gap-x-3 items-center">
                <Button variant="premium">
                    Upgrade
                    <Sparkle className="h-4 w-4 fill-white text-white ml-2" />
                </Button>
                <ModeToggle />
                <UserButton />
            </div>
        </nav>
    )
}
