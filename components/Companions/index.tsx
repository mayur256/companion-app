// top level imports
import Link from "next/link";
import { ReactElement } from "react";
import Image from "next/image"

import { Companion } from "@prisma/client"

// UI
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { MessagesSquare } from "lucide-react";



// types definitions
// props specifications
interface ICompanions {
    companions: (Companion & {
        _count: { messages: number }
    })[]
}

// Component definition
export function Companions({ companions }: ICompanions) {

    // main content renderer

    if (!companions.length) {
        return (
            <div className="pt-10 flex flex-col items-center justify-center space-y-3">
                <div className="relative w-60 h-60">
                    <Image
                        fill
                        className="grayscale"
                        src="/empty.png"
                        alt="Empty"
                    />
                </div>
                <p className="text-sm text-muted-foreground">No companions found.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
            {companions.map((companion: Companion & { _count: { messages: number } }): ReactElement => (
                <Card
                    key={companion.id}
                    className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
                >
                    <Link href={`/chat/${companion.id}`}>
                        <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
                            <div className="relative w-32 h-32">
                                <Image
                                    fill
                                    src={companion.src}
                                    className="rounded-xl object-cover"
                                    alt={companion.name}
                                />
                            </div>
                            <p className="font-bold">{companion.name}</p>
                            <p className="text-small">{companion.description}</p>
                        </CardHeader>

                        <CardFooter className="flex items-center justify-between text-muted-foreground text-xs">
                            <p className="lowercase">@{companion.userName}</p>
                            <div className="flex items-center">
                                <MessagesSquare className="w-3 mr-1 h-3" />
                                {companion._count.messages}
                            </div>
                        </CardFooter>
                    </Link>
                </Card>
            ))}
        </div>
    )
}