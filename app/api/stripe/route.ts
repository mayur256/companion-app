// top level imports
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";

// lib utils
import { prismadb } from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
    try {
        // get request context data
        const { userId } = auth();
        const user = await currentUser();

        // auth validation
        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get user subscription data from our db
        const userSubscription = await prismadb.userSubscription.findUnique({
            where: { userId }
        });

        // If the customer has subscription
        if (userSubscription && userSubscription?.stripeCustomerId) {
            // initiate a stripe session by redirecting the user to stripe
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });
            // present a stripe page to complete payment
            return new NextResponse(JSON.stringify({ url: stripeSession.url }));
        }

        // If the customer does not have subscription
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [{
                price_data: {
                    currency: "INR",
                    product_data: { name: "Companion Pro", description: "Pro subscription to Companion SAAS" },
                    unit_amount: 1000,
                    recurring: { interval: "month" }
                },
                quantity: 1
            }],
            metadata: { userId }
        })

        return new NextResponse(JSON.stringify({ url: stripeSession.url }));
        
    } catch (error) {
        console.error(`Error in /stripe :: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}