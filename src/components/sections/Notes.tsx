import { useState, useEffect, useCallback, useMemo } from 'react'
import type { BlogPost } from '../../types'
import { blogPosts } from '../../data/blog'
import { projects } from '../../data/projects'
import { useLang, t } from '../../hooks/useLang'
import { ui } from '../../data/ui-text'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'
import { BlogArticle } from '../ui/BlogArticle'

const INITIAL_COUNT = 3

export function Notes() {
  const { lang } = useLang()
  const [activePost, setActivePost] = useState<BlogPost | null>(() => {
    // URLパラメータから記事を開く（?note=slug）
    const params = new URLSearchParams(window.location.search)
    const noteSlug = params.get('note')
    if (noteSlug) {
      const post = blogPosts.find((p) => p.slug === noteSlug)
      if (post && post.url) return post
    }
    return null
  })
  const [showAll, setShowAll] = useState(false)

  // ブログslug → 関連プロジェクト の逆引きマップ
  const noteToProjects = useMemo(() => {
    const map = new Map<string, typeof projects>()
    for (const project of projects) {
      if (project.relatedNotes) {
        for (const noteSlug of project.relatedNotes) {
          const existing = map.get(noteSlug) ?? []
          existing.push(project)
          map.set(noteSlug, existing)
        }
      }
    }
    return map
  }, [])

  const sortedPosts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date))

  const openPost = useCallback((post: BlogPost) => {
    setActivePost(post)
    const url = new URL(window.location.href)
    url.searchParams.set('note', post.slug)
    window.history.pushState({}, '', url.toString())
    document.title = `${t(post.title, lang)} — Ryo722`
  }, [lang])

  const closePost = useCallback(() => {
    setActivePost(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('note')
    window.history.pushState({}, '', url.toString())
    document.title = 'Ryo722 — Portfolio'
  }, [])

  // ブラウザ戻る/進むに対応
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const noteSlug = params.get('note')
      if (noteSlug) {
        const post = blogPosts.find((p) => p.slug === noteSlug)
        if (post && post.url) { setActivePost(post); return }
      }
      setActivePost(null)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (activePost) {
    return <BlogArticle post={activePost} onClose={closePost} />
  }

  const visiblePosts = showAll ? sortedPosts : sortedPosts.slice(0, INITIAL_COUNT)
  const hasMore = sortedPosts.length > INITIAL_COUNT

  return (
    <section id="notes" className="py-20 px-6 bg-[var(--color-surface)] border-t border-[var(--color-border)]/50">
      <FadeInOnScroll>
        <SectionHeading>Notes</SectionHeading>
        <p className="text-center text-[var(--color-text-muted)] mb-10 -mt-8">
          {ui('notesDescription', lang)}
        </p>
        <div className="max-w-3xl mx-auto space-y-4">
          {visiblePosts.map((post) => (
            <article key={post.slug} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-md p-5 hover:border-[var(--color-accent)]/50 transition-all duration-300" style={{ boxShadow: 'var(--shadow-card)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)' }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}>
              <div className="flex items-center gap-3 mb-2">
                <time className="text-xs font-mono text-[var(--color-text-faint)] tracking-wider">{post.date.replace(/-/g, '.')}</time>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 font-mono text-[var(--color-text-faint)]">
                      [{tag}]
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] mb-2">
                {t(post.title, lang)}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {t(post.excerpt, lang)}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div>
                  {post.url ? (
                    <button
                      onClick={() => openPost(post)}
                      className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] cursor-pointer"
                    >
                      {lang === 'ja' ? '続きを読む' : 'Read more'} →
                    </button>
                  ) : (
                    <span className="text-xs text-[var(--color-text-faint)]">{ui('comingSoon', lang)}</span>
                  )}
                </div>
                {noteToProjects.has(post.slug) && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[var(--color-text-faint)]">{ui('relatedProject', lang)}:</span>
                    {noteToProjects.get(post.slug)!.map((proj) => (
                      <a
                        key={proj.slug}
                        href="#all-projects"
                        className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors font-mono"
                      >
                        {t(proj.name, lang)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}

          {hasMore && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 rounded-md transition-colors cursor-pointer"
            >
              {lang === 'ja' ? `他の記事を見る（${sortedPosts.length - INITIAL_COUNT}件）` : `Show more (${sortedPosts.length - INITIAL_COUNT} articles)`}
            </button>
          )}

          {showAll && hasMore && (
            <button
              onClick={() => setShowAll(false)}
              className="w-full py-3 text-sm text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] transition-colors cursor-pointer"
            >
              {lang === 'ja' ? '閉じる' : 'Show less'}
            </button>
          )}
        </div>
      </FadeInOnScroll>
    </section>
  )
}
