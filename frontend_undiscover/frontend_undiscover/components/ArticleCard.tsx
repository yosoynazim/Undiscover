import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/types'
import { getStrapiMedia, formatDate } from '@/lib/utils'

// Asigna un color de badge según la categoría
function badgeStyle(catName?: string): { bg: string; color: string; border: string } {
  const name = catName?.toLowerCase() ?? ''
  if (name.includes('música') || name.includes('musica'))
    return { bg: 'rgba(255,184,48,.12)', color: '#ffb830', border: 'rgba(255,184,48,.3)' }
  if (name.includes('tecno'))
    return { bg: 'rgba(46,91,255,.15)', color: '#2e5bff', border: 'rgba(46,91,255,.3)' }
  // default: pink
  return { bg: 'rgba(255,45,143,.12)', color: '#ff2d8f', border: 'rgba(255,45,143,.25)' }
}

type Props = {
  article: Article
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: Props) {
  const imageUrl = getStrapiMedia(article.cover_image?.url)
  const badge = badgeStyle(article.category?.name)

  return (
    <Link
      href={`/articulos/${article.slug}`}
      className="group relative bg-[#16161f] flex flex-col overflow-hidden no-underline"
      style={{ minHeight: featured ? 520 : 260 }}
    >
      {/* Accent bar izquierdo con gradiente */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] z-30 transition-transform duration-300 origin-bottom scale-y-0 group-hover:scale-y-100"
        style={{ background: 'linear-gradient(135deg, #2e5bff, #ff2d8f)' }}
      />

      {/* Imagen */}
      {imageUrl && (
        <div className="vhs-freeze relative overflow-hidden flex-shrink-0" style={{ height: featured ? 320 : 200 }}>
          <Image
            src={imageUrl}
            alt={article.cover_image?.alternativeText || article.title}
            fill
            className="object-cover grayscale contrast-[1.2] mix-blend-luminosity opacity-55 transition-[transform,opacity] duration-500 group-hover:scale-[1.04] group-hover:opacity-70"
          />
          <div className="absolute inset-0 bg-[#2e5bff] mix-blend-multiply opacity-70 z-10 transition-opacity duration-300 group-hover:opacity-45" />
          <div
            className="absolute inset-0 z-20 opacity-25 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #0d0d14 1px, transparent 1px)', backgroundSize: '5px 5px' }}
          />
        </div>
      )}

      {/* Número watermark */}
      <div
        className="absolute top-4 right-5 font-mono leading-none pointer-events-none select-none transition-colors duration-300"
        style={{ fontSize: featured ? 80 : 52, color: 'rgba(46,91,255,.05)' }}
      />

      {/* Cuerpo */}
      <div className={`flex flex-col flex-1 justify-between ${featured ? 'p-8' : 'p-6'}`}>
        <div>
          {/* Badge */}
          {article.category?.name && (
            <span
              className="inline-block font-mono text-[9px] tracking-[.2em] uppercase px-2.5 py-1 mb-3 border"
              style={{ background: badge.bg, color: badge.color, borderColor: badge.border }}
            >
              {article.category.name}
            </span>
          )}

          <h2
            className={`glitch-hover font-mono leading-[1.35] text-[#f0f2ff] tracking-[.01em] transition-colors duration-200 group-hover:text-white ${
              featured ? 'text-[22px] mb-4' : 'text-[15px] mb-3'
            }`}
          >
            {article.title}
          </h2>

          {featured && article.excerpt && (
            <p className="text-[13px] leading-[1.65] text-[#99afbf] mb-5 line-clamp-3">
              {article.excerpt}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] tracking-[.1em] uppercase mt-auto pt-4 border-t border-white/[.06]">
          <span style={{ color: '#ff2d8f' }}>{article.author?.name}</span>
          <span className="text-[#99afbf]/60">
            {article.read_time} MIN · {formatDate(article.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}
