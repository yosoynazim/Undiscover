import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/[.07] px-10 py-8 flex items-center justify-between relative z-10">
      <Link href="/" className="no-underline">
        <Image
          src="/logo.png"
          alt="Undiscover"
          width={120}
          height={30}
          className="h-6 w-auto"
          style={{ filter: 'invert(1) brightness(10)', opacity: 0.35 }}
        />
      </Link>

      <span className="font-mono text-[11px] text-[#99afbf]/60 tracking-[.1em]">
        UNDISCOVER © 2025 — Resistencia Editorial ·{' '}
        <Link href="#" className="text-[#2e5bff] no-underline hover:text-[#ff2d8f] transition-colors">
          Instagram
        </Link>{' '}
        ·{' '}
        <Link href="#" className="text-[#2e5bff] no-underline hover:text-[#ff2d8f] transition-colors">
          Newsletter
        </Link>
      </span>

      <span className="font-mono text-[10px] text-white/[.07] tracking-[.12em]">
        v0.1 // ARCHIVO EN CONSTRUCCIÓN
      </span>
    </footer>
  )
}
