'use client'

import { useState, FormEvent } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMsg('')
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (res.ok) {
      setStatus('success')
      setMsg('¡Suscripción exitosa!')
      setEmail('')
    } else {
      setStatus('error')
      setMsg(data.error ?? 'Error al suscribirte')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="tu@email.com"
        required
        className="bg-transparent border border-white/[.12] px-3 py-1.5 text-[11px] font-mono text-white/70 outline-none focus:border-[#2e5bff] transition-colors w-36"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="font-mono text-[11px] tracking-[.1em] uppercase text-[#2e5bff] hover:text-[#ff2d8f] transition-colors disabled:opacity-40"
      >
        {status === 'loading' ? '…' : 'Suscribirse al newsletter'}
      </button>
      {msg && (
        <span className={`font-mono text-[10px] ${status === 'success' ? 'text-green-400/60' : 'text-red-400/60'}`}>
          {msg}
        </span>
      )}
    </form>
  )
}
