"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { useTenant } from "@/lib/tenant"
import { getPortalRoute } from "@/lib/auth"
import { Building2 } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const { currentSchool } = useTenant()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("=== LOGIN ATTEMPT ===")
    console.log("Email:", email)
    console.log("Current School:", currentSchool?.name)
    console.log("Current School ID:", currentSchool?.id)
    console.log("Hostname:", typeof window !== 'undefined' ? window.location.hostname : 'N/A')

    const success = await login(email, password)
    
    if (success) {
      const user = useAuth.getState().user
      console.log("=== LOGIN SUCCESSFUL ===")
      console.log("User:", user?.name)
      console.log("Role:", user?.role)
      console.log("School ID:", user?.schoolId)
      
      if (user) {
        // If no current school detected, redirect to the appropriate school subdomain
        if (!currentSchool && user.role !== 'super_admin') {
          console.log("=== NO SCHOOL DETECTED ===")
          console.log("User belongs to school:", user.schoolId)
          
          // Find the school by ID to get its subdomain
          const schoolSubdomain = user.schoolId === 'school-demo' ? 'demo' :
                                 user.schoolId === 'school-test' ? 'test' :
                                 user.schoolId === 'school-1' ? 'greenwood' :
                                 user.schoolId === 'school-2' ? 'riverside' : null
          
          if (schoolSubdomain) {
            // Try subdomain first, fallback to URL parameter
            const schoolUrl = `https://${schoolSubdomain}.theqcare.org/admin`
            const fallbackUrl = `https://theqcare.org/admin?school=${schoolSubdomain}`
            
            console.log("Redirecting to school subdomain:", schoolUrl)
            console.log("Fallback URL:", fallbackUrl)
            
            // Try subdomain first
            window.location.href = schoolUrl
            return
          }
        }
        
        // Check if user belongs to current school
        if (currentSchool && user.schoolId !== currentSchool.id) {
          console.log("=== SCHOOL MISMATCH ===")
          console.log("User School ID:", user.schoolId)
          console.log("Current School ID:", currentSchool.id)
          setError("You don't have access to this school")
          useAuth.getState().logout()
          return
        }
        
        const portalRoute = getPortalRoute(user.role)
        console.log("=== REDIRECTING ===")
        console.log("Portal Route:", portalRoute)
        console.log("Full URL:", typeof window !== 'undefined' ? `${window.location.origin}${portalRoute}` : 'N/A')
        
        // Use router.replace to avoid back button issues
        router.replace(portalRoute)
      }
    } else {
      console.log("=== LOGIN FAILED ===")
      setError("Invalid email or password")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        {currentSchool && (
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
        )}
        <CardTitle className="text-2xl font-bold">{currentSchool ? currentSchool.name : "Compasse"}</CardTitle>
        <CardDescription>
          {currentSchool ? `Sign in to ${currentSchool.name} portal` : "Sign in to your school portal"}
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
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Demo credentials for {currentSchool?.name}:</p>
          {currentSchool?.subdomain === 'demo' && (
            <>
              <p>admin@school.edu / password123</p>
              <p>teacher@school.edu / password123</p>
              <p>student@school.edu / password123</p>
              <p>parent@school.edu / password123</p>
            </>
          )}
          {currentSchool?.subdomain === 'test' && (
            <>
              <p>admin@test.edu / password123</p>
              <p>teacher@test.edu / password123</p>
              <p>student@test.edu / password123</p>
            </>
          )}
          {currentSchool?.subdomain === 'greenwood' && (
            <>
              <p>admin@greenwood.edu / password123</p>
              <p>teacher@greenwood.edu / password123</p>
              <p>student@greenwood.edu / password123</p>
            </>
          )}
          {currentSchool?.subdomain === 'riverside' && (
            <>
              <p>admin@riverside.edu / password123</p>
              <p>teacher@riverside.edu / password123</p>
              <p>student@riverside.edu / password123</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
