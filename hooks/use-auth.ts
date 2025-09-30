"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type User, type AuthState, authenticateUser } from "@/lib/auth"

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User | null) => void
  initializeAuth: () => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const user = await authenticateUser(email, password)
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false })
            return true
          } else {
            set({ isLoading: false })
            return false
          }
        } catch (error) {
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },

      initializeAuth: () => {
        // This method can be used to initialize auth state if needed
        const state = get()
        if (state.user) {
          set({ isAuthenticated: true })
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist the user and isAuthenticated state
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
