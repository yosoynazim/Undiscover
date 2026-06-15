import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getArticleBySlug, getArticles } from '@/lib/strapi'
import { getStrapiMedia, formatDate } from '@/lib/utils'
import Footer from '@/components/Footer'
import Comments from '@/components/Comments'
import { Article } from '@/lib/types'

export async function generateStaticParams() {
  try {
    const articles: Article[] = await getArticles()
    return articles.map((a) => ({ slug: a.slug }))
  } catch {
    return []
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let article: Article | null = null
  try {
    article = await getArticleBySlug(slug)
  } catch {}

  if (!article) notFound()

  const imageUrl = getStrapiMedia(article.cover_image?.url)
  const avatarUrl = getStrapiMedia(article.author?.avatar?.url)

  return (
    <>
      {/* Noise + grid */}
      <div className="fixed inset-0 pointer-events-none z-[55] opacity-[.025]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }} />
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage: 'linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Barra de progreso */}
      <div id="progress-bar" className="fixed top-0 left-0 h-0.5 bg-[#2e5bff] z-[600] transition-all duration-100" style={{ width: '0%' }} />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 20% 30%, rgba(255,45,143,.06) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 70%, rgba(46,91,255,.08) 0%, transparent 60%)' }} />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden">
        {imageUrl && (
          <div className="absolute inset-0">
            <Image src={imageUrl} alt={article.title} fill className="object-cover grayscale contrast-[1.3] mix-blend-luminosity opacity-50" priority />
            <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(46,91,255,.75) 0%, rgba(123,63,255,.5) 50%, rgba(255,45,143,.35) 100%)', mixBlendMode: 'multiply' }} />
            <div className="absolute inset-0 z-20 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0d0d14 1px, transparent 1px)', backgroundSize: '5px 5px' }} />
            <div className="absolute inset-0 z-30" style={{ background: 'linear-gradient(transparent 35%, #0d0d14)' }} />
          </div>
        )}
        {/* Scanline */}
        <div className="absolute left-0 right-0 h-0.5 pointer-events-none opacity-20 z-40"
          style={{ background: 'linear-gradient(transparent, #ff2d8f, transparent)', animation: 'scan 5s linear infinite' }} />

        <div className="relative z-40 px-10 pb-16 max-w-[860px]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[.18em] uppercase text-[#99afbf] mb-6">
            <Link href="/" className="hover:text-[#ff2d8f] transition-colors">Home</Link>
            <span className="text-[#ff2d8f]">/</span>
            {article.category && (
              <>
                <Link href={`/categorias/${article.category.slug}`} className="hover:text-[#ff2d8f] transition-colors">
                  {article.category.name}
                </Link>
                <span className="text-[#ff2d8f]">/</span>
              </>
            )}
            <span className="text-white">{article.title.slice(0, 30)}…</span>
          </div>

          {article.category && (
            <span className="inline-block font-mono text-[10px] tracking-[.18em] uppercase text-white px-3 py-1 mb-5"
              style={{ background: 'linear-gradient(135deg, #2e5bff, #ff2d8f)' }}>
              {article.category.name}
            </span>
          )}
          <h1 className="font-mono text-[clamp(32px,5vw,64px)] leading-[1.05] text-white mb-6 tracking-[-0.01em]">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 flex-wrap">
            {article.author && (
              <div className="flex items-center gap-3">
                {avatarUrl && (
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-[#ff2d8f]/50 flex-shrink-0">
                    <Image src={avatarUrl} alt={article.author.name} width={36} height={36} className="object-cover grayscale" />
                  </div>
                )}
                <span className="font-mono text-[12px] tracking-[.1em] text-[#ff2d8f]">{article.author.name}</span>
              </div>
            )}
            <div className="w-px h-5 bg-white/20" />
            <span className="font-mono text-[11px] tracking-[.12em] text-[#99afbf] uppercase">
              {formatDate(article.publishedAt)}
            </span>
            <div className="w-px h-5 bg-white/20" />
            <span className="font-mono text-[11px] tracking-[.12em] text-[#99afbf] uppercase">
              <span className="text-[#2e5bff]">{article.read_time}</span> MIN
            </span>
          </div>
        </div>
      </section>

      {/* Glow divider */}
      <div className="relative z-10 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(46,91,255,.3), rgba(255,45,143,.3), transparent)', boxShadow: '0 0 20px rgba(255,45,143,.1)' }} />

      {/* Layout artículo */}
      <div className="max-w-[1200px] mx-auto px-10 grid grid-cols-[1fr_280px] gap-0 relative z-10">

        {/* Cuerpo */}
        <article className="py-16 pr-16 border-r border-white/[.06]">
          {article.excerpt && (
            <p className="text-[20px] leading-[1.65] text-[#99afbf] font-light mb-10 pb-10 border-b border-white/[.06]">
              {article.excerpt}
            </p>
          )}

          {/* Bloques de contenido */}
          <div className="article-body text-[16px] leading-[1.8] text-[#c8d0d8]">
            {renderBody(article.body)}
          </div>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-14 pt-8 border-t border-white/[.06]">
              {article.tags.map((tag) => (
                <span key={tag.id} className="font-mono text-[10px] tracking-[.15em] uppercase px-3.5 py-1.5 border border-white/20 text-[#99afbf] hover:border-[#ff2d8f] hover:text-[#ff2d8f] transition-colors">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Comentarios */}
          <Comments articleDocumentId={article.documentId} />
        </article>

        {/* Sidebar */}
        <aside className="py-16 pl-10 flex flex-col gap-12">
          {/* Autor */}
          {article.author && (
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[.2em] uppercase text-[#ff2d8f] mb-5 before:content-[''] before:w-4 before:h-px before:bg-[#ff2d8f]">
                Autor
              </div>
              <div className="flex flex-col gap-3">
                {avatarUrl && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-[#ff2d8f]/40">
                    <Image src={avatarUrl} alt={article.author.name} width={64} height={64} className="object-cover grayscale" />
                  </div>
                )}
                <div className="font-mono text-[14px] text-[#ff2d8f] tracking-[.05em]">{article.author.name}</div>
                {article.author.bio && (
                  <div className="text-[13px] leading-[1.6] text-[#99afbf]">{article.author.bio}</div>
                )}
              </div>
            </div>
          )}

          {/* Categoría */}
          {article.category && (
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[.2em] uppercase text-[#ff2d8f] mb-5 before:content-[''] before:w-4 before:h-px before:bg-[#ff2d8f]">
                Sección
              </div>
              <Link
                href={`/categorias/${article.category.slug}`}
                className="group relative font-mono text-[11px] tracking-[.15em] uppercase px-4 py-2 border border-white/20 text-[#99afbf] no-underline overflow-hidden transition-colors duration-200 hover:text-white hover:border-transparent inline-block"
              >
                <span className="absolute inset-0 scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100 -z-10"
                  style={{ background: 'linear-gradient(135deg, #2e5bff, #ff2d8f)' }} />
                {article.category.name}
              </Link>
            </div>
          )}
        </aside>
      </div>

      <Footer />

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
        .article-body h2 {
          font-family: var(--font-mono-display), 'Share Tech Mono', monospace;
          font-size: 22px;
          letter-spacing: .04em;
          color: #f0f2ff;
          margin: 48px 0 20px;
          padding-left: 20px;
          border-left: 3px solid #ff2d8f;
        }
        .article-body h3 {
          font-size: 17px;
          font-weight: 600;
          color: #f0f2ff;
          margin: 32px 0 14px;
        }
        .article-body p { margin-bottom: 24px; }
        .article-body strong { color: #f0f2ff; font-weight: 600; }
        .article-body a { color: #2e5bff; text-decoration: underline; }
        .article-body a:hover { color: #ff2d8f; }
        .article-body blockquote {
          margin: 48px 0;
          padding: 32px 40px;
          background: rgba(46,91,255,.06);
          border-left: 3px solid;
          border-image: linear-gradient(135deg, #2e5bff, #ff2d8f) 1;
          font-family: var(--font-mono-display), 'Share Tech Mono', monospace;
          font-size: 18px;
          line-height: 1.55;
          color: #f0f2ff;
        }
        .article-body ul, .article-body ol { margin-bottom: 24px; }
        .article-body li { color: #c8d0d8; }
        .article-body code { background: rgba(46,91,255,.12); border: 1px solid rgba(46,91,255,.2); padding: 2px 8px; border-radius: 2px; font-size: 13px; color: #99afbf; }
      `}</style>
    </>
  )
}

/* Renderizado básico de Strapi Blocks */
function renderBody(body: any): React.ReactNode {
  if (!body) return null
  if (typeof body === 'string') return <p>{body}</p>
  if (!Array.isArray(body)) return null

  return body.map((block: any, i: number) => {
    switch (block.type) {
      case 'paragraph':
        return <p key={i}>{renderChildren(block.children)}</p>
      case 'heading':
        const Tag = `h${block.level}` as any
        return <Tag key={i}>{renderChildren(block.children)}</Tag>
      case 'quote':
        return <blockquote key={i}>{renderChildren(block.children)}</blockquote>
      case 'list':
        const List = block.format === 'ordered' ? 'ol' : 'ul'
        return (
          <List key={i} className="pl-6 mb-6 space-y-2">
            {block.children.map((item: any, j: number) => (
              <li key={j}>{renderChildren(item.children)}</li>
            ))}
          </List>
        )
      case 'image':
        return (
          <figure key={i} className="my-10 relative">
            <img src={getStrapiMedia(block.image?.url) ?? ''} alt={block.image?.alternativeText ?? ''} className="w-full grayscale contrast-[1.2] mix-blend-luminosity" />
            <div className="absolute inset-0 bg-[#2e5bff] mix-blend-multiply opacity-60 pointer-events-none" />
            {block.image?.caption && (
              <figcaption className="font-mono text-[11px] tracking-[.1em] text-[#99afbf] uppercase mt-3">
                // {block.image.caption}
              </figcaption>
            )}
          </figure>
        )
      default:
        return null
    }
  })
}

function renderChildren(children: any[]): React.ReactNode {
  if (!children) return null
  return children.map((child: any, i: number) => {
    if (child.type === 'text') {
      let node: React.ReactNode = child.text
      if (child.bold) node = <strong key={i}>{node}</strong>
      if (child.italic) node = <em key={i}>{node}</em>
      if (child.underline) node = <u key={i}>{node}</u>
      if (child.code) node = <code key={i} className="bg-white/10 px-1.5 py-0.5 font-mono text-[14px] text-[#99afbf]">{node}</code>
      return <span key={i}>{node}</span>
    }
    if (child.type === 'link') {
      return <a key={i} href={child.url} target="_blank" rel="noopener noreferrer">{renderChildren(child.children)}</a>
    }
    return null
  })
}
