"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTenant } from "@/lib/tenant"
import { getPortalRoute } from "@/lib/auth"
import { Building2, School } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/hooks/use-auth"
import type { UserRole } from "@/lib/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { currentTenant, currentSchool, subdomain } = useTenant()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { login, isLoading } = useAuth()

  const schoolName = currentTenant?.name || (subdomain ? `${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} School` : 'Compasse')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("=== LOGIN ATTEMPT ===")
    console.log("Email:", email)
    console.log("Current School:", currentSchool?.name || schoolName)
    console.log("Current Tenant ID:", currentTenant?.id)
    console.log("Hostname:", typeof window !== 'undefined' ? window.location.hostname : 'N/A')

    try {
      const data = await login(email, password)
      if (!data.user) {
        throw new Error("No user data returned from login response")
      }

      console.log("=== LOGIN SUCCESSFUL ===")
      console.log("User:", data.user?.name)
      console.log("Role:", data.user?.role)

      // The token is already stored by apiClient interceptor
      // Invalidate 'me' query to refetch user data if needed
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });

      const user = data.user; // Use the user object from the login response
      
      // If no current school detected, redirect to the appropriate school subdomain
      if (!currentSchool && user.role !== 'super_admin') {
        console.log("=== NO SCHOOL DETECTED ===")
        const schoolDomain = user.tenant?.domain;
        const schoolSubdomain = schoolDomain ? schoolDomain.split('.')[0] : null;

        if (schoolSubdomain) {
          const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "theqcare.org"; // Define this in .env.local
          const schoolUrl = `https://${schoolSubdomain}.${baseDomain}/admin`; 
          
          console.log("Redirecting to school subdomain:", schoolUrl)
          window.location.href = schoolUrl
          return
        }
      }
      
      // Check if user belongs to current school
      if (currentTenant && user.tenant && user.tenant.id !== currentTenant.id) {
        console.log("=== SCHOOL MISMATCH ===")
        console.log("User Tenant ID:", user.tenant.id)
        console.log("Current Tenant ID:", currentTenant.id)
        setError("You don't have access to this school")
        localStorage.removeItem('token'); // Manually remove token if needed, or rely on global logout
        queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
        return
      }
      
      const role = ([
        "super_admin",
        "admin",
        "teacher",
        "head_teacher",
        "head_tutor",
        "class_teacher",
        "student",
        "parent",
        "librarian",
        "house_master",
      ] as string[]).includes(user.role)
        ? (user.role as UserRole)
        : "admin"

      const portalRoute = getPortalRoute(role)
      console.log("=== REDIRECTING ===")
      console.log("Portal Route:", portalRoute)
      console.log("Full URL:", typeof window !== 'undefined' ? `${window.location.origin}${portalRoute}` : 'N/A')
      
      // Use router.replace to avoid back button issues
      router.replace(portalRoute)
    } catch (err: any) {
      console.error("Login failed", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password."

      setError(message)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        {currentTenant ? (
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
              <School className="w-8 h-8 text-white" />
            </div>
          </div>
        ) : (
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
        )}
        <CardTitle className="text-2xl font-bold">{schoolName}</CardTitle>
        <CardDescription>
          {currentTenant ? `Sign in to ${currentTenant.name} portal` : "Sign in to your school portal"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
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
          <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        {currentTenant && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Sign in to {currentTenant.name}</p>
            {subdomain === 'demo' && (
              <>
                <p className="text-xs">Demo: admin@school.edu / password123</p>
              </>
            )}
            {subdomain === 'test' && (
              <>
                <p className="text-xs">Demo: admin@test.edu / password123</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
