"use client"

import { create } from "zustand"
import { type User, type AuthState, authenticateUser } from "@/lib/auth"

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User | null) => void
}

export const useAuth = create<AuthStore>()((set, get) => ({
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
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user })
  },
}))
