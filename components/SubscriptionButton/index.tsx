"use client"

// top level import
import { ReactElement, useState } from "react";
import axios from "axios";

// UI
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useToast } from "../ui/use-toast";

// props type definition
interface IProps {
    hasProSubscription: boolean | undefined
}

// Component definition
export function SubscriptionButton({ hasProSubscription }: IProps): ReactElement {
    // state definitions
    const [loading, setLoading] = useState<boolean>(false);

    // hook calls
    const { toast } = useToast();

    const onSubscriptionClicked = async (): Promise<void> => {
        try {
            setLoading(true);

            const response = await axios.get("/api/stripe");

            window.location.href = response.data.url;
        } catch {
            toast({ description: "Something went wrong", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    // main content renderer
    return (
        <Button
            size="sm"
            variant={hasProSubscription ? "default" : "premium"}
            disabled={loading}
            onClick={onSubscriptionClicked}
        >
            {hasProSubscription ? "Manage Subscription" : "Upgrade"}
            {!hasProSubscription && <Sparkles className="w-4 h-4 ml-2 fill-white" />}
        </Button>
    )
}