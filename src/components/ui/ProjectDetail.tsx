import type { Project } from '../../types'
import { blogPosts } from '../../data/blog'
import { useLang, t } from '../../hooks/useLang'
import { ui } from '../../data/ui-text'

export function ProjectDetail({ project }: { project: Project }) {
  const { lang } = useLang()

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 p-5 bg-slate-50/50 dark:bg-slate-800/50">
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-line">
        {t(project.description, lang)}
      </p>

      {project.scale && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {Object.entries(project.scale).map(([label, value]) => (
            <div key={label} className="text-center p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-transparent">
              <div className="text-lg font-bold text-sky-500 font-mono">{value}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      )}

      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">{ui('highlights', lang)}</h4>
      <ul className="space-y-1 mb-4">
        {project.highlights.map((h, i) => (
          <li key={i} className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <span className="text-sky-400 mt-1 shrink-0">-</span>
            <span>{t(h, lang)}</span>
          </li>
        ))}
      </ul>

      {project.designDecisions && project.designDecisions.length > 0 && (
        <>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">{ui('designDecisions', lang)}</h4>
          <div className="space-y-3 mb-4">
            {project.designDecisions.map((d, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <div className="text-sm font-semibold text-sky-500 mb-1">{t(d.title, lang)}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t(d.reasoning, lang)}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.techStack.map((tech) => (
          <span key={tech} className="text-xs px-2 py-0.5 font-mono bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-transparent">
            {tech}
          </span>
        ))}
      </div>

      {project.relatedNotes && project.relatedNotes.length > 0 && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-400 mr-2">{ui('relatedArticle', lang)}:</span>
          {project.relatedNotes.map((slug) => {
            const post = blogPosts.find((p) => p.slug === slug)
            if (!post) return null
            return (
              <a key={slug} href="#notes" className="text-xs text-sky-500 hover:text-sky-400 transition-colors">
                {t(post.title, lang)} →
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
