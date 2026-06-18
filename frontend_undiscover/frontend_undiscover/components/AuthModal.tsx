'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { loginUser, registerUser } from '@/lib/auth'

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, login } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [identifier, setIdentifier] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  // Reset al abrir
  useEffect(() => {
    if (authModalOpen) {
      setIdentifier(''); setUsername(''); setEmail(''); setPassword(''); setError(''); setConfirmationSent(false)
    }
  }, [authModalOpen])

  if (!authModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { jwt, user } = await loginUser(identifier, password)
        login(user, jwt)
        closeAuthModal()
      } else {
        await registerUser(username, email, password)
        setConfirmationSent(true)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: 'rgba(10,10,10,.92)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal() }}
    >
      {/* Panel */}
      <div className="relative w-full max-w-[420px] mx-4 border border-white/10 bg-[#111] overflow-hidden">

        {/* Noise */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/10">
          <div className="font-mono text-[11px] tracking-[.2em] uppercase text-[#2e5bff]">
            {confirmationSent ? '// Confirmación enviada' : mode === 'login' ? '// Iniciar sesión' : '// Crear cuenta'}
          </div>
          <button
            onClick={closeAuthModal}
            className="font-mono text-white/30 hover:text-white transition-colors text-[20px] leading-none bg-transparent border-none p-0"
          >
            ×
          </button>
        </div>

        {/* Pantalla: confirmación enviada */}
        {confirmationSent ? (
          <div className="px-7 py-12 flex flex-col items-center gap-4 text-center">
            <div className="font-mono text-[#2e5bff] text-3xl">✦</div>
            <div className="font-mono text-[11px] tracking-[.2em] uppercase text-white">
              Cuenta creada
            </div>
            <p className="font-mono text-[12px] text-[#99afbf] leading-relaxed tracking-[.04em]">
              Te enviamos un mail de confirmación.<br />
              Revisá tu casilla y seguí el enlace para activar tu cuenta.
            </p>
            <button
              onClick={closeAuthModal}
              className="mt-4 font-mono text-[11px] tracking-[.15em] uppercase text-[#2e5bff] hover:text-white transition-colors bg-transparent border-none p-0"
            >
              Cerrar →
            </button>
          </div>
        ) : (
          <>
            {/* Toggle login / register */}
            <div className="flex border-b border-white/10">
              {(['login', 'register'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError('') }}
                  className={`flex-1 py-3 font-mono text-[11px] tracking-[.15em] uppercase transition-colors border-none bg-transparent ${
                    mode === m
                      ? 'text-white border-b-2 border-[#2e5bff]'
                      : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {m === 'login' ? 'Ingresar' : 'Registrarse'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-7 py-8 flex flex-col gap-5">
              {mode === 'register' && (
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] tracking-[.18em] uppercase text-[#99afbf]">
                    Usuario
                  </label>
                  <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    className="bg-[#1a1a1a] border border-white/10 text-white font-mono text-[13px] px-4 py-3 outline-none focus:border-[#2e5bff] transition-colors tracking-[.04em]"
                    placeholder="tu_nombre"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] tracking-[.18em] uppercase text-[#99afbf]">
                  {mode === 'login' ? 'Email o usuario' : 'Email'}
                </label>
                <input
                  value={mode === 'login' ? identifier : email}
                  onChange={e => mode === 'login' ? setIdentifier(e.target.value) : setEmail(e.target.value)}
                  required
                  type={mode === 'register' ? 'email' : 'text'}
                  autoComplete={mode === 'register' ? 'email' : 'username'}
                  className="bg-[#1a1a1a] border border-white/10 text-white font-mono text-[13px] px-4 py-3 outline-none focus:border-[#2e5bff] transition-colors tracking-[.04em]"
                  placeholder="email@ejemplo.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] tracking-[.18em] uppercase text-[#99afbf]">
                  Contraseña
                </label>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="bg-[#1a1a1a] border border-white/10 text-white font-mono text-[13px] px-4 py-3 outline-none focus:border-[#2e5bff] transition-colors tracking-[.04em]"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="font-mono text-[11px] text-red-400 tracking-[.05em] border border-red-400/20 px-4 py-3 bg-red-400/5">
                  // {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-[#2e5bff] text-white font-mono text-[12px] tracking-[.18em] uppercase py-3.5 border-none transition-[background,opacity] hover:bg-[#1a3acc] disabled:opacity-50"
              >
                {loading ? '...' : mode === 'login' ? 'Ingresar →' : 'Crear cuenta →'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  )
}
