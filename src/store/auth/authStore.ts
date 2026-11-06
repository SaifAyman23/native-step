import { create } from 'zustand'

import type { User } from '@/types'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  /** True when a token pair is persisted, even before `/auth/me/` answers. */
  hasSession: boolean
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setHasSession: (hasSession: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  hasSession: false,
  isLoading: false,
  error: null,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      hasSession: !!user,
      error: null,
    }),
  setHasSession: (hasSession) => set({ hasSession }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      hasSession: false,
      error: null,
    }),
}))
