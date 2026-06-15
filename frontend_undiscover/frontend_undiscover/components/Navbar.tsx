'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const links = [
  { label: 'Archivo', href: '/archivo' },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout, openAuthModal } = useAuth()

  return (
    <nav className="flex items-center justify-between px-4 md:px-10 py-4 border-b border-white/[.07] bg-[#0d0d14] shrink-0">

      {/* Logo */}
      <Link href="/" className="flex items-center no-underline">
        <img
          src="/logo.png"
          alt="Undiscover"
          className="h-9 w-auto"
          style={{ filter: 'invert(1) brightness(10)', opacity: 0.85 }}
        />
      </Link>

      {/* Links */}
      <ul className="flex gap-4 md:gap-8 list-none">
        {links.map(({ label, href }) => {
          const active = pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                className={`font-mono text-[11px] tracking-[.18em] uppercase transition-colors duration-200 no-underline ${
                  active ? 'text-[#2e5bff]' : 'text-[#99afbf] hover:text-white'
                }`}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Derecha */}
      <div className="flex items-center gap-4">
        {/* ON AIR */}
        <span className="hidden md:flex font-mono text-[10px] tracking-[.15em] uppercase text-[#99afbf]/50 items-center gap-1.5">
          <span style={{ color: '#ff2d8f', animation: 'on-air-blink 1.2s ease-in-out infinite' }}>●</span>
          EN VIVO
        </span>

        {/* Tag */}
        <span className="hidden md:inline font-mono text-[11px] tracking-widest">
          <span style={{ color: '#2e5bff' }}>//</span>
          {' '}
          <span style={{ background: 'linear-gradient(90deg, #2e5bff, #ff2d8f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ARCHIVO VIVO</span>
        </span>

        {/* Auth */}
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center grad-bg font-mono text-[10px] text-white tracking-[.04em]">
                {getInitials(user.username)}
              </div>
              <span className="font-mono text-[11px] text-[#99afbf] tracking-[.08em]">
                {user.username}
              </span>
            </div>
            <button
              onClick={logout}
              className="font-mono text-[10px] tracking-[.15em] uppercase text-white/25 hover:text-white/60 transition-colors bg-transparent border-none p-0"
            >
              salir
            </button>
          </>
        ) : (
          <button
            onClick={openAuthModal}
            className="font-mono text-[11px] tracking-[.12em] uppercase px-4 py-1.5 border border-[#ff2d8f] text-[#ff2d8f] bg-transparent hover:bg-[#ff2d8f] hover:text-white transition-colors"
          >
            Ingresar
          </button>
        )}
      </div>

    </nav>
  )
}

