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