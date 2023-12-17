// top level imports
import { ReactElement } from "react";

// UI
import { SubscriptionButton } from "@/components/SubscriptionButton";

// Utils
import { checkSubscription } from "@/lib/subscription";

// Component definition
export default async function Settings(): Promise<ReactElement> {
    const hasProSubscription = await checkSubscription();

    return (
        <div className="h-full p-4 space-y-2">
            <h3 className="text-lg font-medium">Settings</h3>
            <div className="text-muted-foreground text-sm">
                {hasProSubscription ? "You are currently on a Pro plan." : "You are currently on a free plan."}
            </div>
            <SubscriptionButton hasProSubscription={hasProSubscription} />
        </div>
    )
};
