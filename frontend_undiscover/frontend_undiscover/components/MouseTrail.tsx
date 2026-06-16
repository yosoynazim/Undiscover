'use client'

import { useEffect } from 'react'

const COLORS = ['#ff2d8f', '#2e5bff', '#ffb830', '#7b3fff']

export default function MouseTrail() {
  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return
    let colorIdx = 0
    let last = 0

    const spawn = (x: number, y: number) => {
      const el = document.createElement('div')
      const color = COLORS[colorIdx % COLORS.length]
      colorIdx++

      const size = 5 + Math.random() * 4

      Object.assign(el.style, {
        position:      'fixed',
        left:          x + 'px',
        top:           y + 'px',
        width:         size + 'px',
        height:        size + 'px',
        background:    color,
        clipPath:      'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        transform:     'translate(-50%, -50%) scale(1) rotate(0deg)',
        pointerEvents: 'none',
        zIndex:        '9989',
        transition:    'transform 0.5s ease, opacity 0.5s ease',
        opacity:       '0.7',
      })

      document.body.appendChild(el)

      // Double rAF: first frame paints initial state, second triggers the transition
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transform = `translate(-50%, -50%) scale(0) rotate(45deg)`
        el.style.opacity   = '0'
      }))

      setTimeout(() => el.remove(), 520)
    }

    const onMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - last < 45) return
      last = now
      spawn(e.clientX, e.clientY)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return null
}
