import type { Project } from '../../types'
import { blogPosts } from '../../data/blog'
import { useLang, t } from '../../hooks/useLang'
import { ui } from '../../data/ui-text'

export function ProjectDetail({ project }: { project: Project }) {
  const { lang } = useLang()

  return (
    <div className="border-t border-[var(--color-border)] p-5 bg-[var(--color-surface)]">
      <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-4 whitespace-pre-line">
        {t(project.description, lang)}
      </p>

      {/* カテゴリ・visibility: ステータス画面風ドットリーダー */}
      <div className="mb-4 space-y-1">
        <div className="flex items-baseline font-mono text-sm">
          <span className="text-[var(--color-text-faint)] shrink-0">{ui('category', lang)}</span>
          <span className="flex-1 mx-2 border-b border-dotted border-[var(--color-border)]" />
          <span className="text-[var(--color-accent)] font-bold shrink-0">{project.category}</span>
        </div>
        <div className="flex items-baseline font-mono text-sm">
          <span className="text-[var(--color-text-faint)] shrink-0">{ui('visibility', lang)}</span>
          <span className="flex-1 mx-2 border-b border-dotted border-[var(--color-border)]" />
          <span className="text-[var(--color-accent)] font-bold shrink-0">
            {project.visibility === 'public' ? ui('visibilityPublic', lang) : ui('visibilityPrivate', lang)}
          </span>
        </div>
      </div>

      {/* scale: ステータス画面風ドットリーダー */}
      {project.scale && (
        <div className="mb-4 space-y-1">
          {Object.entries(project.scale).map(([label, value]) => (
            <div key={label} className="flex items-baseline font-mono text-sm">
              <span className="text-[var(--color-text-faint)] shrink-0">{label}</span>
              <span className="flex-1 mx-2 border-b border-dotted border-[var(--color-border)]" />
              <span className="text-[var(--color-accent)] font-bold shrink-0">{value}</span>
            </div>
          ))}
        </div>
      )}

      <h4 className="text-sm font-semibold text-[var(--color-text)] mb-2 font-mono">{ui('highlights', lang)}</h4>
      <ul className="space-y-1 mb-4">
        {project.highlights.map((h, i) => (
          <li key={i} className="text-sm text-[var(--color-text-muted)] flex items-start gap-2">
            <span className="text-[var(--color-accent)] mt-0.5 shrink-0 font-mono">&gt;</span>
            <span>{t(h, lang)}</span>
          </li>
        ))}
      </ul>

      {project.designDecisions && project.designDecisions.length > 0 && (
        <>
          <h4 className="text-sm font-semibold text-[var(--color-text)] mb-2 font-mono">{ui('designDecisions', lang)}</h4>
          <div className="space-y-3 mb-4">
            {project.designDecisions.map((d, i) => (
              <div key={i} className="bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] p-3">
                <div className="text-sm font-semibold text-[var(--color-accent)] mb-1">{t(d.title, lang)}</div>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{t(d.reasoning, lang)}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* テックスタック: ブラケット表示 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.techStack.map((tech) => (
          <span key={tech} className="text-xs px-2 py-0.5 font-mono text-[var(--color-text-muted)] bg-[var(--color-card)] rounded border border-[var(--color-border)]">
            [{tech}]
          </span>
        ))}
      </div>

      {project.relatedNotes && project.relatedNotes.length > 0 && (
        <div className="pt-3 border-t border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-text-faint)] mr-2">{ui('relatedArticle', lang)}:</span>
          {project.relatedNotes.map((slug) => {
            const post = blogPosts.find((p) => p.slug === slug)
            if (!post) return null
            return (
              <a key={slug} href="#notes" className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors">
                {t(post.title, lang)} →
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
