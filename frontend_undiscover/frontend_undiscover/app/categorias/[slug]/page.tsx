import { notFound } from 'next/navigation'
import { getCategories, getArticlesByCategory } from '@/lib/strapi'
import ArticleCard from '@/components/ArticleCard'
import Footer from '@/components/Footer'
import { Article, Category } from '@/lib/types'

export async function generateStaticParams() {
  try {
    const categories: Category[] = await getCategories()
    return categories.map((c) => ({ slug: c.slug }))
  } catch {
    return []
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  let articles: Article[] = []
  let categories: Category[] = []
  let current: Category | undefined

  try {
    ;[articles, categories] = await Promise.all([
      getArticlesByCategory(params.slug),
      getCategories(),
    ])
    current = categories.find((c) => c.slug === params.slug)
  } catch {}

  if (!current) notFound()

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[1000] opacity-[.025]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }} />
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage: 'linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Header categoría */}
      <div className="relative z-10 pt-28 pb-16 px-10 border-b border-white/[.06]">
        <div className="flex items-center gap-3 font-mono text-[11px] text-[#ff2d8f] tracking-[.25em] uppercase mb-4 before:content-[''] before:w-5 before:h-px before:bg-[#ff2d8f]">
          Sección
        </div>
        <h1 className="font-mono text-[clamp(36px,5vw,72px)] leading-[1.05] text-white mb-4 tracking-[-0.01em]">
          {current.name}
        </h1>
        {current.description && (
          <p className="text-[15px] leading-[1.7] text-[#99afbf] max-w-[480px]">
            {current.description}
          </p>
        )}
        <div className="mt-6 font-mono text-[11px] text-[#99afbf] tracking-[.1em]">
          <span className="text-[#ff2d8f]">{articles.length}</span> artículo{articles.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filtros de categorías */}
      <div className="relative z-10 px-10 py-6 border-b border-white/[.06] flex items-center gap-3 flex-wrap">
        <a href="/archivo" className="font-mono text-[11px] tracking-[.15em] uppercase px-4 py-2 border border-white/20 text-[#99afbf] hover:text-white hover:border-transparent transition-colors no-underline relative overflow-hidden group">
          <span className="absolute inset-0 scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100 -z-10"
            style={{ background: 'linear-gradient(135deg, #2e5bff, #ff2d8f)' }} />
          Todo
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/categorias/${cat.slug}`}
            className={`font-mono text-[11px] tracking-[.15em] uppercase px-4 py-2 border transition-colors no-underline ${
              cat.slug === params.slug
                ? 'text-white border-transparent'
                : 'border-white/20 text-[#99afbf] hover:text-white hover:border-transparent'
            }`}
            style={cat.slug === params.slug ? { background: 'linear-gradient(135deg, #2e5bff, #ff2d8f)' } : undefined}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Grid artículos */}
      {articles.length === 0 ? (
        <div className="relative z-10 px-10 py-24 text-center">
          <div className="font-mono text-[11px] tracking-[.2em] uppercase text-[#99afbf]">
            // Sin artículos en esta sección todavía
          </div>
        </div>
      ) : (
        <div
          className="relative z-10"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,.06)',
          }}
        >
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} featured={i === 0 && articles.length === 1} />
          ))}
        </div>
      )}

      <Footer />
    </>
  )
}
