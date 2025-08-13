"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Info } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {doSocialLogin} from "@/app/actions";
import Image from "next/image";
import { toast } from "sonner";

export function SgForm({ className, ...props }) {

  const router = useRouter()
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

  const showPasswordInfo = () => {
    toast.info("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.", {
      duration: 8000,
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const Username = formData.get('Username')
    const email = formData.get('email')
    const password = formData.get('password')
    const cpassword = formData.get('cpassword')

    // Client-side validation
    if (password !== cpassword) {
      setIsLoading(false)
      toast.error("Password Mismatch", {
        description: "Password and confirm password do not match.",
      })
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setIsLoading(false);
      toast.error("Invalid Password", {
        description: "Password does not meet the required criteria. Click the info icon for details.",
      });
      return;
    }

    try {
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
        toast.error("Sign Up Failed", {
          description: errorData.message || "An error occurred during sign up. Please try again.",
        })
      }

    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error("Sign Up Failed", {
        description: "An error occurred during sign up. Please try again.",
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
                  <div className="flex items-center gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Info 
                      className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground" 
                      onClick={showPasswordInfo}
                    />
                  </div>
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
                  name="action" 
                  value="google" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleSignup}
                  disabled={isLoading || isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Image src="/google.svg" alt="Google" width={16} height={16} className="mr-2" />
                  )}
                  Google
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                Login
              </Link>
            </p>
          </div>
          <div className="hidden bg-muted md:flex md:items-center md:justify-center p-8">
            <Image 
              src="/signupOl.svg" 
              alt="Sign Up Illustration" 
              width={400} 
              height={400} 
              className="object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}