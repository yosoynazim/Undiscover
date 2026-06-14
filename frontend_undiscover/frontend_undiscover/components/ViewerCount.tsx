'use client'

import { useState, useEffect } from 'react'

export default function ViewerCount() {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Base random entre 600 y 1400
    setCount(Math.floor(Math.random() * 800) + 600)
    setMounted(true)

    const t = setInterval(() => {
      setCount(c => Math.max(400, c + Math.floor(Math.random() * 9) - 4))
    }, 2800)

    return () => clearInterval(t)
  }, [])

  if (!mounted) return null

  return (
    <span className="font-mono text-[11px] tracking-[.1em] text-[#99afbf] flex items-center gap-2">
      <span style={{ color: '#ff2d8f', animation: 'on-air-blink 1s ease-in-out infinite' }}>●</span>
      <span className="text-white">{count.toLocaleString('es-AR')}</span>
      {' '}leyendo ahora
    </span>
  )
}
