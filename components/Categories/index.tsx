"use client"

// top level imports
import { ReactElement } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// QS
import qs from "query-string"

import { Category } from "@prisma/client"

// Utils
import { cn } from "@/lib/utils"

interface IProps {
    categories: Category[]
}

// Component definition
export function Categories({ categories = [] }: IProps): ReactElement {

    // routing hooks and props
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");

    const onCategoryClick = (id: string | undefined) => {
        const query = { categoryId: id }
        const url = qs.stringifyUrl(
            { url: window.location.href, query },
            { skipEmptyString: true, skipNull: true }
        )

        router.push(url)
    }

    // main renderer
    return (
        <div className="w-full overflow-x-auto space-x-2 flex p-1">
            <button
                onClick={() => onCategoryClick(undefined)}
                className={cn(`
                    flex 
                    items-center 
                    text-center 
                    text-xs 
                    md:text-sm 
                    px-2 
                    md:px-4 
                    py-2 
                    md:py-3 
                    rounded-md 
                    bg-primary/10 
                    hover:opacity-75 
                    transition
                    `,
                    !categoryId ? 'bg-primary/25' : 'bg-primary/10'
                )}
            >
                Newest
            </button>

            {categories.map((item: Category): ReactElement => (
                <button
                    onClick={() => onCategoryClick(item.id)}
                    className={cn(`
                        flex 
                        items-center 
                        text-center 
                        text-xs 
                        md:text-sm 
                        px-2 
                        md:px-4 
                        py-2 
                        md:py-3 
                        rounded-md 
                        bg-primary/10 
                        hover:opacity-75 
                        transition
                    `,
                        item.id === categoryId ? 'bg-primary/25' : 'bg-primary/10'
                    )}
                    key={item.id}
                >
                    {item.name}
                </button>
            ))}
        </div>
    )
}