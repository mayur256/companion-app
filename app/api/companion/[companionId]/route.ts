import { prismadb } from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: { companionId: string } }
) {
    try {
        // fetching required data from request
        const reqBody = await request.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId } = reqBody;

        // Unauthorised access
        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Request body validation
        if (!src || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400 });
        };

        if (!params.companionId) {
            return new NextResponse("Companion Id is required", { status: 400 });
        }

        // Check whether user is subscribed to pro services
        const hasProSubscription = await checkSubscription();
        if (!hasProSubscription) {
            return new NextResponse("Please get a pro subscription to create a companion", { status: 403 })
        }

        // create a new companion in the system
        const updatedCompanion = await prismadb.companion.update({
            where: { id: params.companionId },
            data: { userId: user.id, userName: user.firstName, src, name, description, instructions, seed, categoryId }
        });

        return NextResponse.json(updatedCompanion);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { companionId: string } }
) {
    try {
        // fetching required data from request or server session/context
        const user = await currentUser();

        // Unauthorised access
        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.companionId) {
            return new NextResponse("Companion Id is required", { status: 400 });
        }

        // DELETES a companion in the system
        await prismadb.companion.delete({
            where: { id: params.companionId, userId: user.id }
        });

        return NextResponse.json({ message: 'Companion deleted' });
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}