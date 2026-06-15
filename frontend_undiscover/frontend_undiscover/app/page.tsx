import Link from 'next/link'
import Image from 'next/image'
import { getArticles, getFeaturedArticles, getCategories } from '@/lib/strapi'
import { getStrapiMedia, formatDate } from '@/lib/utils'
import ArticleCard from '@/components/ArticleCard'
import Footer from '@/components/Footer'
import Marquee from '@/components/Marquee'
import { Article, Category } from '@/lib/types'

const TICKER_ITEMS = [
  { label: 'Undiscover', cls: 'text-[#2e5bff]' },
  { label: 'Archivo Vivo', cls: 'text-[#ff2d8f]' },
  { label: 'Curaduría', cls: 'text-[#2e5bff]' },
  { label: 'Sin algoritmos', cls: 'text-[#ff2d8f]' },
  { label: 'Undiscover', cls: 'text-[#2e5bff]' },
  { label: 'Archivo Vivo', cls: 'text-[#ff2d8f]' },
  { label: 'Curaduría', cls: 'text-[#2e5bff]' },
  { label: 'Sin algoritmos', cls: 'text-[#ff2d8f]' },
]

export const dynamic = 'force-dynamic'

export default async function Home() {
  let articles: Article[] = []
  let featured: Article[] = []
  let categories: Category[] = []

  try {
    ;[articles, featured, categories] = await Promise.all([
      getArticles(),
      getFeaturedArticles(),
      getCategories(),
    ])
  } catch {}

  const hero = featured[0] ?? articles[0]
  const gridArticles = articles.slice(0, 5)
  const stripArticles = articles.slice(5, 8)

  return (
    <>
      {/* Noise */}
      <div
        className="fixed inset-0 pointer-events-none z-[1000] opacity-[.025]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }}
      />
      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage: 'linear-gradient(#ffffff06 1px, transparent 1px), linear-gradient(90deg, #ffffff06 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />

      {/* ── HERO ── */}
      {hero && (
        <section className="relative min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 80% at 70% 40%, rgba(46,91,255,.14) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 25% 65%, rgba(255,45,143,.08) 0%, transparent 60%)',
              animation: 'pulse-bg 6s ease-in-out infinite alternate',
            }}
          />

          {/* Izquierda */}
          <div className="relative z-10 flex flex-col justify-end px-6 sm:px-10 md:px-14 pb-10 md:pb-20 pt-10 md:pt-24">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#ff2d8f] tracking-[.25em] uppercase mb-6 before:content-[''] before:w-6 before:h-px before:bg-[#ff2d8f]">
              Artículo destacado
            </div>

            {/* Título */}
            <h1 className="font-mono text-[clamp(44px,5.5vw,76px)] leading-[1.04] mb-8 tracking-[-0.01em]">
              {hero.title.includes(':') ? (
                <>
                  <span className="text-white">{hero.title.split(':')[0]}:</span>
                  <br />
                  <span className="grad-text">{hero.title.split(':')[1].trim()}</span>
                </>
              ) : (
                <span className="text-white">{hero.title}</span>
              )}
            </h1>

            <p className="text-[15px] leading-[1.75] text-[#99afbf] max-w-[420px] mb-10">
              {hero.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-5 font-mono text-[11px] tracking-[.12em] uppercase mb-10">
              <span className="text-[#ff2d8f]">{formatDate(hero.publishedAt)}</span>
              <span className="text-white/20">·</span>
              <span className="text-[#99afbf]">Por <span className="text-[#ff2d8f]">{hero.author?.name}</span></span>
              <span className="text-white/20">·</span>
              <span className="text-[#2e5bff]">{hero.read_time} MIN</span>
            </div>

            {/* CTA */}
            <Link
              href={`/articulos/${hero.slug}`}
              className="inline-flex items-center gap-3 text-white font-mono text-[12px] tracking-[.18em] uppercase px-8 py-4 no-underline w-fit transition-[transform,box-shadow] duration-200 hover:translate-x-1 after:content-['→'] after:text-[14px]"
              style={{
                background: 'linear-gradient(135deg, #2e5bff 0%, #7b3fff 50%, #ff2d8f 100%)',
                boxShadow: '0 0 32px rgba(46,91,255,.25), 0 0 60px rgba(255,45,143,.1)',
              }}
            >
              Leer artículo
            </Link>
          </div>

          {/* Derecha — imagen */}
          <div className="relative overflow-hidden hidden md:block">
            {getStrapiMedia(hero.cover_image?.url) && (
              <>
                <Image
                  src={getStrapiMedia(hero.cover_image.url)!}
                  alt={hero.title}
                  fill
                  className="object-cover grayscale contrast-[1.3] mix-blend-luminosity opacity-50"
                  style={{ filter: 'grayscale(1) contrast(1.3) blur(0.4px)' }}
                  priority
                />
                {/* Color overlay */}
                <div
                  className="absolute inset-0 z-10"
                  style={{ background: 'linear-gradient(135deg, rgba(46,91,255,.8) 0%, rgba(123,63,255,.5) 50%, rgba(255,45,143,.4) 100%)', mixBlendMode: 'multiply' }}
                />
                {/* Dot pattern */}
                <div
                  className="absolute inset-0 z-20 opacity-30 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(circle, #0d0d14 1px, transparent 1px)', backgroundSize: '6px 6px' }}
                />
                {/* CRT scanlines estáticas */}
                <div
                  className="absolute inset-0 z-[25] pointer-events-none"
                  style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)' }}
                />
                {/* Glitch bars */}
                <div
                  className="absolute inset-0 z-[35] pointer-events-none"
                  style={{ animation: 'glitch-bars 7s steps(1) infinite' }}
                />
                {/* RGB fringe izquierda */}
                <div
                  className="absolute inset-0 z-[22] pointer-events-none opacity-60"
                  style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,45,143,0.08) 0%, transparent 8%, transparent 92%, rgba(46,91,255,0.08) 100%)' }}
                />
              </>
            )}

            {/* Scanline principal */}
            <div
              className="absolute left-0 right-0 h-0.5 z-30 pointer-events-none opacity-25"
              style={{ background: 'linear-gradient(transparent, #ff2d8f, transparent)', animation: 'scan 4s linear infinite' }}
            />
            {/* Segunda scanline — azul, más lenta */}
            <div
              className="absolute left-0 right-0 h-[3px] z-30 pointer-events-none opacity-10"
              style={{ background: 'linear-gradient(transparent, #fff, transparent)', animation: 'scan 9s linear infinite 2s' }}
            />

            {/* Label */}
            <div className="absolute bottom-10 left-8 z-30 font-mono">
              <span className="text-[11px] tracking-[.2em] uppercase text-[#ff2d8f] flex items-center gap-2 mb-2 before:content-[''] before:w-8 before:h-px before:bg-[#ff2d8f]">
                {hero.category?.name}
              </span>
              <strong className="block text-[26px] leading-[1.1] text-white/70">
                {hero.author?.name}
              </strong>
            </div>


            {/* Línea divisoria izquierda */}
            <div
              className="absolute left-0 top-[10%] bottom-[10%] w-px z-20"
              style={{ background: 'linear-gradient(transparent, rgba(255,45,143,.2), transparent)' }}
            />

            {/* Sparkles */}
            <div className="absolute top-[30%] left-[-16px] z-40 text-[#ff2d8f] text-xl pointer-events-none" style={{ animation: 'twinkle 2s ease-in-out infinite alternate' }}>✦</div>
            <div className="absolute top-[55%] left-[-10px] z-40 text-[#2e5bff] text-sm pointer-events-none" style={{ animation: 'twinkle 2s .6s ease-in-out infinite alternate' }}>✦</div>
            <div className="absolute top-[20%] left-[-6px] z-40 text-[#ffb830] text-xs pointer-events-none" style={{ animation: 'twinkle 2s 1.2s ease-in-out infinite alternate' }}>✦</div>
          </div>
        </section>
      )}

      {/* ── TICKER ── */}
      <Marquee items={TICKER_ITEMS} />

      {/* ── SECCIÓN ARTÍCULOS ── */}
      <div className="flex items-baseline justify-between px-6 sm:px-10 pt-12 md:pt-16 pb-6 md:pb-8 border-b border-white/[.06] relative z-10">
        <div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#ff2d8f] tracking-[.25em] uppercase before:content-[''] before:w-5 before:h-px before:bg-[#ff2d8f]">
            Últimas entradas
          </div>
          <div className="text-3xl font-light tracking-[-0.02em] text-white mt-2">
            El archivo
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/archivo"
            className="font-mono text-[11px] text-[#99afbf] no-underline tracking-[.15em] uppercase border-b border-current pb-0.5 transition-colors duration-200 hover:text-[#ff2d8f]"
          >
            Ver todo →
          </Link>
        </div>
      </div>

      {/* ── GRID ── */}
      {gridArticles.length > 0 && (
        <div
          className="relative z-10 article-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1px', background: 'rgba(255,255,255,.06)' }}
        >
          {gridArticles.map((article, i) => (
            <div key={article.id} className={i === 0 ? 'md:row-span-2' : ''}>
              <ArticleCard article={article} featured={i === 0} />
            </div>
          ))}
        </div>
      )}

      {/* Glow divider */}
      <div
        className="relative z-10 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(46,91,255,.3), rgba(255,45,143,.3), transparent)', boxShadow: '0 0 20px rgba(255,45,143,.15)' }}
      />

      {/* ── STRIP ── */}
      {stripArticles.length > 0 && (
        <div
          className="relative z-10 article-strip"
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1px', background: 'rgba(255,255,255,.06)' }}
        >
          {stripArticles.map((article, i) => (
            <Link
              key={article.id}
              href={`/articulos/${article.slug}`}
              className="group bg-[#16161f] p-8 flex gap-5 items-start no-underline relative overflow-hidden transition-colors duration-200 hover:bg-[#1c1c2a]"
            >
              {/* Accent bar gradiente */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 origin-bottom transition-transform duration-300 group-hover:scale-y-100"
                style={{ background: 'linear-gradient(135deg, #2e5bff, #ff2d8f)' }}
              />
              <span className="font-mono text-[32px] text-white/[.06] leading-none flex-shrink-0 transition-colors duration-200 group-hover:text-white/[.12]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <div className="font-mono text-[10px] text-[#2e5bff] tracking-[.18em] uppercase mb-2">
                  {article.category?.name}
                </div>
                <div className="text-[15px] font-medium leading-[1.4] text-[#f0f2ff] mb-2 transition-colors duration-200 group-hover:text-[#ff2d8f]">
                  {article.title}
                </div>
                <div className="font-mono text-[10px] text-[#99afbf] tracking-[.1em]">
                  {article.author?.name} · {article.read_time} MIN
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── CATEGORÍAS ── */}
      <div className="px-6 sm:px-10 py-12 md:py-16 relative z-10">
        <div className="flex items-center gap-3 font-mono text-[11px] text-[#ff2d8f] tracking-[.25em] uppercase before:content-[''] before:w-5 before:h-px before:bg-[#ff2d8f]">
          Explorar por sección
        </div>
        <div className="flex gap-3 flex-wrap mt-8">
          <Link
            href="/archivo"
            className="font-mono text-[11px] tracking-[.15em] uppercase px-5 py-2.5 no-underline text-white"
            style={{ background: 'linear-gradient(135deg, #2e5bff, #ff2d8f)' }}
          >
            Todo
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className="group relative font-mono text-[11px] tracking-[.15em] uppercase px-5 py-2.5 border border-white/20 text-[#99afbf] no-underline overflow-hidden transition-colors duration-200 hover:text-white hover:border-transparent"
            >
              <span
                className="absolute inset-0 scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100 -z-10"
                style={{ background: 'linear-gradient(135deg, #2e5bff, #ff2d8f)' }}
              />
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Logo banner */}
      <div className="relative z-10 border-t border-white/[.06] py-20 flex flex-col items-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(46,91,255,.05) 0%, transparent 70%)' }}
        />
        <img
          src="/logo-stars.png"
          alt="Undiscover"
          className="h-16 relative"
          style={{ filter: 'invert(1) brightness(10)', opacity: 0.15 }}
        />
        <p className="font-mono text-[11px] tracking-[.3em] uppercase text-white/[.1] mt-6">
          Exploración Permanente · Archivo Vivo · v0.1
        </p>
      </div>

      <Footer />

      <style>{`
        @media (min-width: 768px) {
          .article-grid { grid-template-columns: 2fr 1fr 1fr !important; grid-template-rows: auto auto !important; }
          .article-strip { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @keyframes scan {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
        @keyframes pulse-bg {
          from { opacity: .7; }
          to   { opacity: 1; }
        }
        @keyframes twinkle {
          from { opacity: .2; transform: scale(.8) rotate(0deg); }
          to   { opacity: .9; transform: scale(1.15) rotate(15deg); }
        }
        @keyframes glitch-bars {
          0%, 84%, 100% {
            opacity: 0;
            background: transparent;
            transform: translateX(0);
          }
          85% {
            opacity: 1;
            background: linear-gradient(
              transparent 22%,
              rgba(46,91,255,.45) 22%, rgba(46,91,255,.45) 24%,
              transparent 24%,
              transparent 58%,
              rgba(255,45,143,.35) 58%, rgba(255,45,143,.35) 59.5%,
              transparent 59.5%
            );
            transform: translateX(-10px);
          }
          86% {
            opacity: 1;
            background: linear-gradient(
              transparent 40%,
              rgba(255,184,48,.3) 40%, rgba(255,184,48,.3) 41.5%,
              transparent 41.5%,
              transparent 72%,
              rgba(46,91,255,.4) 72%, rgba(46,91,255,.4) 74%,
              transparent 74%
            );
            transform: translateX(14px);
          }
          87% {
            opacity: 1;
            background: linear-gradient(
              transparent 60%,
              rgba(255,45,143,.3) 60%, rgba(255,45,143,.3) 62%,
              transparent 62%,
              transparent 15%,
              rgba(255,255,255,.06) 15%, rgba(255,255,255,.06) 16.5%,
              transparent 16.5%
            );
            transform: translateX(-6px);
          }
          88% { opacity: 0; background: transparent; transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
