// app/layout.tsx
import { Space_Grotesk, Share_Tech_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Providers from './providers'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
})

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono-display',
})

export const metadata = {
  title: 'UNDISCOVER — Archivo',
  description: 'Zine digital. Resistencia editorial.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${shareTechMono.variable}`}>
      <body className="bg-[#1c1c1c] text-[#f8f9fa]">
        <Providers>
          <div className="flex flex-col h-dvh">
            <Navbar />
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}