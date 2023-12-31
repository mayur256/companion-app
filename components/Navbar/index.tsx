"use client"
// top level imports
import { ReactElement } from "react"
import Link from "next/link"
import { Poppins } from "next/font/google"

// hooks
import { useProModal } from "@/hooks/use-modal"

// UI
import { Menu, Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "../ModeToggle"

// Clerk
import { UserButton } from "@clerk/nextjs"

// Utils
import { cn } from "@/lib/utils"
import { MobileSidebar } from "../MobileSidebar"


const font = Poppins({
    weight: "600",
    subsets: ["latin"]
});

// props type definition
interface IProps {
    hasProSubscription: boolean | undefined
}

// Component definition
export function Navbar({ hasProSubscription }: IProps): ReactElement {
    const proModal = useProModal();

    // main content renderer
    return (
        <nav className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
            <div className="flex items-center" >
                <MobileSidebar hasProSubscription={hasProSubscription} />
                <Link href="/">
                    <h1 className={cn("hidden md:block text-xl md:text-3xl font-bold text-primary", font.className)}>
                        companion.ai
                    </h1>
                </Link>
            </div>

            <div className="flex gap-x-3 items-center">
                {!hasProSubscription && (
                    <Button variant="premium" onClick={proModal.onOpen}>
                        Upgrade
                        <Sparkle className="h-4 w-4 fill-white text-white ml-2" />
                    </Button>
                )}
                <ModeToggle />
                <UserButton afterSignOutUrl="/" />
            </div>
        </nav>
    )
}
