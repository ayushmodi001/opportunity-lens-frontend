"use client"

import { LoginForm } from "@/components/login-form"
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user just signed up successfully
    if (searchParams.get('signup') === 'success') {
      toast({
        title: "Account Created Successfully",
        description: "Your account has been created. Please log in to continue.",
        variant: "default",
      });
      
      // Clean up the URL parameter
      const url = new URL(window.location);
      url.searchParams.delete('signup');
      window.history.replaceState({}, '', url);
    }
  }, [searchParams, toast]);

  return (
    (<div
      className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>)
  );
}
