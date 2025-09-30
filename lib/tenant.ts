"use client"

import { create } from "zustand"
import { getSchoolBySubdomain, type School } from "./auth"
import { getDynamicSchoolBySubdomain, type DynamicSchool } from "./dynamic-schools"

export interface TenantState {
  currentSchool: School | null
  subdomain: string | null
  isSuperAdmin: boolean
  isLoading: boolean
}

interface TenantStore extends TenantState {
  setTenant: (subdomain: string | null, school: School | null, isSuperAdmin: boolean) => void
  clearTenant: () => void
  initializeTenant: (hostname?: string) => Promise<void>
}

export const useTenant = create<TenantStore>()((set, get) => ({
  currentSchool: null,
  subdomain: null,
  isSuperAdmin: false,
  isLoading: true,

  setTenant: (subdomain, school, isSuperAdmin) => {
    set({
      subdomain,
      currentSchool: school,
      isSuperAdmin,
      isLoading: false,
    })
  },

  clearTenant: () => {
    set({
      currentSchool: null,
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
        
        // Also check for school parameter in URL (for testing subdomains)
        const urlParams = new URLSearchParams(window.location.search)
        const schoolParam = urlParams.get('school')
        console.log("School param from URL:", schoolParam)
        
        if (schoolParam) {
          // Simulate subdomain behavior with URL parameter
          const { subdomain: detectedSubdomain } = getTenantFromHostname(detectedHostname)
          console.log("Detected subdomain:", detectedSubdomain)
          
          if (!detectedSubdomain) {
            // If main domain, use school parameter as subdomain
            const school = getSchoolBySubdomain(schoolParam)
            console.log("Found school:", school)
            
            if (school && school.isActive) {
              console.log("Setting school tenant:", schoolParam)
              set({
                currentSchool: school,
                subdomain: schoolParam,
                isSuperAdmin: false,
                isLoading: false,
              })
              return
            } else {
              console.log("School not found or inactive")
              set({
                currentSchool: null,
                subdomain: schoolParam,
                isSuperAdmin: false,
                isLoading: false,
              })
              return
            }
          }
        }
        
        // If no school param, try to detect from hostname
        console.log("No school param, trying to detect from hostname:", detectedHostname)
        const { subdomain: detectedSubdomain, isSuperAdmin } = getTenantFromHostname(detectedHostname)
        console.log("getTenantFromHostname result:", { detectedSubdomain, isSuperAdmin })
        
        if (isSuperAdmin) {
          console.log("Detected as super admin")
          set({
            currentSchool: null,
            subdomain: null,
            isSuperAdmin: true,
            isLoading: false,
          })
          return
        }
        
        if (detectedSubdomain) {
          console.log("Detected subdomain:", detectedSubdomain)
          // First try dynamic schools (for newly registered schools)
          let school = getDynamicSchoolBySubdomain(detectedSubdomain)
          console.log("Dynamic school result:", school)
          
          // Fallback to static schools (for demo schools)
          if (!school) {
            school = getSchoolBySubdomain(detectedSubdomain)
            console.log("Static school result:", school)
          }
          
          if (school && school.isActive) {
            console.log("Found school from hostname:", school.name, "ID:", school.id)
            set({
              currentSchool: school,
              subdomain: detectedSubdomain,
              isSuperAdmin: false,
              isLoading: false,
            })
            return
          } else {
            console.log("No active school found for subdomain:", detectedSubdomain)
          }
        }
        
        // Final fallback - treat as super admin
        console.log("Final fallback - treating as super admin")
        set({
          currentSchool: null,
          subdomain: null,
          isSuperAdmin: true,
          isLoading: false,
        })
        return
      }

      // Try to get from headers (server-side via middleware)
      if (!detectedHostname && typeof document !== "undefined") {
        const metaTag = document.querySelector('meta[name="x-tenant-hostname"]')
        if (metaTag) {
          detectedHostname = metaTag.getAttribute("content") || ""
        }
      }

      // For subdomains, always try to detect from hostname first
      if (detectedHostname && detectedHostname.includes('.theqcare.org')) {
        const parts = detectedHostname.split('.')
        if (parts.length >= 3) {
          const subdomainFromHostname = parts[0]
          console.log("TenantProvider: Detected subdomain from hostname:", subdomainFromHostname)
          
          // Try dynamic schools first, then static schools
          let school = getDynamicSchoolBySubdomain(subdomainFromHostname)
          if (!school) {
            school = getSchoolBySubdomain(subdomainFromHostname)
          }
          
          if (school && school.isActive) {
            console.log("Found school from subdomain:", school.name)
            set({
              currentSchool: school,
              subdomain: subdomainFromHostname,
              isSuperAdmin: false,
              isLoading: false,
            })
            return
          } else {
            // School not found - this might be a new school registration
            console.log("School not found for subdomain:", subdomainFromHostname)
            set({
              currentSchool: null,
              subdomain: subdomainFromHostname,
              isSuperAdmin: false,
              isLoading: false,
            })
            return
          }
        }
      }

      if (!detectedHostname) {
        set({
          currentSchool: null,
          subdomain: null,
          isSuperAdmin: true,
          isLoading: false,
        })
        return
      }

      const { subdomain, isSuperAdmin } = getTenantFromHostname(detectedHostname)

      if (isSuperAdmin) {
        set({
          currentSchool: null,
          subdomain: null,
          isSuperAdmin: true,
          isLoading: false,
        })
        return
      }

      // Find school by subdomain
      const school = subdomain ? getSchoolBySubdomain(subdomain) : null

      if (school && school.isActive) {
        set({
          currentSchool: school,
          subdomain,
          isSuperAdmin: false,
          isLoading: false,
        })
      } else {
        // School not found or inactive
        set({
          currentSchool: null,
          subdomain,
          isSuperAdmin: false,
          isLoading: false,
        })
      }
    } catch (error) {
      console.error("Error initializing tenant:", error)
      set({
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
    
    console.log("Tenant initialization completed")
  },
}))

export const getTenantFromHostname = (hostname: string) => {
  // Handle localhost development
  if (hostname === "localhost" || hostname.startsWith("localhost:")) {
    return {
      subdomain: null,
      isSuperAdmin: true,
    }
  }

  // Handle theqcare.org subdomains (e.g., demo.theqcare.org)
  if (hostname.includes('.theqcare.org')) {
    const parts = hostname.split('.')
    
    // Check if it's a valid theqcare.org domain
    if (parts[parts.length - 2] === 'theqcare' && parts[parts.length - 1] === 'org') {
      // If it's the main site (theqcare.org), treat as super admin
      if (parts.length === 2) {
        return {
          subdomain: null,
          isSuperAdmin: true,
        }
      }
      
      // If it's a subdomain (e.g., demo.theqcare.org), extract school subdomain
      if (parts.length >= 3) {
        return {
          subdomain: parts[0],
          isSuperAdmin: false,
        }
      }
    }
  }

  // Handle Netlify subdomains (legacy support)
  if (hostname.includes('.netlify.app')) {
    const parts = hostname.split('.')
    
    // Check if it's a valid Netlify domain
    if (parts[parts.length - 2] === 'netlify' && parts[parts.length - 1] === 'app') {
      // If it's the main site (e.g., lustrous-malasada-aaed22.netlify.app), treat as super admin
      if (parts.length === 3) {
        return {
          subdomain: null,
          isSuperAdmin: true,
        }
      }
      
      // If it's a subdomain (e.g., test.lustrous-malasada-aaed22.netlify.app), extract school subdomain
      if (parts.length >= 4) {
        return {
          subdomain: parts[0],
          isSuperAdmin: false,
        }
      }
    }
  }

  // Handle custom domains
  const parts = hostname.split(".")

  // For custom domains, need at least 3 parts for a subdomain (subdomain.domain.tld)
  if (parts.length < 3) {
    return {
      subdomain: null,
      isSuperAdmin: true,
    }
  }

  return {
    subdomain: parts[0],
    isSuperAdmin: false,
  }
}

// Server-side tenant detection utility
export const getServerTenant = (request: Request) => {
  const url = new URL(request.url)
  const hostname = url.hostname

  return getTenantFromHostname(hostname)
}
