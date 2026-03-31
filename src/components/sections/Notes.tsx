import { useState, useEffect, useCallback } from 'react'
import type { BlogPost } from '../../types'
import { blogPosts } from '../../data/blog'
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
    <section id="notes" className="py-20 px-6">
      <FadeInOnScroll>
        <SectionHeading>Notes</SectionHeading>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-10 -mt-8">
          {ui('notesDescription', lang)}
        </p>
        <div className="max-w-3xl mx-auto space-y-4">
          {visiblePosts.map((post) => (
            <article key={post.slug} className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-sky-400/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <time className="text-xs font-mono text-slate-400">{post.date}</time>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 font-mono bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">
                {t(post.title, lang)}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(post.excerpt, lang)}
              </p>
              {post.url ? (
                <button
                  onClick={() => openPost(post)}
                  className="inline-block mt-3 text-sm text-sky-500 hover:text-sky-400 cursor-pointer"
                >
                  {lang === 'ja' ? '続きを読む' : 'Read more'} →
                </button>
              ) : (
                <span className="inline-block mt-3 text-xs text-slate-400">{ui('comingSoon', lang)}</span>
              )}
            </article>
          ))}

          {hasMore && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-500 border border-slate-200 dark:border-slate-700 hover:border-sky-400/50 rounded-xl transition-colors cursor-pointer"
            >
              {lang === 'ja' ? `他の記事を見る（${sortedPosts.length - INITIAL_COUNT}件）` : `Show more (${sortedPosts.length - INITIAL_COUNT} articles)`}
            </button>
          )}

          {showAll && hasMore && (
            <button
              onClick={() => setShowAll(false)}
              className="w-full py-3 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              {lang === 'ja' ? '閉じる' : 'Show less'}
            </button>
          )}
        </div>
      </FadeInOnScroll>
    </section>
  )
}
