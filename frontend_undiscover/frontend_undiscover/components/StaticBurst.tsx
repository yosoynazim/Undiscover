'use client'

import { useEffect, useRef } from 'react'

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

export default function StaticBurst() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const burst = () => {
      const el = ref.current
      if (!el) return
      el.style.opacity = '0.18'
      setTimeout(() => { el.style.opacity = '0' }, 80)
      setTimeout(() => { el.style.opacity = '0.1'; }, 100)
      setTimeout(() => { el.style.opacity = '0' }, 160)
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return
      burst()
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          9994,
        pointerEvents:   'none',
        opacity:         0,
        backgroundImage: NOISE_SVG,
        backgroundSize:  '180px 180px',
        transition:      'opacity 0.05s',
        mixBlendMode:    'screen',
      }}
    />
  )
}
