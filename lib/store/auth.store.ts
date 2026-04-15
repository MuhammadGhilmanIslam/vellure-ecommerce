import { create } from 'zustand'

interface AuthUser {
  id: string
  name: string
  email: string
  image?: string | null
  role: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN'
}

interface AuthStore {
  user: AuthUser | null
  isLoading: boolean
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  clearUser: () => set({ user: null, isLoading: false }),
}))
