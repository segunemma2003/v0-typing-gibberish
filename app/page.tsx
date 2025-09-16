"use client"
import { LoginForm } from "@/components/auth/login-form"
import { SuperAdminLogin } from "@/components/auth/super-admin-login"
import { SchoolNotFound } from "@/components/tenant/school-not-found"
import { useTenant } from "@/lib/tenant"

export default function HomePage() {
  const { currentSchool, subdomain, isSuperAdmin, isLoading } = useTenant()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Super admin portal
  if (isSuperAdmin) {
    return <SuperAdminLogin />
  }

  // School not found
  if (subdomain && !currentSchool) {
    return <SchoolNotFound subdomain={subdomain} />
  }

  // School login
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
