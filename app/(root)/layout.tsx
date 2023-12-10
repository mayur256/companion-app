// top level imports
import { ReactNode } from "react"
import { Toaster } from "@/components/ui/toaster"

// Constituent components
import { Navbar } from "@/components/Navbar"
import { Sidebar } from "@/components/Sidebar"

// Component definition
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-full">
            <Navbar />

            <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
                <Sidebar />
            </div>
            <main className="md:pl-20 pt-16 h-full">
                {children}
                <Toaster />
            </main>
        </div>
    )
}
