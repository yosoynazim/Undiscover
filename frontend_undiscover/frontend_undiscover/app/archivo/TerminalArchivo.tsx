'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Article, Category } from '@/lib/types'
import { getStrapiMedia, formatDate } from '@/lib/utils'

interface Props {
  articles: Article[]
  categories: Category[]
}

type TText   = { kind: 'text';   id: number; html: string }
type TCard   = { kind: 'card';   id: number; article: Article; cardIdx: number }
type TSpacer = { kind: 'spacer'; id: number }
type Item = TText | TCard | TSpacer

let _uid = 0
const uid = () => ++_uid

function esc(s: string) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

export default function TerminalArchivo({ articles, categories }: Props) {
  const [openFolders, setOpenFolders]     = useState<Set<string>>(new Set())
  const [output, setOutput]               = useState<Item[]>([])
  const [filteredList, setFilteredList]   = useState<Article[]>([])
  const [activeIdx, setActiveIdx]         = useState(0)
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)
  const [inputVal, setInputVal]           = useState('')
  const [path, setPath]                   = useState('~/archivo')
  const [clock, setClock]                 = useState('')
  const [cursor, setCursor]               = useState({ x: -100, y: -100 })

  const inputRef  = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const booted    = useRef(false)

  // Reloj
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('es-AR', { hour12: false }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  // Cursor personalizado
  useEffect(() => {
    const onMove = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const scroll = () => requestAnimationFrame(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  })

  // ── Builders ─────────────────────────────────────────────────────────────
  const txt = (html: string): TText   => ({ kind: 'text',   id: uid(), html })
  const sp  = ():             TSpacer => ({ kind: 'spacer', id: uid() })

  const pmt = (cmd: string, p: string): TText => txt(
    `<span style="color:#39ff8a">editor</span>` +
    `<span style="color:#ffffff20">@</span>` +
    `<span style="color:#39ff8a">undiscover</span>` +
    `<span style="color:#ffffff20">:</span>` +
    `<span style="color:#2e5bff">${esc(p)}</span>` +
    `<span style="color:#39ff8a">$ </span>` +
    `<span style="color:#f8f9fa">${esc(cmd)}</span>`
  )

  // ── Render list ───────────────────────────────────────────────────────────
  const renderList = (list: Article[], cmd: string, p: string) => {
    const items: Item[] = [
      pmt(cmd, p),
      sp(),
      txt(`<span style="color:#ffffff25">total ${list.length} archivo${list.length !== 1 ? 's' : ''}</span>`),
      sp(),
      ...list.map((a, i): TCard => ({ kind: 'card', id: uid(), article: a, cardIdx: i })),
      sp(),
      list.length > 0
        ? txt(`<span style="color:#ffffff25">${list.length} archivo${list.length !== 1 ? 's' : ''} · escribí <span style="color:#39ff8a">help</span> para ver comandos · ↑↓ para navegar</span>`)
        : txt(`<span style="color:#ff4444">// directorio vacío</span>`),
    ]
    setOutput(items)
    setFilteredList(list)
    setActiveIdx(0)
    setActiveArticle(list[0] ?? null)
    setPath(p)
    scroll()
  }

  // ── Comandos ──────────────────────────────────────────────────────────────
  const processCommand = (raw: string) => {
    const parts = raw.trim().split(/\s+/)
    const cmd   = parts[0].toLowerCase()
    const arg   = parts.slice(1).join(' ').trim()

    // ls
    if (cmd === 'ls') {
      if (!arg) { renderList(articles, 'ls -la', '~/archivo'); return }
      const cat = categories.find(c => c.slug === arg || c.name.toLowerCase() === arg.toLowerCase())
      if (cat) {
        const filtered = articles.filter(a => a.category?.slug === cat.slug)
        setOpenFolders(prev => new Set([...prev, cat.slug]))
        renderList(filtered, `ls -la ${cat.slug}/`, `~/archivo/${cat.slug}`)
      } else {
        setOutput([
          pmt(raw, path), sp(),
          txt(`<span style="color:#ff4444">ls: ${esc(arg)}/: directorio no encontrado</span>`),
          txt(`<span style="color:#ffffff25">Disponibles: ${categories.map(c => c.slug).join(', ')}</span>`),
          sp(),
        ])
        setFilteredList([])
      }
      return
    }

    // cd
    if (cmd === 'cd') {
      if (!arg || arg === '~' || arg === '..') { renderList(articles, 'ls -la', '~/archivo'); return }
      const cat = categories.find(c => c.slug === arg || c.name.toLowerCase() === arg.toLowerCase())
      if (cat) {
        const filtered = articles.filter(a => a.category?.slug === cat.slug)
        setOpenFolders(prev => new Set([...prev, cat.slug]))
        renderList(filtered, `ls -la ${cat.slug}/`, `~/archivo/${cat.slug}`)
      } else {
        setOutput([pmt(raw, path), sp(), txt(`<span style="color:#ff4444">cd: ${esc(arg)}: directorio no encontrado</span>`), sp()])
      }
      return
    }

    // grep / buscar
    if (cmd === 'grep' || cmd === 'buscar' || cmd === 'search') {
      if (!arg) { setOutput([pmt(raw, path), sp(), txt(`<span style="color:#ff4444">Uso: grep [término]</span>`), sp()]); return }
      const term = arg.toLowerCase()
      const results = articles.filter(a =>
        a.title.toLowerCase().includes(term) ||
        (a.excerpt?.toLowerCase().includes(term)) ||
        (a.author?.name.toLowerCase().includes(term)) ||
        (a.category?.name.toLowerCase().includes(term)) ||
        (a.tags?.some(t => t.name.toLowerCase().includes(term)))
      )
      const items: Item[] = [
        pmt(`grep "${arg}" ./`, '~/archivo'),
        sp(),
        results.length === 0
          ? txt(`<span style="color:#ff4444">0 resultados para "${esc(arg)}"</span>`)
          : txt(`<span style="color:#ffffff25">${results.length} resultado${results.length !== 1 ? 's' : ''} para "<span style="color:#ffb830">${esc(arg)}</span>"</span>`),
        sp(),
        ...results.map((a, i): TCard => ({ kind: 'card', id: uid(), article: a, cardIdx: i })),
        sp(),
      ]
      setOutput(items)
      setFilteredList(results)
      setActiveIdx(0)
      setActiveArticle(results[0] ?? null)
      setPath('~/archivo')
      scroll()
      return
    }

    // cat [slug]
    if (cmd === 'cat') {
      if (!arg) { setOutput([pmt(raw, path), sp(), txt(`<span style="color:#ff4444">Uso: cat [slug]</span>`), sp()]); return }
      const slug = arg.replace(/\.md$/, '')
      const found = articles.find(a => a.slug === slug || a.slug.includes(slug.toLowerCase()))
      if (found) {
        setActiveArticle(found)
        const idx = filteredList.findIndex(a => a.id === found.id)
        if (idx >= 0) setActiveIdx(idx)
        setOutput([
          pmt(`cat ${esc(found.slug)}.md`, path), sp(),
          txt(`<span style="color:#39ff8a">// ${esc(found.slug)}.md</span>`),
          txt(`<span style="color:#f8f9fa">${esc(found.title)}</span>`),
          found.excerpt ? txt(`<span style="color:#ffffff40">${esc(found.excerpt)}</span>`) : sp(),
          sp(),
        ])
        scroll()
      } else {
        setOutput([
          pmt(raw, path), sp(),
          txt(`<span style="color:#ff4444">cat: ${esc(arg)}.md: archivo no encontrado</span>`),
          txt(`<span style="color:#ffffff25">Escribí <span style="color:#39ff8a">ls</span> para ver los archivos disponibles</span>`),
          sp(),
        ])
      }
      return
    }

    // clear
    if (cmd === 'clear') { boot(); return }

    // pwd
    if (cmd === 'pwd') {
      const abs = '/undiscover/archivo' + path.replace('~/archivo', '')
      setOutput([pmt('pwd', path), sp(), txt(`<span style="color:#ffffff50">${abs || '/undiscover/archivo'}</span>`), sp()])
      setFilteredList([])
      return
    }

    // whoami
    if (cmd === 'whoami') {
      setOutput([
        pmt('whoami', path), sp(),
        txt(`<span style="color:#ffffff50">editor@undiscover</span>`),
        txt(`<span style="color:#ffffff25">Resistencia Editorial · Zine Digital · v0.1</span>`),
        sp(),
      ])
      setFilteredList([])
      return
    }

    // date
    if (cmd === 'date') {
      const d = new Date().toLocaleDateString('es-AR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
      setOutput([pmt('date', path), sp(), txt(`<span style="color:#ffffff50">${d}</span>`), sp()])
      setFilteredList([])
      return
    }

    // help
    if (cmd === 'help' || cmd === '?') {
      const cmds: [string, string][] = [
        ['ls',             'listar todos los artículos'],
        ['ls [categoria]', 'filtrar por categoría'],
        ['grep [término]', 'buscar en título, excerpt, tags, autor'],
        ['cat [slug]',     'abrir artículo por slug'],
        ['cd [categoria]', 'navegar a categoría'],
        ['clear',          'limpiar terminal'],
        ['pwd',            'directorio actual'],
        ['whoami',         'info del editor'],
        ['date',           'fecha actual'],
        ['help',           'mostrar esta ayuda'],
      ]
      setOutput([
        pmt('help', path), sp(),
        txt(`<span style="color:#39ff8a;letter-spacing:.1em">COMANDOS DISPONIBLES</span>`),
        sp(),
        ...cmds.map(([c, d]) => txt(
          `<span style="color:#39ff8a;display:inline-block;min-width:220px">${c}</span>` +
          `<span style="color:#ffffff30">  ${d}</span>`
        )),
        sp(),
        txt(`<span style="color:#ffffff15">↑↓ navegar artículos · enter ejecutar · esc cerrar detalle</span>`),
        sp(),
      ])
      setFilteredList([])
      return
    }

    // Comando desconocido
    setOutput([
      pmt(raw, path), sp(),
      txt(`<span style="color:#ff4444">bash: ${esc(cmd)}: comando no encontrado</span>`),
      txt(`<span style="color:#ffffff25">Escribí <span style="color:#39ff8a">help</span> para ver los comandos disponibles</span>`),
      sp(),
    ])
    setFilteredList([])
  }

  // ── Boot sequence ─────────────────────────────────────────────────────────
  const boot = () => {
    const m0 = txt(`<span style="color:#ffffff25">UNDISCOVER ARCHIVO v0.1 — iniciando sistema...</span>`)
    const m1 = txt(`<span style="color:#ffffff25">cargando índice de archivos...</span>`)
    const m2 = txt(`<span style="color:#ffffff25">${articles.length} archivo${articles.length !== 1 ? 's' : ''} encontrado${articles.length !== 1 ? 's' : ''} en ${categories.length} directorios</span>`)
    const m3 = txt(`<span style="color:#39ff8a">sistema listo ✓</span>`)
    const m4 = txt(`<span style="color:#ffffff25">escribí <span style="color:#39ff8a">help</span> para ver los comandos disponibles</span>`)
    setOutput([m0])
    setTimeout(() => setOutput([m0, m1]),             200)
    setTimeout(() => setOutput([m0, m1, m2]),         380)
    setTimeout(() => setOutput([m0, m1, m2, m3]),     540)
    setTimeout(() => setOutput([m0, m1, m2, m3, m4]), 700)
    setTimeout(() => renderList(articles, 'ls -la', '~/archivo'), 1100)
  }

  useEffect(() => {
    if (!booted.current) { booted.current = true; boot() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Teclado ───────────────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = inputVal.trim()
      setInputVal('')
      if (val) processCommand(val)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(activeIdx + 1, filteredList.length - 1)
      setActiveIdx(next)
      if (filteredList[next]) setActiveArticle(filteredList[next])
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(activeIdx - 1, 0)
      setActiveIdx(prev)
      if (filteredList[prev]) setActiveArticle(filteredList[prev])
    }
    if (e.key === 'Escape') setActiveArticle(null)
  }

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const toggleFolder = (slug: string) => setOpenFolders(prev => {
    const next = new Set(prev)
    next.has(slug) ? next.delete(slug) : next.add(slug)
    return next
  })

  const handleFolderClick = (slug: string) => {
    const isOpen = openFolders.has(slug)
    setOpenFolders(prev => { const n = new Set(prev); n.add(slug); return n })
    const cat = categories.find(c => c.slug === slug)
    if (!cat) return
    const filtered = articles.filter(a => a.category?.slug === slug)
    renderList(filtered, `ls -la ${slug}/`, `~/archivo/${slug}`)
  }

  const imageUrl = activeArticle ? getStrapiMedia(activeArticle.cover_image?.url) : null
  const uncategorized = articles.filter(a => !a.category)

  return (
    <>
      {/* Cursor personalizado */}
      <div className="fixed pointer-events-none z-[9999]" style={{
        left: cursor.x, top: cursor.y, width: 10, height: 10,
        background: '#39ff8a',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        transform: 'translate(-50%, -50%)',
      }} />
      <div className="fixed pointer-events-none z-[9998]" style={{
        left: cursor.x, top: cursor.y, width: 28, height: 28,
        border: '1px solid #39ff8a', borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.4, transition: 'transform 0.15s',
      }} />

      <div className="flex flex-col" style={{
        height: 'calc(100vh - 61px)',
        background: '#0f0f0f',
        cursor: 'none',
        position: 'relative',
      }}>
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.08) 2px, rgba(0,0,0,.08) 4px)'
        }} />
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.5) 100%)'
        }} />

        {/* Titlebar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161616] border-b border-white/[.04] flex-shrink-0 z-20">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="font-mono text-[11px] text-white/20 tracking-[.12em] ml-3">
            undiscover — archivo@v0.1
          </span>
          <div className="ml-auto flex gap-5 font-mono text-[10px] text-white/[.12] tracking-[.1em]">
            <span className="text-[#39ff8a60]">{articles.length} archivos</span>
            <span>{clock}</span>
          </div>
        </div>

        {/* Split */}
        <div className="flex flex-1 overflow-hidden z-20">

          {/* ── Sidebar ── */}
          <div className="w-[260px] flex-shrink-0 border-r border-white/[.04] flex flex-col bg-[#0c0c0c]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[.04] font-mono text-[10px] tracking-[.18em] uppercase text-white/20">
              <span>EXPLORADOR</span>
              <span className="text-[#39ff8a60]">/archivo</span>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#ffffff10 transparent' }}>

              {/* Root */}
              <div
                className="flex items-center gap-1 px-3 py-1 font-mono text-[12px] text-[#2e5bff] hover:bg-[#2e5bff0a] transition-colors"
                style={{ cursor: 'none' }}
                onClick={() => renderList(articles, 'ls -la', '~/archivo')}
              >
                <span className="text-white/15 text-[11px] w-4">▾</span>
                <span className="mr-1">📁</span>
                <span className="flex-1">archivo/</span>
                <span className="font-mono text-[9px] border border-current opacity-40 px-1.5 py-0.5 ml-auto">{articles.length}</span>
              </div>

              {categories.map(cat => {
                const catArticles = articles.filter(a => a.category?.slug === cat.slug)
                const isOpen = openFolders.has(cat.slug)
                return (
                  <div key={cat.id}>
                    <div
                      className="flex items-center gap-1 pl-5 pr-3 py-1 font-mono text-[12px] text-[#2e5bff] hover:bg-[#2e5bff0a] transition-colors"
                      style={{ cursor: 'none' }}
                      onClick={() => handleFolderClick(cat.slug)}
                    >
                      <span className="text-white/15 text-[11px] w-4">{isOpen ? '▾' : '▸'}</span>
                      <span className="mr-1">{isOpen ? '📂' : '📁'}</span>
                      <span className="flex-1 truncate">{cat.slug}/</span>
                      <span className="font-mono text-[9px] border border-current opacity-40 px-1.5 py-0.5 ml-auto">{catArticles.length}</span>
                    </div>
                    {isOpen && catArticles.map(article => (
                      <div
                        key={article.id}
                        className="flex items-center gap-1 pl-10 pr-3 py-1 font-mono text-[11px] transition-colors"
                        style={{
                          cursor: 'none',
                          color: activeArticle?.id === article.id ? '#39ff8a' : 'rgba(255,255,255,.35)',
                          background: activeArticle?.id === article.id ? '#39ff8a0c' : undefined,
                        }}
                        onClick={() => {
                          setActiveArticle(article)
                          const idx = filteredList.findIndex(a => a.id === article.id)
                          if (idx >= 0) setActiveIdx(idx)
                        }}
                      >
                        <span style={{ color: '#ffffff15', fontSize: 10 }}>│ </span>
                        <span className="mr-1" style={{ fontSize: 10 }}>📄</span>
                        <span className="flex-1 truncate">{article.slug}.md</span>
                      </div>
                    ))}
                  </div>
                )
              })}

              {uncategorized.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 pl-5 pr-3 py-1 font-mono text-[12px] text-[#2e5bff] opacity-40">
                    <span className="w-4" />
                    <span className="mr-1">📁</span>
                    <span>sin-categoria/</span>
                  </div>
                  {uncategorized.map(article => (
                    <div
                      key={article.id}
                      className="flex items-center gap-1 pl-10 pr-3 py-1 font-mono text-[11px] text-white/30 hover:text-white/70 transition-colors"
                      style={{ cursor: 'none' }}
                      onClick={() => setActiveArticle(article)}
                    >
                      <span style={{ color: '#ffffff15', fontSize: 10 }}>│ </span>
                      <span style={{ fontSize: 10 }} className="mr-1">📄</span>
                      <span className="flex-1 truncate">{article.slug}.md</span>
                    </div>
                  ))}
                </div>
              )}

              {articles.length === 0 && (
                <div className="px-4 py-6 font-mono text-[11px] text-white/20">// vacío</div>
              )}
            </div>
          </div>

          {/* ── Main panel ── */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Tabs */}
            <div className="flex items-stretch border-b border-white/[.04] bg-[#161616] overflow-x-auto flex-shrink-0">
              <div
                className="flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[.08em] border-b-2 border-[#39ff8a] text-[#39ff8a] bg-[#0f0f0f]"
                style={{ cursor: 'none' }}
                onClick={() => renderList(articles, 'ls -la', '~/archivo')}
              >
                <span>archivo.sh</span>
              </div>
            </div>

            {/* Output */}
            <div
              ref={outputRef}
              className="flex-1 overflow-y-auto px-7 py-5 font-mono text-[13px]"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#ffffff10 transparent' }}
              onClick={() => inputRef.current?.focus()}
            >
              {output.map(item => {
                if (item.kind === 'spacer') {
                  return <div key={item.id} style={{ height: 8 }} />
                }
                if (item.kind === 'text') {
                  return (
                    <div
                      key={item.id}
                      className="leading-[1.8]"
                      dangerouslySetInnerHTML={{ __html: item.html }}
                    />
                  )
                }
                if (item.kind === 'card') {
                  const a = item.article
                  const isActive = item.cardIdx === activeIdx
                  return (
                    <div
                      key={item.id}
                      className="border p-4 mb-2 relative overflow-hidden transition-all"
                      style={{
                        cursor: 'none',
                        borderColor: isActive ? '#39ff8a' : '#ffffff0f',
                        background: isActive ? '#39ff8a06' : 'transparent',
                      }}
                      onClick={() => {
                        setActiveIdx(item.cardIdx)
                        setActiveArticle(a)
                      }}
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 w-0.5"
                        style={{
                          background: isActive ? '#39ff8a' : '#2e5bff',
                          transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                          transformOrigin: 'bottom',
                          transition: 'transform .2s',
                        }}
                      />
                      <div className="flex items-baseline gap-4 flex-wrap">
                        <span className="font-mono text-[11px] min-w-[28px]" style={{ color: '#39ff8a60' }}>
                          {String(item.cardIdx + 1).padStart(2, '0')}
                        </span>
                        <span
                          className="font-mono text-[13px] flex-1 min-w-[200px] transition-colors"
                          style={{ color: isActive ? '#39ff8a' : '#f8f9fa' }}
                        >
                          {a.title}
                        </span>
                      </div>
                      <div className="flex gap-4 flex-wrap mt-1.5 font-mono text-[11px]" style={{ paddingLeft: 44 }}>
                        {a.author   && <span style={{ color: '#2e5bff' }}>{a.author.name}</span>}
                        {a.category && <span style={{ color: '#ffb830' }}>{a.category.name}</span>}
                        <span style={{ color: '#ffffff30' }}>{a.read_time} min</span>
                        <span style={{ color: '#ffffff30' }}>{formatDate(a.publishedAt)}</span>
                      </div>
                    </div>
                  )
                }
                return null
              })}
              <div style={{ height: 24 }} />
            </div>

            {/* Hint */}
            <div
              className="absolute font-mono text-[10px] text-white/10 tracking-[.1em] pointer-events-none z-30"
              style={{ bottom: 56, right: 20 }}
            >
              ↑↓ navegar · enter ejecutar · esc cerrar · help ayuda
            </div>

            {/* Input row */}
            <div className="flex items-center border-t border-white/[.04] bg-[#161616] flex-shrink-0">
              <div className="font-mono text-[13px] px-4 py-3.5 border-r border-white/[.04] whitespace-nowrap flex-shrink-0" style={{ color: '#ffffff25' }}>
                <span style={{ color: '#39ff8a' }}>editor</span>
                <span style={{ color: '#ffffff20' }}>@</span>
                <span style={{ color: '#2e5bff' }}>undiscover</span>
                <span style={{ color: '#99afbf' }}>:{path}</span>
                <span style={{ color: '#39ff8a' }}> $</span>
              </div>
              <input
                ref={inputRef}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none font-mono text-[13px] text-white px-4 py-3.5 tracking-[.04em]"
                style={{ cursor: 'none', caretColor: '#39ff8a' }}
                placeholder="escribí un comando... (help para ayuda)"
                spellCheck={false}
                autoComplete="off"
              />
              <div
                className="w-[9px] h-[16px] bg-[#39ff8a] mr-4 flex-shrink-0"
                style={{ animation: 'blink .85s step-end infinite' }}
              />
            </div>
          </div>

          {/* ── Detail panel ── */}
          {activeArticle && (
            <div
              className="flex-shrink-0 border-l border-white/[.04] bg-[#0a0a0a] flex flex-col overflow-y-auto"
              style={{ width: 360, scrollbarWidth: 'thin', scrollbarColor: '#ffffff08 transparent' }}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[.04] font-mono text-[10px] tracking-[.18em] text-white/20 flex-shrink-0">
                <span>PREVIEW</span>
                <span style={{ color: '#39ff8a60' }}>{activeArticle.slug}.md</span>
                <button
                  className="text-white/25 text-[18px] leading-none hover:text-white/50 transition-colors ml-3"
                  style={{ cursor: 'none', background: 'none', border: 'none' }}
                  onClick={() => setActiveArticle(null)}
                >×</button>
              </div>

              {imageUrl && (
                <div className="relative flex-shrink-0 overflow-hidden" style={{ height: 180 }}>
                  <img
                    src={imageUrl}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                    style={{ filter: 'grayscale(1) contrast(1.2)', mixBlendMode: 'luminosity', opacity: 0.5 }}
                  />
                  <div className="absolute inset-0 z-[1]" style={{ background: '#2e5bff', mixBlendMode: 'multiply', opacity: 0.75 }} />
                  <div className="absolute inset-0 z-[2] opacity-30"
                    style={{ backgroundImage: 'radial-gradient(circle, #0f0f0f 1px, transparent 1px)', backgroundSize: '5px 5px' }} />
                  <div className="absolute bottom-3 left-4 z-[3] font-mono text-[9px] tracking-[.15em] uppercase" style={{ color: '#ffffff60' }}>
                    {activeArticle.category?.name ?? ''}
                  </div>
                </div>
              )}

              <div className="p-5 font-mono">
                {activeArticle.category && (
                  <div className="text-[10px] tracking-[.18em] uppercase mb-2" style={{ color: '#ffb830' }}>
                    {activeArticle.category.name}
                  </div>
                )}
                <div className="text-[15px] leading-[1.45] text-white mb-3 tracking-[.02em]">
                  {activeArticle.title}
                </div>
                {activeArticle.excerpt && (
                  <div className="text-[11px] leading-[1.75] mb-5 tracking-[.03em]" style={{ color: '#ffffff40' }}>
                    {activeArticle.excerpt}
                  </div>
                )}

                <div className="flex flex-col gap-1.5 mb-6">
                  {activeArticle.author && (
                    <div className="flex gap-2 text-[10px] tracking-[.1em]">
                      <span className="text-white/25 min-w-[60px]">autor</span>
                      <span style={{ color: '#2e5bff' }}>{activeArticle.author.name}</span>
                    </div>
                  )}
                  <div className="flex gap-2 text-[10px] tracking-[.1em]">
                    <span className="text-white/25 min-w-[60px]">fecha</span>
                    <span className="text-white">{formatDate(activeArticle.publishedAt)}</span>
                  </div>
                  <div className="flex gap-2 text-[10px] tracking-[.1em]">
                    <span className="text-white/25 min-w-[60px]">lectura</span>
                    <span style={{ color: '#39ff8a' }}>{activeArticle.read_time} min</span>
                  </div>
                </div>

                <Link
                  href={`/articulos/${activeArticle.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[#2e5bff] font-mono text-[11px] tracking-[.15em] uppercase text-[#2e5bff] no-underline transition-all hover:bg-[#2e5bff] hover:text-white"
                  style={{ cursor: 'none' }}
                >
                  cat {activeArticle.slug}.md →
                </Link>

                {activeArticle.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {activeArticle.tags.map(tag => (
                      <span key={tag.id} className="font-mono text-[9px] tracking-[.15em] uppercase px-2.5 py-1 border border-white/15 text-white/35">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        * { cursor: none !important; }
      `}</style>
    </>
  )
}
