import { useState, useEffect } from 'react'
import type { BlogPost } from '../../types'
import { useLang, t } from '../../hooks/useLang'

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

  // 記事本文を取得
  useEffect(() => {
    if (!post.url) return
    setLoading(true)
    fetch(post.url)
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
  }, [post.url])

  // スクロール位置をリセット
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const isReady = !loading && content && mdModules

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-slate-900">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors cursor-pointer"
          >
            ← {lang === 'ja' ? '戻る' : 'Back'}
          </button>
          <span className="text-xs font-mono text-slate-400">{post.date}</span>
        </div>
      </div>

      {/* 記事本文 */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* メタ情報 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 font-mono bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded border border-slate-200 dark:border-slate-700">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4 leading-tight">
            {t(post.title, lang)}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            {t(post.excerpt, lang)}
          </p>
        </div>

        <hr className="border-slate-200 dark:border-slate-800 mb-8" />

        {/* Markdown本文 */}
        {!isReady ? (
          <div className="text-center text-slate-400 py-20">
            {loading ? (lang === 'ja' ? '読み込み中...' : 'Loading...') : (lang === 'ja' ? '記事の読み込みに失敗しました' : 'Failed to load article')}
          </div>
        ) : (
          <div className="prose prose-slate dark:prose-invert max-w-none
            prose-headings:text-slate-900 dark:prose-headings:text-slate-50
            prose-h1:text-2xl prose-h1:mt-10 prose-h1:mb-4
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
            prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-3
            prose-li:text-slate-600 dark:prose-li:text-slate-300
            prose-a:text-sky-500 prose-a:no-underline hover:prose-a:underline
            prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-slate-100 dark:prose-pre:bg-slate-800/80 prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-slate-700 prose-pre:rounded-xl
            prose-strong:text-slate-900 dark:prose-strong:text-slate-50
            prose-th:text-slate-700 dark:prose-th:text-slate-300 prose-th:text-left
            prose-td:text-slate-600 dark:prose-td:text-slate-400
            prose-hr:border-slate-200 dark:prose-hr:border-slate-800
            prose-table:text-sm
          ">
            <mdModules.Markdown remarkPlugins={[mdModules.gfm]} rehypePlugins={[mdModules.rehypeHighlight]}>{content}</mdModules.Markdown>
          </div>
        )}

        {/* フッター */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="text-sm text-sky-500 hover:text-sky-400 transition-colors cursor-pointer"
          >
            ← {lang === 'ja' ? '一覧に戻る' : 'Back to list'}
          </button>
        </div>
      </article>
    </div>
  )
}
