"use client"

import { create } from "zustand"
// import { getSchoolBySubdomain, type School } from "./auth" // Remove old imports
// import { getDynamicSchoolBySubdomain, type DynamicSchool } from "./dynamic-schools" // Remove old imports
import { tenantService, type Tenant } from "@/lib/api/tenants" // Import new tenantService and Tenant interface

export interface TenantState {
  currentTenant: Tenant | null // Renamed to currentTenant
  subdomain: string | null
  isSuperAdmin: boolean
  isLoading: boolean
}

interface TenantStore extends TenantState {
  setTenant: (subdomain: string | null, tenant: Tenant | null, isSuperAdmin: boolean) => void // Updated parameter
  clearTenant: () => void
  initializeTenant: (hostname?: string) => Promise<void>
}

export const useTenant = create<TenantStore>()((set, get) => ({
  currentTenant: null, // Renamed
  subdomain: null,
  isSuperAdmin: false,
  isLoading: true,

  setTenant: (subdomain, tenant, isSuperAdmin) => { // Updated parameter
    set({
      subdomain,
      currentTenant: tenant, // Renamed
      isSuperAdmin,
      isLoading: false,
    })
  },

  clearTenant: () => {
    set({
      currentTenant: null, // Renamed
      subdomain: null,
      isSuperAdmin: false,
      isLoading: false,
    })
  },

  initializeTenant: async (hostname?: string) => {
    console.log("initializeTenant called with hostname:", hostname)
    set({ isLoading: true })

    try {
      let detectedHostname = hostname

      // If no hostname provided, get from window (client-side)
      if (!detectedHostname && typeof window !== "undefined") {
        detectedHostname = window.location.hostname
        console.log("TenantProvider: Detected hostname from window:", detectedHostname)
        
        // The URL parameter logic might be simplified or removed as API should handle domains
        const urlParams = new URLSearchParams(window.location.search)
        const schoolParam = urlParams.get('school')
        console.log("School param from URL:", schoolParam)
        
        // --- Start of API-driven Tenant Resolution --- //

        const { subdomain: detectedSubdomain, isSuperAdmin } = getTenantFromHostname(detectedHostname)

        if (isSuperAdmin) {
          console.log("Detected as super admin")
          set({
            currentTenant: null, // Renamed
            subdomain: null,
            isSuperAdmin: true,
            isLoading: false,
          })
          return
        }

        if (detectedSubdomain) {
          console.log("Attempting to fetch tenant for subdomain:", detectedSubdomain);
          const tenantsResponse = await tenantService.getTenants(); // Fetch all tenants
          const allTenants = tenantsResponse.data;

          // Find the tenant that matches the detected subdomain or domain
          const foundTenant = allTenants.find(
            (t) => t.domain.split('.')[0] === detectedSubdomain || t.domain === detectedHostname
          );

          if (foundTenant) {
            console.log("Found tenant:", foundTenant.name, "ID:", foundTenant.id);
            set({
              currentTenant: foundTenant, // Renamed
              subdomain: detectedSubdomain,
              isSuperAdmin: false,
              isLoading: false,
            });
            return;
          } else {
            console.log("No active tenant found for subdomain/domain:", detectedSubdomain || detectedHostname);
            set({
              currentTenant: null, // Renamed
              subdomain: detectedSubdomain,
              isSuperAdmin: false,
              isLoading: false,
            });
            return;
          }
        }

        // If no subdomain and not super admin, it might be the base domain or an error
        console.log("No subdomain detected and not super admin. Defaulting to super admin or no tenant.");
        set({
          currentTenant: null, // Renamed
          subdomain: null,
          isSuperAdmin: true, // Assuming default to super_admin on base domain
          isLoading: false,
        });
        return;
        // --- End of API-driven Tenant Resolution --- //

      }

      // This part handles server-side detection (e.g., via middleware setting meta tags)
      if (!detectedHostname && typeof document !== "undefined") {
        const metaTag = document.querySelector('meta[name="x-tenant-hostname"]')
        if (metaTag) {
          detectedHostname = metaTag.getAttribute("content") || ""
        }
      }

      // Re-run the API-driven resolution for server-side detected hostname
      if (detectedHostname) {
        const { subdomain: detectedSubdomain, isSuperAdmin } = getTenantFromHostname(detectedHostname)

        if (isSuperAdmin) {
          set({
            currentTenant: null, // Renamed
            subdomain: null,
            isSuperAdmin: true,
            isLoading: false,
          })
          return
        }

        if (detectedSubdomain) {
          console.log("Attempting to fetch tenant for server-side detected subdomain:", detectedSubdomain);
          const tenantsResponse = await tenantService.getTenants(); // Fetch all tenants
          const allTenants = tenantsResponse.data;

          const foundTenant = allTenants.find(
            (t) => t.domain.split('.')[0] === detectedSubdomain || t.domain === detectedHostname
          );

          if (foundTenant) {
            console.log("Found tenant server-side:", foundTenant.name);
            set({
              currentTenant: foundTenant, // Renamed
              subdomain: detectedSubdomain,
              isSuperAdmin: false,
              isLoading: false,
            });
            return;
          } else {
            console.log("No active tenant found server-side for subdomain/domain:", detectedSubdomain || detectedHostname);
            set({
              currentTenant: null, // Renamed
              subdomain: detectedSubdomain,
              isSuperAdmin: false,
              isLoading: false,
            });
            return;
          }
        }
      }

      // Final fallback for situations where no tenant is detected
      console.log("Final fallback - treating as super admin (no tenant detected at all)")
      set({
        currentTenant: null, // Renamed
        subdomain: null,
        isSuperAdmin: true,
        isLoading: false,
      })

    } catch (error) {
      console.error("Error initializing tenant:", error)
      set({
        currentTenant: null, // Renamed
        subdomain: null,
        isSuperAdmin: false,
        isLoading: false,
      })
    }
    
    // Final fallback to ensure loading is always set to false
    setTimeout(() => {
      const currentState = get()
      if (currentState.isLoading) {
        console.log("Final fallback: Setting loading to false")
        set({
          ...currentState,
          isLoading: false,
        })
      }
    }, 100)
  },
}))

