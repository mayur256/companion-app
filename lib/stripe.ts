// top level imports
import Stripe from "stripe"

// Creates a signed object to communicate with stripe API
export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2023-10-16",
    typescript: true
});