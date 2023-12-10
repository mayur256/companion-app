import { prismadb } from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

        // create a new companion in the system
        const newCompanion = await prismadb.companion.create({
            data: { userId: user.id, userName: user.firstName, src, name, description, instructions, seed, categoryId }
        });

        return NextResponse.json(newCompanion);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}