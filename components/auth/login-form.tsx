"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTenant } from "@/lib/tenant"
import { getPortalRoute } from "@/lib/auth"
import { Building2, School, Mail, Lock, GraduationCap, Users, BookOpen } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/hooks/use-auth"
import type { UserRole } from "@/lib/auth"
import { useSchoolBySubdomain } from "@/lib/api/public"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { currentTenant, currentSchool, subdomain } = useTenant()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { login, isLoading } = useAuth()
  
  // Fetch school data including logo
  const { data: schoolData } = useSchoolBySubdomain(subdomain || "")

  const schoolName = currentTenant?.name || (subdomain ? `${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} School` : 'Compasse')
  const schoolLogo = schoolData?.school?.logo || null
  const schoolImage = schoolLogo || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80"

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
        "finance",
        "accountant",
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
    <div className="min-h-screen flex">
      {/* Left side - Background with school image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* School image background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${schoolImage})`,
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/85 to-purple-900/90"></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMS4xLS45LTItMi0ySDI2Yy0xLjEgMC0yIC45LTIgMnYyYzAgMS4xLjkgMiAyIDJoOGMxLjEgMCAyLS45IDItMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full p-12 text-white">
          <div className="max-w-md space-y-8">
            <div className="space-y-6">
              {/* School Logo */}
              {schoolLogo ? (
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl p-4">
                    <img 
                      src={schoolLogo} 
                      alt={schoolName}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <School className="w-12 h-12 text-white hidden" />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl">
                    <School className="w-12 h-12 text-white" />
                  </div>
                </div>
              )}
              
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold leading-tight">
                  {schoolName}
                </h1>
                <p className="text-lg text-blue-100 leading-relaxed">
                  Welcome to your school portal. Sign in to access your dashboard.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pt-8 border-t border-white/20">
              <div className="flex items-center space-x-3 text-blue-100">
                <GraduationCap className="w-5 h-5" />
                <span>Student Management</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <Users className="w-5 h-5" />
                <span>Staff & Faculty Portal</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <BookOpen className="w-5 h-5" />
                <span>Academic Resources</span>
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
              {/* School Logo on mobile/desktop form */}
              {schoolLogo ? (
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img 
                    src={schoolLogo} 
                    alt={schoolName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <School className="w-10 h-10 text-white hidden" />
          </div>
        ) : (
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <School className="w-10 h-10 text-white" />
          </div>
        )}
              
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Sign in to {schoolName}
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
                      placeholder="your.email@school.com"
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
                    "Sign In to Portal"
                  )}
          </Button>
        </form>
              
              {/* Demo credentials hint */}
              {currentTenant && (subdomain === 'demo' || subdomain === 'test') && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
                  <p className="text-xs text-blue-700">
                    Email: admin@{subdomain}.edu<br />
                    Password: password123
                  </p>
          </div>
        )}
      </CardContent>
    </Card>
        </div>
      </div>
    </div>
  )
}
