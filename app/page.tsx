"use client"

import { Suspense, useEffect, useState } from "react"
import { LandingPage } from "@/components/landing-page/LandingPage"
import { SchoolLandingPage } from "@/components/landing-page/SchoolLandingPage"
import { useTenant } from "@/lib/tenant"

export default function HomePage() {
  const { isSuperAdmin, isLoading } = useTenant()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading School Management System...</p>
        </div>
      </div>
    )
  }

  // If on subdomain, show school landing page
  // If on main domain, show main landing page
  if (!isSuperAdmin) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading School Portal...</p>
          </div>
        </div>
      }>
        <SchoolLandingPage />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading School Management System...</p>
        </div>
      </div>
    }>
      <LandingPage />
    </Suspense>
  )
}
