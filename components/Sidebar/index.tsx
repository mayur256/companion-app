"use client"

// top level imports
import { ReactElement } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link"

// UI
import { Home, Plus, Settings } from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Utils
import { cn } from "@/lib/utils";

// type definitions
interface Route {
    icon: LucideIcon;
    href: string;
    label: string;
    isProtected: boolean
}

// Component definition
export function Sidebar() {
    // Constants
    const routes: Route[] = [
        {
            icon: Home,
            href: '/',
            label: 'Home',
            isProtected: false
        },
        {
            icon: Plus,
            href: '/companion/new',
            label: 'Create',
            isProtected: true
        },
        {
            icon: Settings,
            href: '/settings',
            label: 'Settings',
            isProtected: false
        }
    ];

    // hooks
    const pathname = usePathname();
    const router = useRouter();

    /** Handler/Utility functions - starts */

    const onNavigate = (url: string, isProtected: boolean): any => {
        router.push(url);
    }

    /** Handler/Utility functions - ends */

    // main renderer
    return (
        <div className="space-y-4 flex flex-col h-full text-primary bg-secondary">
            <div className="p-3 flex flex-1 justify-center">
                <div className="space-y-2">
                    {routes.map((route: Route, index: number): ReactElement => (
                        <div
                            onClick={() => onNavigate(route.href, route.isProtected)}
                            key={`${route.label}-${index}`}
                            className={cn(
                                "text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                                pathname === route.href && "bg-primary/10 text-primary"
                            )}
                        >
                            <div className="flex flex-col items-center flex-1 gap-y-2">
                                <route.icon className="h-5 w-5" />
                                {route.label}
                            </div>    
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
