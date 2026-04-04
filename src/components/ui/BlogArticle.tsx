import { useState, useEffect, useMemo } from 'react'
import type { BlogPost } from '../../types'
import { projects } from '../../data/projects'
import { useLang, t } from '../../hooks/useLang'
import { ui } from '../../data/ui-text'

/** 見出しテキストからURL-safeなslugを生成 */
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u3000-\u9FFF\uF900-\uFAFF]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Markdownテキストからh2/h3見出しを抽出 */
function extractHeadings(md: string): { level: 2 | 3; text: string; id: string }[] {
  const results: { level: 2 | 3; text: string; id: string }[] = []
  const lines = md.split('\n')
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+)$/)
    if (m) {
      const level = m[1].length as 2 | 3
      const text = m[2].replace(/[*_`~[\]]/g, '').trim()
      results.push({ level, text, id: toSlug(text) })
    }
  }
  return results
}

export function BlogArticle({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  const { lang } = useLang()
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mdModules, setMdModules] = useState<{ Markdown: any; gfm: any; rehypeHighlight: any } | null>(null)

  // Markdown ライブラリを遅延ロード
  useEffect(() => {
    Promise.all([
      import('react-markdown'),
      import('remark-gfm'),
      import('rehype-highlight'),
    ]).then(([md, gfm, highlight]) => {
      setMdModules({ Markdown: md.default, gfm: gfm.default, rehypeHighlight: highlight.default })
    })
  }, [])

  // 記事本文を取得（英語版があれば優先、なければ日本語にフォールバック）
  useEffect(() => {
    const primaryUrl = (lang === 'en' && post.enUrl) ? post.enUrl : post.url
    if (!primaryUrl) return
    setLoading(true)
    fetch(primaryUrl)
      .then((res) => {
        if (!res.ok && lang === 'en' && post.url) return fetch(post.url)
        return res
      })
      .then((res) => res.text())
      .then((text) => {
        const body = text.replace(/^---[\s\S]*?---\s*/, '')
        setContent(body)
        setLoading(false)
      })
      .catch(() => {
        setContent(null)
        setLoading(false)
      })
  }, [post.url, post.enUrl, lang])

  // BlogPosting JSON-LD 構造化データ
  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: t(post.title, lang),
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: 'Ryo722',
        url: 'https://ryo722.github.io/portfolio/',
      },
      url: `https://ryo722.github.io/portfolio/?note=${post.slug}`,
      description: t(post.excerpt, lang),
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'blog-posting-jsonld'
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)
    return () => {
      const el = document.getElementById('blog-posting-jsonld')
      if (el) el.remove()
    }
  }, [post, lang])

  // スクロール位置をリセット + ESCキーでクローズ
  useEffect(() => {
    window.scrollTo(0, 0)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const isReady = !loading && content && mdModules

  // 見出しリストをメモ化
  const headings = useMemo(() => (content ? extractHeadings(content) : []), [content])

  // react-markdown の components で h2/h3 に id を注入
  const mdComponents = useMemo(() => ({
    h2: ({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => {
      const text = typeof children === 'string' ? children : String(children)
      return <h2 id={toSlug(text)} {...props}>{children}</h2>
    },
    h3: ({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => {
      const text = typeof children === 'string' ? children : String(children)
      return <h3 id={toSlug(text)} {...props}>{children}</h3>
    },
  }), [])

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--color-surface)]">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
          >
            ← {lang === 'ja' ? '戻る' : 'Back'}
          </button>
          <span className="text-xs font-mono text-[var(--color-text-faint)]">{post.date}</span>
        </div>
      </div>

      {/* 記事本文 */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* メタ情報 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 font-mono bg-[var(--color-card)] text-[var(--color-accent)] rounded border border-[var(--color-border)]">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-4 leading-tight">
            {t(post.title, lang)}
          </h1>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            {t(post.excerpt, lang)}
          </p>
        </div>

        <hr className="border-[var(--color-border)] mb-8" />

        {/* 目次 (TOC) */}
        {isReady && headings.length > 0 && (
          <nav className="mb-10 p-4 border border-[var(--color-border)] rounded-xl bg-[var(--color-card)]" aria-label="Table of contents">
            <p className="text-xs font-mono tracking-widest text-[var(--color-text-faint)] mb-3 select-none">INDEX</p>
            <ol className="space-y-1.5 list-none m-0 p-0">
              {headings.map((h) => (
                <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                  <a
                    href={`#${h.id}`}
                    className="text-sm font-mono text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors no-underline"
                  >
                    {h.level === 2 ? '▸ ' : '– '}{h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Markdown本文 */}
        {!isReady ? (
          <div className="text-center text-[var(--color-text-faint)] py-20">
            {loading ? (lang === 'ja' ? '読み込み中...' : 'Loading...') : (lang === 'ja' ? '記事の読み込みに失敗しました' : 'Failed to load article')}
          </div>
        ) : (
          <div className="prose prose-slate dark:prose-invert max-w-none
            prose-headings:text-[var(--color-text)]
            prose-h1:text-2xl prose-h1:mt-10 prose-h1:mb-4
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
            prose-p:text-[var(--color-text-muted)] prose-p:leading-relaxed prose-p:my-3
            prose-li:text-[var(--color-text-muted)]
            prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline
            prose-code:text-[var(--color-accent)] prose-code:bg-[var(--color-card)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[var(--color-card)] prose-pre:border prose-pre:border-[var(--color-border)] prose-pre:rounded-xl
            prose-strong:text-[var(--color-text)]
            prose-th:text-[var(--color-text-muted)] prose-th:text-left
            prose-td:text-[var(--color-text-faint)]
            prose-hr:border-[var(--color-border)]
            prose-table:text-sm
          ">
            <mdModules.Markdown remarkPlugins={[mdModules.gfm]} rehypePlugins={[mdModules.rehypeHighlight]} components={mdComponents}>{content}</mdModules.Markdown>
          </div>
        )}

        {/* 関連プロジェクト */}
        {(() => {
          const related = projects.filter((p) => p.relatedNotes?.includes(post.slug))
          if (related.length === 0) return null
          return (
            <div className="mt-12 p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-card)]">
              <span className="text-xs font-mono tracking-widest text-[var(--color-text-faint)] block mb-2">{ui('relatedProject', lang)}</span>
              <div className="flex flex-wrap gap-3">
                {related.map((proj) => (
                  <a
                    key={proj.slug}
                    href="#all-projects"
                    onClick={onClose}
                    className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors font-mono"
                  >
                    {t(proj.name, lang)} →
                  </a>
                ))}
              </div>
            </div>
          )
        })()}

        {/* フッター */}
        <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors cursor-pointer"
          >
            ← {lang === 'ja' ? '一覧に戻る' : 'Back to list'}
          </button>
        </div>
      </article>
    </div>
  )
}
