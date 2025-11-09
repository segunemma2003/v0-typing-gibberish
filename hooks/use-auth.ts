"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authService, type ApiUser, type AuthResponse } from "@/lib/api/auth"
import { type User, type AuthState, type UserRole } from "@/lib/auth"

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  initializeAuth: () => Promise<void>
}

const isKnownRole = (role: string): role is UserRole => {
  return [
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
  ].includes(role)
}

const mapApiUserToAuthUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  email: apiUser.email,
  name: apiUser.name,
  role: isKnownRole(apiUser.role) ? apiUser.role : "admin",
  schoolId: apiUser.tenant?.id ? String(apiUser.tenant.id) : null,
  avatar: apiUser.avatar ?? undefined,
  status: apiUser.status ?? null,
  tenant: apiUser.tenant
    ? {
        id: apiUser.tenant.id,
        name: apiUser.tenant.name,
        domain: apiUser.tenant.domain ?? null,
      }
    : null,
  isActive: apiUser.status ? apiUser.status.toLowerCase() === "active" : undefined,
  createdAt: apiUser.created_at ?? null,
  updatedAt: apiUser.updated_at ?? null,
})

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await authService.login({ email, password })
          const mappedUser = mapApiUserToAuthUser(response.user)
          set({ user: mappedUser, isAuthenticated: true, isLoading: false })
          return response
        } catch (error) {
          set({ isLoading: false, isAuthenticated: false })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()
        } catch (error) {
          console.error("Failed to logout:", error)
        } finally {
          set({ user: null, isAuthenticated: false, isLoading: false })
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth-storage")
            localStorage.removeItem("token")
          }
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },

      initializeAuth: async () => {
        const state = get()

        // Already authenticated with user in store
        if (state.user && state.isAuthenticated) {
          set({ isLoading: false })
          return
        }

        if (typeof window === "undefined") {
          return
        }

        const token = localStorage.getItem("token")
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false })
          return
        }

        set({ isLoading: true })
        try {
          const apiUser = await authService.me()
          const mappedUser = mapApiUserToAuthUser(apiUser)
          set({ user: mappedUser, isAuthenticated: true, isLoading: false })
        } catch (error) {
          console.error("Failed to initialize auth:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("auth-storage")
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },
    }),
    {
      name: "auth-storage",
      // Only persist the user and isAuthenticated state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
