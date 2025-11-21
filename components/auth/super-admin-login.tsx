"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Mail, Building2, Sparkles } from "lucide-react"
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
    <div className="min-h-screen flex">
      {/* Left side - Background with image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMS4xLS45LTItMi0ySDI2Yy0xLjEgMC0yIC45LTIgMnYyYzAgMS4xLjkgMiAyIDJoOGMxLjEgMCAyLS45IDItMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full p-12 text-white">
          <div className="max-w-md space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Compasse</h1>
                  <p className="text-blue-100 text-sm">Education Management System</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold leading-tight">
                Super Admin Portal
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Manage all schools, users, and system-wide settings from a centralized dashboard.
              </p>
            </div>
            
            <div className="space-y-4 pt-8 border-t border-white/20">
              <div className="flex items-center space-x-3 text-blue-100">
                <Building2 className="w-5 h-5" />
                <span>Multi-tenant Management</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <Lock className="w-5 h-5" />
                <span>Enterprise-grade Security</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <Sparkles className="w-5 h-5" />
                <span>Advanced Analytics & Reporting</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Sign in to access the Super Admin Portal
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@compasse.net"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Access Super Admin Portal"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
