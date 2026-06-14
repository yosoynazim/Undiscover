'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getComments, postComment } from '@/lib/strapi'
import type { Comment } from '@/lib/types'

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs} h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `hace ${days} día${days > 1 ? 's' : ''}`
  return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function Comments({ articleDocumentId }: { articleDocumentId: string }) {
  const { user, jwt, openAuthModal } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getComments(articleDocumentId)
      .then(setComments)
      .finally(() => setLoading(false))
  }, [articleDocumentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !jwt || !text.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await postComment(text.trim(), articleDocumentId, user.username, user.email, jwt)
      setText('')
      const fresh = await getComments(articleDocumentId)
      setComments(fresh)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-16 pt-10 border-t border-white/10">
      {/* Header */}
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[.2em] uppercase text-[#2e5bff] mb-10 before:content-['//'] before:opacity-50">
        Comentarios
        {!loading && (
          <span className="text-white/20 ml-1">({comments.length})</span>
        )}
      </div>

      {/* Form o prompt login */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 flex items-center justify-center bg-[#2e5bff] font-mono text-[11px] text-white tracking-[.05em] flex-shrink-0">
              {getInitials(user.username)}
            </div>
            <span className="font-mono text-[12px] text-white/60 tracking-[.08em]">
              {user.username}
            </span>
          </div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            required
            maxLength={1000}
            rows={3}
            placeholder="Escribí tu comentario..."
            className="w-full bg-[#1a1a1a] border border-white/10 text-[#f8f9fa] font-[var(--font-space)] text-[14px] leading-[1.7] px-5 py-4 outline-none focus:border-[#2e5bff] transition-colors resize-none tracking-[.01em] placeholder:text-white/20"
          />

          <div className="flex items-center justify-between mt-3">
            <span className="font-mono text-[10px] text-white/20 tracking-[.08em]">
              {text.length}/1000
            </span>
            <div className="flex items-center gap-4">
              {error && (
                <span className="font-mono text-[11px] text-red-400">// {error}</span>
              )}
              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="bg-[#2e5bff] text-white font-mono text-[11px] tracking-[.18em] uppercase px-6 py-2.5 border-none transition-[background,opacity] hover:bg-[#1a3acc] disabled:opacity-40"
              >
                {submitting ? '...' : 'Publicar →'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 border border-white/10 bg-[#1a1a1a] px-6 py-5 flex items-center justify-between gap-4">
          <span className="font-mono text-[12px] text-[#99afbf] tracking-[.05em]">
            // Iniciá sesión para dejar un comentario
          </span>
          <button
            onClick={openAuthModal}
            className="font-mono text-[11px] tracking-[.18em] uppercase px-5 py-2 border border-[#2e5bff] text-[#2e5bff] bg-transparent hover:bg-[#2e5bff] hover:text-white transition-colors"
          >
            Ingresar →
          </button>
        </div>
      )}

      {/* Lista comentarios */}
      {loading ? (
        <div className="font-mono text-[12px] text-white/20 tracking-[.1em]">
          // cargando comentarios...
        </div>
      ) : comments.length === 0 ? (
        <div className="font-mono text-[12px] text-white/20 tracking-[.1em] py-4">
          // Todavía no hay comentarios. Sé el primero.
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {comments.map((comment, i) => (
            <div
              key={comment.id}
              className="py-7 border-b border-white/[.06] relative pl-5"
            >
              {/* Accent bar */}
              <div className="absolute left-0 top-7 bottom-7 w-[2px] bg-[#2e5bff] opacity-30" />

              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 flex items-center justify-center bg-[#1f1f1f] border border-white/10 font-mono text-[10px] text-[#99afbf] flex-shrink-0">
                  {getInitials(comment.authorName ?? '?')}
                </div>
                <span className="font-mono text-[12px] text-white tracking-[.06em]">
                  {comment.authorName}
                </span>
                <span className="font-mono text-[10px] text-white/25 tracking-[.06em] ml-auto">
                  {formatRelative(comment.createdAt)}
                </span>
              </div>

              <p className="text-[14px] leading-[1.75] text-[#99afbf] pl-10">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
