'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import CustomCursor from '@/components/CustomCursor'
import MouseTrail from '@/components/MouseTrail'
import ScrollGlitch from '@/components/ScrollGlitch'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CustomCursor />
      <MouseTrail />
      <ScrollGlitch />
      {children}
      <AuthModal />
    </AuthProvider>
  )
}
