'use client'

import { useRef, useEffect } from 'react'

interface MarqueeItem {
  label: string
  cls: string
}

export default function Marquee({ items }: { items: MarqueeItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    let x = 0
    let then = performance.now()
    let running = true
    let raf: number
    const SPEED = 30

    function frame(now: number) {
      if (!running) return
      const dt = (now - then) / 1000
      then = now
      x -= SPEED * dt

      const half = track!.scrollWidth / 2
      if (x <= -half) {
        x += half
      }

      track!.style.transform = `translate3d(${x}px, 0, 0)`
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => {
      running = false
      cancelAnimationFrame(raf)
    }
  }, [])

  const color = (cls: string) =>
    cls.includes('#2e5bff') ? '#2e5bff' : '#ff2d8f'

  const span = (item: MarqueeItem, i: number, key: string) => (
    <span key={key} style={{
      display: 'inline-block', verticalAlign: 'middle',
      padding: '0 40px',
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '11px', letterSpacing: '.22em',
      textTransform: 'uppercase', color: color(item.cls),
    }}>
      {item.label}
    </span>
  )

  const sep = (key: string) => (
    <span key={key} style={{
      display: 'inline-block', verticalAlign: 'middle',
      fontSize: '7px', opacity: .5, padding: '0 40px',
    }}>◆</span>
  )

  function renderCopy(prefix: string) {
    return items.flatMap((item, i) => [
      span(item, i, `${prefix}-${i}`),
      sep(`${prefix}-s-${i}`),
    ])
  }

  return (
    <div ref={containerRef} style={{
      position: 'relative', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,.07)',
      borderBottom: '1px solid rgba(255,255,255,.07)',
      padding: '10px 0', zIndex: 10,
      background: 'rgba(13,13,20,.8)',
    }}>
      <span ref={trackRef} style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        willChange: 'transform',
      }}>
        {renderCopy('a')}
        {renderCopy('b')}
      </span>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px',
        pointerEvents: 'none', zIndex: 10,
        background: 'linear-gradient(to right, #0d0d14, transparent)',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px',
        pointerEvents: 'none', zIndex: 10,
        background: 'linear-gradient(to left, #0d0d14, transparent)',
      }} />
    </div>
  )
}
