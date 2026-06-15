import Image from 'next/image'
import Link from 'next/link'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  return (
    <footer className="border-t border-white/[.07] px-10 py-8 flex flex-wrap items-center gap-4 justify-between relative z-10">
      <Link href="/" className="no-underline shrink-0">
        <Image
          src="/logo.png"
          alt="Undiscover"
          width={120}
          height={30}
          className="h-6 w-auto"
          style={{ filter: 'invert(1) brightness(10)', opacity: 0.35 }}
        />
      </Link>

      <NewsletterForm />

      <span className="font-mono text-[10px] text-white/[.07] tracking-[.12em]">
        v0.1 // ARCHIVO EN CONSTRUCCIÓN
      </span>
    </footer>
  )
}
