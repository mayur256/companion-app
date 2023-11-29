// top level imports
import { ReactElement } from "react";

// UI
import { SearchInput } from "@/components/SearchInput";
import { Categories } from "@/components/Categories";

// Utils
import { prismadb } from "@/lib/prismadb";

export default async function Home(): Promise<ReactElement> {
    const categories = await prismadb.category.findMany();

    return (
        <div className="h-full p-4 space-y-2">
            <SearchInput />

            <Categories categories={categories} />
        </div>
    )
}
