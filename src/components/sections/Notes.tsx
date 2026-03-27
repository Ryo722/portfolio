import { blogPosts } from '../../data/blog'
import { useLang, t } from '../../hooks/useLang'
import { ui } from '../../data/ui-text'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'

export function Notes() {
  const { lang } = useLang()

  return (
    <section id="notes" className="py-20 px-6">
      <FadeInOnScroll>
        <SectionHeading>Notes</SectionHeading>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-10 -mt-8">
          {ui('notesDescription', lang)}
        </p>
        <div className="max-w-3xl mx-auto space-y-4">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-sky-400/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <time className="text-xs font-mono text-slate-400">{post.date}</time>
                <div className="flex gap-1.5">
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
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm text-sky-400 hover:text-sky-300">
                  {lang === 'ja' ? '続きを読む' : 'Read more'} →
                </a>
              ) : (
                <span className="inline-block mt-3 text-xs text-slate-400">{ui('comingSoon', lang)}</span>
              )}
            </article>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  )
}
