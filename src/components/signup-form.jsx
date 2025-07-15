"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {doSocialLogin} from "@/app/actions";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export function SgForm({ className, ...props }) {

  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  // Add loading state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePassword = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true)
    // Toast will be handled by the server action result
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true)
    try {
      const formData = new FormData(event.currentTarget)

      const Username = formData.get('Username')
      const email = formData.get('email')
      const password = formData.get('password')
      const cpassword = formData.get('cpassword')

      // Client-side validation
      if (password !== cpassword) {
        setIsLoading(false)
        toast({
          title: "Password Mismatch",
          description: "Password and confirm password do not match.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`api/register`,{
        method : "POST",
        headers : {
          "content-type" : "application/json",
        },
        body : JSON.stringify({
          Username,
          email,
          password,
          cpassword
        })
      })

      if (response.status === 201) {
        // Redirect to login with signup success parameter
        router.push('/login?signup=success')
      } else {
        const errorData = await response.json()
        setIsLoading(false)
        toast({
          title: "Sign Up Failed",
          description: errorData.message || "An error occurred during sign up. Please try again.",
          variant: "destructive",
        })
      }

    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast({
        title: "Sign Up Failed",
        description: "An error occurred during sign up. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-balance text-muted-foreground">
                  Create your account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Username">Username</Label>
                <Input 
                  id="Username" 
                  type="text" 
                  name="Username" 
                  placeholder="Enter your Username" 
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  name="email" 
                  placeholder="Enter your email" 
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => togglePassword('password')}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  name="password" 
                  placeholder="Enter Password" 
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cpassword">Confirm Password</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => togglePassword('confirm')}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Input 
                  id="cpassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  name="cpassword" 
                  placeholder="Confirm Password" 
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
            
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            
            <form action={doSocialLogin}>
              <Button 
                className="w-full" 
                type="submit" 
                value="google" 
                name="action"
                disabled={isGoogleLoading}
                onClick={handleGoogleSignup}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Sign-up using Google
                  </>
                )}
              </Button>
            </form>
            
            <div className="text-center text-sm">
              Have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </div>
          <div className="bg-muted flex">
            <Image 
              src="/loginOl.svg" 
              alt="Login Image" 
              width={500} 
              height={500} 
              priority
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/loginOL.svg'; 
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}