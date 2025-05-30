import { create } from "zustand";
import type { User } from "../types";

interface AuthStore {
  user: User | null
  token: string | null
  hydrated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  initialize: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  hydrated: false,
  login: (user, token) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    set({ user: null, token: null })
  },
  initialize: () => {
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('auth_user')
    set({
      user: user ? JSON.parse(user) : null,
      token,
      hydrated: true,
    })
  },
}))
