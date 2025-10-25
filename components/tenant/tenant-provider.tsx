"use client"

import type React from "react"
import { useEffect } from "react"
import { useTenant } from "@/lib/tenant"
import { tenantService } from "@/lib/api/tenants"

interface TenantProviderProps {
  children: React.ReactNode
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { initializeTenant, isLoading, setTenant } = useTenant()

  useEffect(() => {
    const fetchTenantData = async () => {
      console.log("TenantProvider: Initializing tenant from headers...")
      let detectedHostname = window.location.hostname;
      let detectedSubdomain: string | null = null;
      let isSuperAdminFromHeader: boolean = false;

      // Attempt to read headers set by middleware (for SSR/SSG/ISR)
      if (typeof window !== 'undefined') {
        // For client-side navigation or initial load after SSR, headers might not be directly accessible
        // Instead, rely on the `initializeTenant` which uses `getTenantFromHostname`
        // Or, if using a server component, pass initial tenant props.
        // For this `ClientProvider`, we'll let `initializeTenant` do the heavy lifting.
      }

      // Call the initializeTenant which now fetches from API
      // It already handles hostname detection and API calls
      await initializeTenant(detectedHostname);
    };

    fetchTenantData();
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
