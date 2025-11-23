"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, User, Shield, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [userType, setUserType] = useState<"user" | "admin">("user")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent, action: "signin" | "signup") => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate admin credentials
    if (userType === "admin" && (email !== "admin@uol.edu.pk" || password !== "admin123")) {
      setError("Invalid admin credentials. Use admin@uol.edu.pk / admin123")
      return
    }

    const success = await login(email, password, action)

    if (success) {
      setSuccess(action === "signin" ? "Signed in successfully!" : "Account created successfully!")

      // Redirect based on user type
      setTimeout(() => {
        if (userType === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/user/dashboard")
        }
      }, 1000)
    } else {
      setError("Authentication failed. Please check your credentials and try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-sky-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">MediPedia</h1>
              <p className="text-sm text-muted-foreground">Smart AI Medical Database</p>
            </div>
          </div>
          <Badge variant="secondary" className="mb-4">
            Department of Technology, UOL
          </Badge>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* User Type Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card
            className={`cursor-pointer transition-all ${userType === "user" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"}`}
            onClick={() => setUserType("user")}
          >
            <CardContent className="p-4 text-center">
              <User className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold">User</p>
              <p className="text-xs text-muted-foreground">Student/Researcher</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${userType === "admin" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"}`}
            onClick={() => setUserType("admin")}
          >
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold">Admin</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </CardContent>
          </Card>
        </div>

        {/* Auth Forms */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{userType === "admin" ? "Admin Access" : "User Access"}</CardTitle>
            <CardDescription>
              {userType === "admin" ? "Sign in with administrator credentials" : "Sign in or create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userType === "admin" ? (
              // Admin Sign In Only
              <form onSubmit={(e) => handleSubmit(e, "signin")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    placeholder="admin@uol.edu.pk"
                    defaultValue="admin@uol.edu.pk"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In as Admin"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Use credentials: admin@uol.edu.pk / admin123
                </p>
              </form>
            ) : (
              // User Sign In/Sign Up Tabs
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={(e) => handleSubmit(e, "signin")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input id="signin-email" name="email" type="email" placeholder="your.email@uol.edu.pk" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={(e) => handleSubmit(e, "signup")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" name="email" type="email" placeholder="your.email@uol.edu.pk" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Developed under supervision of Mr. Nasir Noman
          <br />
          Department of Technology, The University of Lahore
        </p>
      </div>
    </div>
  )
}
