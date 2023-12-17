"use client";

// top level imports
import { ReactElement, useState, useEffect } from "react";
import axios from "axios";

// hooks
import { useProModal } from "@/hooks/use-modal";

// UI
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Component definition
export function ProModal(): ReactElement | null {

    // state definition
    const proModal = useProModal();
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // lifecycle hooks
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // hook calls
    const { toast } = useToast();

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/stripe");

            window.location.href = response.data.url;
        } catch (error) {
            toast({ description: "Something went wrong", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    // main content renderer
    if (!isMounted) {
        return null;
    }


    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center">
                        Upgrade to Pro
                    </DialogTitle>
                    <DialogDescription className="text-center space-y-2">
                        Create
                        <span className="text-sky-500 mx-1 font-medium">Custom AI</span>
                        Companions!
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="flex justify-between">
                    <p className="text-2xl font-medium">
                        &#8377;1000/mo
                    </p>
                    <Button onClick={onSubscribe} disabled={loading} variant="premium">
                        Subscribe
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
	)
}