export const getTenantFromHostname = (hostname: string) => {
  const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "theqcare.org"; // IMPORTANT: Set this in .env.local

  // Ensure BASE_DOMAIN is always a string for split operations
  const baseDomainParts = BASE_DOMAIN.split('.');

  // Handle localhost development
  if (hostname === "localhost" || hostname.startsWith("localhost:")) {
    return {
      subdomain: null,
      isSuperAdmin: true,
    }
  }

  // Handle subdomains (e.g., demo.yourbase.com)
  if (hostname.includes(`.${BASE_DOMAIN}`)) {
    const parts = hostname.split('.')
    
    // Check if it's a valid base domain
    if (parts[parts.length - baseDomainParts.length] === baseDomainParts[0] && parts[parts.length - 1] === baseDomainParts[baseDomainParts.length - 1]) {
      // If it's the main site (yourbase.com), treat as super admin
      if (parts.length === baseDomainParts.length) {
        return {
          subdomain: null,
          isSuperAdmin: true,
        }
      }
      
      // If it's a subdomain (e.g., demo.yourbase.com), extract subdomain
      if (parts.length > baseDomainParts.length) {
        return {
          subdomain: parts[0],
          isSuperAdmin: false,
        }
      }
    }
  }

  // For custom domains, we'll rely on `initializeTenant` to fetch all tenants
  // and match the full hostname to a tenant's domain. Here, we can't definitively
  // say if it's a tenant or super admin without an API call.
  // Default to non-super-admin with null subdomain, and initializeTenant will resolve.
  return {
    subdomain: null,
    isSuperAdmin: false, // Assume not super admin unless explicitly matched to base domain or localhost
  }
}

// Server-side tenant detection utility (no change here, it uses getTenantFromHostname)
export const getServerTenant = (request: Request) => {
  const url = new URL(request.url)
  const hostname = url.hostname

  return getTenantFromHostname(hostname)
}
