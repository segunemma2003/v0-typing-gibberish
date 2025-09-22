"use client"

import type React from "react"
import { useEffect } from "react"
import { useTenant } from "@/lib/tenant"

interface TenantProviderProps {
  children: React.ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { initializeTenant, isLoading } = useTenant()

  useEffect(() => {
    console.log("TenantProvider: Initializing tenant")
    const hostname = window.location.hostname
    console.log("TenantProvider: Hostname:", hostname)
    initializeTenant(hostname)
  }, [initializeTenant])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
