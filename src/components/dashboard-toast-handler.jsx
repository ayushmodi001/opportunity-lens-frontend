"use client"

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function DashboardToastHandler() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user just logged in successfully
    if (searchParams.get('login') === 'success') {
      toast({
        title: "Login Successful",
        description: "Welcome back! You have successfully logged in.",
        variant: "default",
      });
      
      // Clean up the URL parameter
      const url = new URL(window.location);
      url.searchParams.delete('login');
      window.history.replaceState({}, '', url);
    }
    
    // Check if user just signed up successfully
    if (searchParams.get('signup') === 'success') {
      toast({
        title: "Welcome to Opportunity Lens!",
        description: "Your account has been created successfully.",
        variant: "default",
      });
      
      // Clean up the URL parameter
      const url = new URL(window.location);
      url.searchParams.delete('signup');
      window.history.replaceState({}, '', url);
    }
  }, [searchParams, toast]);

  return null; // This component doesn't render anything visible
}
