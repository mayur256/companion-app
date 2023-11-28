// top level imports
import { ReactNode } from "react"

// Component definition
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center justify-center h-full">
            {children}
        </div>
    )
}
