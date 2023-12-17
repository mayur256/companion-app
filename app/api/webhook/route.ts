// top level imports
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Stripe
import Stripe from "stripe"

// Utils
import { stripe } from "@/lib/stripe";
import { prismadb } from "@/lib/prismadb";

export async function POST(req: Request) {
    // request body extraction and initialisation
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    // Constructing event based on payload and stripe request
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (error: any) {
        return new NextResponse(`Webhook error - ${error}`, { status: 400 });
    }

    // Handle event
    const session = event.data.object as Stripe.Checkout.Session;

    // Case - User subscription is completed
    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        // In case the session does not have expected metadata
        if (!session?.metadata?.userId) {
            return new NextResponse(`User Id is missing!`, { status: 400 });
        }

        // presist the subscription info in our db
        await prismadb.userSubscription.create({
            data: {
                userId: session.metadata.userId,
                stripeCustomerId: subscription.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
            }
        })
    }

    // Case - User updates subscription
    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        if (subscription.id) {
            await prismadb.userSubscription.update({
                where: { stripeSubscriptionId: subscription.id },
                data: {
                    stripePriceId: subscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
                }
            })
        }
    }

    return new NextResponse(null, { status: 200 });
};
