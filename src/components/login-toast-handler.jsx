"use client"

import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function LoginToastHandler() {
    const searchParams = useSearchParams();
    const { toast } = useToast();

    useEffect(() => {
        if (searchParams.get('signup') === 'success') {
            toast({
                title: "Registration Successful",
                description: "Your account has been created. Please log in.",
                variant: "default",
            });
            // Clean up the URL
            const url = new URL(window.location);
            url.searchParams.delete('signup');
            window.history.replaceState({}, '', url);
        }
    }, [searchParams, toast]);

    return null; // This component does not render anything
}
