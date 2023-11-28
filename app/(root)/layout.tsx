// top level imports
import { ReactNode } from "react"

// Constituent components
import { Navbar } from "@/components/Navbar"

// Component definition
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-full">
            <Navbar />
            <main className="md:pl-20 pt-16 h-full">
                {children}
            </main>
        </div>
    )
}
