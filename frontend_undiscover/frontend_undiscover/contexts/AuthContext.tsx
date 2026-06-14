'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { AuthUser } from '@/lib/auth'

type AuthContextType = {
  user: AuthUser | null
  jwt: string | null
  login: (user: AuthUser, jwt: string) => void
  logout: () => void
  authModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  jwt: null,
  login: () => {},
  logout: () => {},
  authModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [jwt, setJwt] = useState<string | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    const storedJwt = localStorage.getItem('undiscover_jwt')
    const storedUser = localStorage.getItem('undiscover_user')
    if (storedJwt && storedUser) {
      try {
        setJwt(storedJwt)
        setUser(JSON.parse(storedUser))
      } catch {}
    }
  }, [])

  const login = (user: AuthUser, jwt: string) => {
    setUser(user)
    setJwt(jwt)
    localStorage.setItem('undiscover_jwt', jwt)
    localStorage.setItem('undiscover_user', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    setJwt(null)
    localStorage.removeItem('undiscover_jwt')
    localStorage.removeItem('undiscover_user')
  }

  return (
    <AuthContext.Provider value={{
      user, jwt, login, logout,
      authModalOpen,
      openAuthModal: () => setAuthModalOpen(true),
      closeAuthModal: () => setAuthModalOpen(false),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
