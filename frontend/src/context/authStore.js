import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: (() => {
    try {
      const stored = localStorage.getItem('cc_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })(),
  token: localStorage.getItem('cc_token') || null,

  login: (userData, token) => {
    localStorage.setItem('cc_token', token)
    localStorage.setItem('cc_user', JSON.stringify(userData))
    set({ user: userData, token })
  },

  logout: () => {
    localStorage.removeItem('cc_token')
    localStorage.removeItem('cc_user')
    set({ user: null, token: null })
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('cc_token')
    return !!token
  },
}))

export default useAuthStore
