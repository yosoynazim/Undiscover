'use client'

import { useState, useEffect } from 'react'

export default function VHSTimestamp() {
  const [time, setTime]   = useState('')
  const [date, setDate]   = useState('')
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('es-AR', { hour12: false }))
      setDate(now.toLocaleDateString('es-AR').replace(/\//g, '.'))
    }
    update()
    const t = setInterval(update, 1000)
    const b = setInterval(() => setBlink(v => !v), 600)
    return () => { clearInterval(t); clearInterval(b) }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: 24,
      zIndex: 9990,
      pointerEvents: 'none',
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: 11,
      letterSpacing: '0.12em',
      lineHeight: 1.6,
      userSelect: 'none',
    }}>
      <div style={{ color: '#39ff8a', textShadow: '0 0 8px #39ff8a', opacity: 0.75 }}>
        {date}
      </div>
      <div style={{
        color: '#39ff8a',
        textShadow: '0 0 10px #39ff8a',
        opacity: blink ? 0.85 : 0.2,
        transition: 'opacity 0.1s',
      }}>
        {time} <span style={{ color: '#ff2d8f', textShadow: '0 0 8px #ff2d8f' }}>● REC</span>
      </div>
    </div>
  )
}
