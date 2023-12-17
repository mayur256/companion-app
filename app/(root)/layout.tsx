// top level imports
import { ReactElement, ReactNode } from "react"
import { Toaster } from "@/components/ui/toaster"

// Constituent components
import { Navbar } from "@/components/Navbar"
import { Sidebar } from "@/components/Sidebar"

// Utils
import { checkSubscription } from "@/lib/subscription"

// Component definition
export default async function AuthLayout({ children }: { children: ReactNode }): Promise<ReactElement> {
    const hasProSubscription = await checkSubscription();

    return (
        <div className="h-full">
            <Navbar hasProSubscription={hasProSubscription} />

            <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
                <Sidebar hasProSubscription={hasProSubscription} />
            </div>
            <main className="md:pl-20 pt-16 h-full">
                {children}
                <Toaster />
            </main>
        </div>
    )
}
