"use client"

import { create } from "zustand"
import { type Tenant } from "@/lib/api/tenants" // Import Tenant interface
import { publicService } from "@/lib/api/public" // Import public service for school lookup
import { getTenantFromHostname } from "@/lib/tenant-server" // Import server-side utility for client use

export interface TenantState {
  currentTenant: Tenant | null // Renamed to currentTenant
  currentSchool: { id: string; name: string; subdomain?: string | null } | null
  subdomain: string | null
  isSuperAdmin: boolean
  isLoading: boolean
  error: string | null // Error message when subdomain doesn't exist
}

interface TenantStore extends TenantState {
  setTenant: (subdomain: string | null, tenant: Tenant | null, isSuperAdmin: boolean) => void // Updated parameter
  clearTenant: () => void
  initializeTenant: (hostname?: string) => Promise<void>
  setError: (error: string | null) => void
}

export const useTenant = create<TenantStore>()((set, get) => ({
  currentTenant: null, // Renamed
  currentSchool: null,
  subdomain: null,
  isSuperAdmin: false,
  isLoading: true,
  error: null,

  setTenant: (subdomain, tenant, isSuperAdmin) => { // Updated parameter
    const currentSchool = tenant
      ? {
          id: tenant.id.toString(),
          name: tenant.name,
          subdomain,
        }
      : null
    set({
      subdomain,
      currentTenant: tenant, // Renamed
      isSuperAdmin,
      isLoading: false,
      currentSchool,
      error: null,
    })
  },

  clearTenant: () => {
    set({
      currentTenant: null, // Renamed
      currentSchool: null,
      subdomain: null,
      isSuperAdmin: false,
      isLoading: false,
      error: null,
    })
  },

  setError: (error) => {
    set({ error })
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
            currentSchool: null,
            subdomain: null,
            isSuperAdmin: true,
            isLoading: false,
            error: null,
          })
          return
        }

        if (detectedSubdomain) {
          console.log("Attempting to fetch school for subdomain:", detectedSubdomain);
          try {
            // Use public API to get school by subdomain (no auth required)
            // Endpoint: GET /api/v1/schools/by-subdomain/{subdomain}
            const schoolResponse = await publicService.getSchoolBySubdomain(detectedSubdomain);
            
            // Check if school exists
            if (schoolResponse.exists && schoolResponse.success && schoolResponse.tenant && schoolResponse.school) {
              console.log("Found school:", schoolResponse.school.name, "Tenant:", schoolResponse.tenant.name);
              
              // Map the API response to Tenant format
              // Note: tenant.id is now a string (UUID) from the API
              const tenantDomain = (schoolResponse.tenant as any).domain || "";
              const tenant: Tenant = {
                id: schoolResponse.tenant.id.toString(),
                name: schoolResponse.tenant.name,
                domain: tenantDomain,
                database_name: tenantDomain ? tenantDomain.replace(/\./g, "_") : schoolResponse.tenant.name.replace(/\s+/g, "_").toLowerCase(),
                status: schoolResponse.tenant.status,
                schools_count: 1,
                users_count: 0,
              };

              set({
                currentTenant: tenant,
                currentSchool: {
                  id: schoolResponse.school.id.toString(),
                  name: schoolResponse.school.name,
                  subdomain: detectedSubdomain,
                },
                subdomain: detectedSubdomain,
                isSuperAdmin: false,
                isLoading: false,
                error: null,
              });
              return;
            } else {
              // School doesn't exist or response indicates failure
              throw new Error("School not found");
            }
          } catch (error: any) {
            console.error("Error fetching school by subdomain:", error);
            // Handle all errors - school doesn't exist or API error
            const errorMessage = error?.response?.data?.message || 
                                error?.message || 
                                `School with subdomain "${detectedSubdomain}" does not exist.`;
            
            set({
              currentTenant: null,
              currentSchool: null,
              subdomain: detectedSubdomain,
              isSuperAdmin: false,
              isLoading: false,
              error: errorMessage,
            });
            return;
          }
        }

        // If no subdomain and not super admin, it might be the base domain or an error
        console.log("No subdomain detected and not super admin. Defaulting to super admin or no tenant.");
        set({
          currentTenant: null, // Renamed
          currentSchool: null,
          subdomain: null,
          isSuperAdmin: true, // Assuming default to super_admin on base domain
          isLoading: false,
          error: null,
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
            currentSchool: null,
            subdomain: null,
            isSuperAdmin: true,
            isLoading: false,
            error: null,
          })
          return
        }

        if (detectedSubdomain) {
          console.log("Attempting to fetch school for server-side detected subdomain:", detectedSubdomain);
          try {
            // Use public API to get school by subdomain (no auth required)
            // Endpoint: GET /api/v1/schools/by-subdomain/{subdomain}
            const schoolResponse = await publicService.getSchoolBySubdomain(detectedSubdomain);
            
            // Check if school exists
            if (schoolResponse.exists && schoolResponse.success && schoolResponse.tenant && schoolResponse.school) {
              console.log("Found school server-side:", schoolResponse.school.name, "Tenant:", schoolResponse.tenant.name);
              
              // Map the API response to Tenant format
              const tenantDomain = (schoolResponse.tenant as any).domain || "";
              const tenant: Tenant = {
                id: schoolResponse.tenant.id.toString(),
                name: schoolResponse.tenant.name,
                domain: tenantDomain,
                database_name: tenantDomain ? tenantDomain.replace(/\./g, "_") : schoolResponse.tenant.name.replace(/\s+/g, "_").toLowerCase(),
                status: schoolResponse.tenant.status,
                schools_count: 1,
                users_count: 0,
              };

              set({
                currentTenant: tenant,
                currentSchool: {
                  id: schoolResponse.school.id.toString(),
                  name: schoolResponse.school.name,
                  subdomain: detectedSubdomain,
                },
                subdomain: detectedSubdomain,
                isSuperAdmin: false,
                isLoading: false,
                error: null,
              });
              return;
            } else {
              // School doesn't exist
              throw new Error("School not found");
            }
          } catch (error: any) {
            console.error("Error fetching school by subdomain server-side:", error);
            const errorMessage = error?.response?.data?.message || 
                                error?.message || 
                                `School with subdomain "${detectedSubdomain}" does not exist.`;
            
            set({
              currentTenant: null,
              currentSchool: null,
              subdomain: detectedSubdomain,
              isSuperAdmin: false,
              isLoading: false,
              error: errorMessage,
            });
            return;
          }
        }
      }

      // Final fallback for situations where no tenant is detected
      console.log("Final fallback - treating as super admin (no tenant detected at all)")
      set({
        currentTenant: null, // Renamed
        currentSchool: null,
        subdomain: null,
        isSuperAdmin: true,
        isLoading: false,
        error: null,
      })

    } catch (error) {
      console.error("Error initializing tenant:", error)
      set({
        currentTenant: null, // Renamed
        currentSchool: null,
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

// Re-export for backward compatibility (client can still use getTenantFromHostname)
export { getTenantFromHostname }
