"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getSchoolBySubdomain, type School } from "./auth"

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

export const useTenant = create<TenantStore>()(
  persist(
    (set, get) => ({
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
        set({ isLoading: true })

        try {
          let detectedHostname = hostname

          // If no hostname provided, get from window (client-side)
          if (!detectedHostname && typeof window !== "undefined") {
            detectedHostname = window.location.hostname
          }

          // Try to get from headers (server-side via middleware)
          if (!detectedHostname && typeof document !== "undefined") {
            const metaTag = document.querySelector('meta[name="x-tenant-hostname"]')
            if (metaTag) {
              detectedHostname = metaTag.getAttribute("content") || ""
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
      },
    }),
    {
      name: "tenant-storage",
      partialize: (state) => ({
        currentSchool: state.currentSchool,
        subdomain: state.subdomain,
        isSuperAdmin: state.isSuperAdmin,
      }),
    },
  ),
)

export const getTenantFromHostname = (hostname: string) => {
  // Handle localhost development
  if (hostname === "localhost" || hostname.startsWith("localhost:")) {
    return {
      subdomain: null,
      isSuperAdmin: true,
    }
  }

  // Extract subdomain
  const parts = hostname.split(".")

  // Need at least 3 parts for a subdomain (subdomain.domain.tld)
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
