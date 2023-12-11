// top level imports
import { ReactElement } from "react";

// UI
import { CompanionForm } from "@/components/CompanionForm";

// Utils
import { prismadb } from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";

// type definitions
interface IPageProps {
    params: {
        companionId: string
    }
}

// Component definition
export default async function Companion({ params }: IPageProps): Promise<ReactElement> {
    // getting server context data
    const { userId } = auth();

    // authenticate
    if (!userId) {
        return redirectToSignIn();
    }

    // initialising/fetching data from database
    const companion = await prismadb.companion.findUnique({ where: { id: params.companionId } });

    const categories = await prismadb.category.findMany();

    // main renderer
    return (
        <div>
            <CompanionForm initData={companion} categories={categories} />
        </div>
    )
}
