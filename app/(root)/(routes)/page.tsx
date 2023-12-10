// top level imports
import { ReactElement } from "react";

// UI
import { SearchInput } from "@/components/SearchInput";
import { Categories } from "@/components/Categories";

// Utils
import { prismadb } from "@/lib/prismadb";
import { Companions } from "@/components/Companions";

// Types definition
interface IHome {
    searchParams: {
        categoryId: string;
        name: string;
    }
}

// Page component definition
export default async function Home({ searchParams }: IHome): Promise<ReactElement> {
    const categories = await prismadb.category.findMany();
    const companions = await prismadb.companion.findMany({
        where: {
            categoryId: searchParams.categoryId,
            name: { search: searchParams.name }
        },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { messages: true } } }
    });

    // main content renderer
    return (
        <div className="h-full p-4 space-y-2">
            <SearchInput />

            <Categories categories={categories} />

            <Companions companions={companions} />
        </div>
    )
}
