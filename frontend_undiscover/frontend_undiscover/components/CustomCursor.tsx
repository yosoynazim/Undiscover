'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e: MouseEvent) => {
      dot.style.left  = ring.style.left  = e.clientX + 'px'
      dot.style.top   = ring.style.top   = e.clientY + 'px'
    }

    const onEnter = () => {
      ring.style.width  = '48px'
      ring.style.height = '48px'
      dot.style.background  = '#2e5bff'
      ring.style.borderColor = '#2e5bff'
    }

    const onLeave = () => {
      ring.style.width  = '32px'
      ring.style.height = '32px'
      dot.style.background  = '#ff2d8f'
      ring.style.borderColor = '#ff2d8f'
    }

    const attachHover = () => {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    window.addEventListener('mousemove', onMove)
    attachHover()

    // Re-attach when DOM changes (e.g. after navigation)
    const observer = new MutationObserver(attachHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          background: '#ff2d8f',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'background .2s',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          border: '1px solid #ff2d8f',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0.3,
          transition: 'width .15s, height .15s, border-color .2s',
        }}
      />
    </>
  )
}
