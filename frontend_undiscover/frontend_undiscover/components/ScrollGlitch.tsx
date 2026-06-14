'use client'

import { useEffect } from 'react'

export default function ScrollGlitch() {
  useEffect(() => {
    let prev  = window.scrollY
    let armed = false
    let timeout: ReturnType<typeof setTimeout>

    const onScroll = () => {
      const now   = window.scrollY
      const delta = Math.abs(now - prev)
      prev = now

      if (delta > 40 && !armed) {
        armed = true
        document.body.classList.add('scroll-glitch')
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          document.body.classList.remove('scroll-glitch')
          armed = false
        }, 200)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
