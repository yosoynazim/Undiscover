import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getAuthorBySlug, getArticlesByAuthor, getArticles } from '@/lib/strapi'
import { getStrapiMedia, formatDate } from '@/lib/utils'
import ArticleCard from '@/components/ArticleCard'
import Footer from '@/components/Footer'
import { Article, Author } from '@/lib/types'

export async function generateStaticParams() {
  try {
    const articles: Article[] = await getArticles()
    const slugs = [...new Set(articles.map((a) => a.author?.slug).filter(Boolean))]
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  let author: Author | null = null
  let articles: Article[] = []

  try {
    ;[author, articles] = await Promise.all([
      getAuthorBySlug(params.slug),
      getArticlesByAuthor(params.slug),
    ])
  } catch {}

  if (!author) notFound()

  const avatarUrl = getStrapiMedia(author.avatar?.url)

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[1000] opacity-[.025]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }} />
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage: 'linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Header autor */}
      <div className="relative z-10 pt-28 pb-16 px-10 border-b border-white/10">
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#2e5bff] tracking-[.2em] uppercase mb-8 before:content-[''] before:w-6 before:h-px before:bg-[#2e5bff]">
          Colaborador
        </div>
        <div className="flex items-center gap-8">
          {avatarUrl && (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#2e5bff] flex-shrink-0">
              <Image src={avatarUrl} alt={author.name} width={80} height={80} className="object-cover grayscale" />
            </div>
          )}
          <div>
            <h1 className="font-mono text-[clamp(28px,4vw,56px)] leading-[1.05] text-white tracking-[-0.01em]">
              {author.name}
            </h1>
            {author.twitter && (
              <a
                href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[12px] text-[#2e5bff] tracking-[.1em] mt-2 inline-block no-underline hover:underline"
              >
                {author.twitter}
              </a>
            )}
          </div>
        </div>
        {author.bio && (
          <p className="text-[15px] leading-[1.7] text-[#99afbf] max-w-[560px] mt-8">
            {author.bio}
          </p>
        )}
        <div className="mt-6 font-mono text-[11px] text-[#99afbf] tracking-[.1em]">
          <span className="text-white">{articles.length}</span> artículo{articles.length !== 1 ? 's' : ''} publicado{articles.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Artículos del autor */}
      {articles.length === 0 ? (
        <div className="relative z-10 px-10 py-24 text-center">
          <div className="font-mono text-[11px] tracking-[.2em] uppercase text-[#99afbf]">
            // Sin artículos publicados todavía
          </div>
        </div>
      ) : (
        <div
          className="relative z-10"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: '#ffffff10',
          }}
        >
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      <Footer />
    </>
  )
}
