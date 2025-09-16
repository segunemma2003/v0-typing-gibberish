"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTenant } from "@/lib/tenant"
import { useAuth } from "@/hooks/use-auth"

interface TenantGuardProps {
  children: React.ReactNode
  requireSchool?: boolean
  requireSuperAdmin?: boolean
  allowedRoles?: string[]
}

export function TenantGuard({
  children,
  requireSchool = false,
  requireSuperAdmin = false,
  allowedRoles = [],
}: TenantGuardProps) {
  const { currentSchool, isSuperAdmin, isLoading: tenantLoading } = useTenant()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait for both tenant and auth to load
    if (tenantLoading || authLoading) return

    // Check super admin requirement
    if (requireSuperAdmin && !isSuperAdmin) {
      router.push("/")
      return
    }

    // Check school requirement
    if (requireSchool && !currentSchool) {
      router.push("/")
      return
    }

    // Check authentication
    if (!isAuthenticated || !user) {
      router.push("/")
      return
    }

    // Check role permissions
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      router.push("/")
      return
    }

    // Check if user belongs to current school (for non-super admin)
    if (!isSuperAdmin && currentSchool && user.schoolId !== currentSchool.id) {
      router.push("/")
      return
    }
  }, [
    tenantLoading,
    authLoading,
    requireSchool,
    requireSuperAdmin,
    allowedRoles,
    currentSchool,
    isSuperAdmin,
    isAuthenticated,
    user,
    router,
  ])

  // Show loading while checking permissions
  if (tenantLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Check all conditions before rendering
  if (requireSuperAdmin && !isSuperAdmin) return null
  if (requireSchool && !currentSchool) return null
  if (!isAuthenticated || !user) return null
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) return null
  if (!isSuperAdmin && currentSchool && user.schoolId !== currentSchool.id) return null

  return <>{children}</>
}
