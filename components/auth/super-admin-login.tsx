"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useQueryClient } from "@tanstack/react-query"

export function SuperAdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, logout, isLoading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("Super admin login attempt:", { email })

    try {
      const data = await login(email, password)

      console.log("Super admin login successful:", { user: data.user?.name, role: data.user?.role })

      // Invalidate queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });

      if (data.user && data.user.role === "super_admin") {
        console.log("Redirecting to super admin dashboard")
        router.replace("/super-admin")
        return
      }

      console.log("Access denied - not super admin")
      setError("Access denied. Super admin credentials required.")
      await logout()
    } catch (err: any) {
      console.error("Super admin login failed:", err)
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password"
      setError(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-4">
        <Card className="w-full shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Super Admin Portal</CardTitle>
            <CardDescription className="text-gray-600">Manage schools and system-wide settings</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your super admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Access Super Admin"}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800 mb-2">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">Demo Credentials</span>
            </div>
            <p className="text-sm text-blue-700">superadmin@compasse.com</p>
            <p className="text-sm text-blue-700">password123</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
