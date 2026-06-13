import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '../types'
import * as authLib from '../lib/auth'

interface AuthStore {
  user: authLib.AuthUser | null
  isLoading: boolean
  setUser: (user: authLib.AuthUser | null) => void
  setLoading: (loading: boolean) => void
  logout: () => Promise<void>
  register: (data: {
    name: string
    email: string
    phone: string
    password: string
    role: UserRole
  }) => Promise<{ error: string | null }>
  login: (email: string, password: string) => Promise<{ error: string | null }>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      initialize: async () => {
        try {
          const user = await authLib.getCurrentUser()
          set({ user, isLoading: false })
        } catch {
          set({ user: null, isLoading: false })
        }
      },

      register: async (data) => {
        const { user, error } = await authLib.signUp(data)
        if (error) return { error }
        set({ user })
        return { error: null }
      },

      login: async (email, password) => {
        const { user, error } = await authLib.signIn(email, password)
        if (error) return { error }
        set({ user })
        return { error: null }
      },

      logout: async () => {
        await authLib.signOut()
        set({ user: null })
      },
    }),
    {
      name: 'manggaku-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
