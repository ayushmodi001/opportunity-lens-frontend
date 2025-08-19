"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { doSocialLogin } from "../app/actions/index";
import { doCredLogin } from "@/app/actions"
import Image from "next/image"
import { toast } from "sonner"

export function LoginForm({ className, ...props }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  async function handleFormSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData(event.currentTarget)
      const response = await doCredLogin(formData)

      if (response?.error) {
        toast.error("Login Failed", {
          description: response.error,
        })
      } else {
        router.push("/dashboard")
      }

    } catch (e) {
      console.error(e)
      toast.error("Error", {
        description: "Oops! Something went wrong during login.",
      })
    } finally {
      setIsLoading(false)
    }
  }



  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    // Toast will be handled by the server action result
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="flex flex-col gap-4 p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-balance text-muted-foreground">
                Login to your account
              </p>
            </div>

            {/* Email/Password Login Form */}
            <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
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
                    onClick={togglePassword}
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
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter Password" 
                  required 
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <form action={doSocialLogin}>
                <Button name="action" value="google" variant="outline" className="w-full" type="submit">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.5,18.33 21.5,12.33C21.5,11.76 21.45,11.44 21.35,11.1Z"/></svg>
                    Login with Google
                </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </div>
          <div className="hidden bg-muted md:block">
            <Image
              src="/signupOl.svg"
              alt="Image"
              className=""
              width={500}
              height={100}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}