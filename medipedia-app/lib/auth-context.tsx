"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, action: "signin" | "signup") => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session on mount
    const storedUser = localStorage.getItem("medipedia_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("medipedia_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, action: "signin" | "signup"): Promise<boolean> => {
    setIsLoading(true)
    try {
      console.log("[v0] Attempting login with:", { email, action })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication logic
      let isValidAuth = false

      if (action === "signin") {
        // Check admin credentials
        if (email === "admin@uol.edu.pk" && password === "admin123") {
          isValidAuth = true
        }
        // For demo purposes, accept any user credentials for regular users
        else if (email.includes("@") && password.length >= 6) {
          isValidAuth = true
        }
      } else if (action === "signup") {
        // For signup, just validate email format and password length
        if (email.includes("@") && password.length >= 6) {
          isValidAuth = true
        }
      }

      if (isValidAuth) {
        // Determine user role based on email
        const role = email === "admin@uol.edu.pk" ? "admin" : "user"

        const userData: User = {
          id: email, // Use email as ID for demo
          email,
          role,
        }

        console.log("[v0] Login successful:", userData)
        setUser(userData)
        localStorage.setItem("medipedia_user", JSON.stringify(userData))
        return true
      } else {
        console.log("[v0] Login failed: Invalid credentials")
        throw new Error("Invalid credentials")
      }

      /* 
      // Uncomment this section when connecting to actual backend:
      const response = await fetch(`http://localhost:8000/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        const role = email === "admin@uol.edu.pk" ? "admin" : "user"
        const userData: User = {
          id: data.user_id || data.id || email,
          email,
          role,
        }
        setUser(userData)
        localStorage.setItem("medipedia_user", JSON.stringify(userData))
        return true
      } else {
        throw new Error(data.detail || "Authentication failed")
      }
      */
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("medipedia_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
