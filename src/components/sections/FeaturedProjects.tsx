import { projects } from '../../data/projects'
import { blogPosts } from '../../data/blog'
import { useLang, t } from '../../hooks/useLang'
import { ui } from '../../data/ui-text'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'
import type { Project } from '../../types'

function CaseStudyCard({ project }: { project: Project }) {
  const { lang } = useLang()
  const relatedPost = project.relatedNotes?.[0]
    ? blogPosts.find((p) => p.slug === project.relatedNotes![0])
    : null

  return (
    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-card)] transition-all duration-300 hover:border-[var(--color-accent)]/40" style={{ boxShadow: 'var(--shadow-card)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)' }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}>
      {/* ヘッダー画像 */}
      {project.image && (
        <div className="h-48 sm:h-56">
          <img
            src={project.image}
            alt={t(project.name, lang)}
            className="w-full h-full object-cover"
            width={800}
            height={500}
            loading="lazy"
          />
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* タイトル + バッジ */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
            {t(project.name, lang)}
          </h3>
          <span className="shrink-0 text-xs px-2.5 py-1 text-[var(--color-accent)] rounded border border-[var(--color-accent)]/30 font-mono">
            {ui('featured', lang)}
          </span>
        </div>

        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-5">
          {t(project.summary, lang)}
        </p>

        {/* 数値指標: ステータス画面風ドットリーダー + ミニバー */}
        {project.scale && (
          <div className="mb-6 space-y-2.5">
            {Object.entries(project.scale).map(([label, value], _i, arr) => {
              // 数値を抽出してバー幅を算出（最大値を100%としたスケール）
              const numericValue = parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0
              const maxValue = Math.max(...arr.map(([, v]) => parseInt(String(v).replace(/[^0-9]/g, ''), 10) || 0))
              const barPercent = maxValue > 0 ? Math.max(8, (numericValue / maxValue) * 100) : 0

              return (
                <div key={label}>
                  <div className="flex items-baseline font-mono text-sm">
                    <span className="text-[var(--color-text-faint)] shrink-0">{label}</span>
                    <span className="flex-1 mx-2 border-b border-dotted border-[var(--color-border)]" />
                    <span className="text-[var(--color-accent)] font-bold shrink-0">{value}</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-[var(--color-border)]/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--color-accent)]/40"
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 設計判断 */}
        {project.designDecisions && project.designDecisions.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3 font-mono">
              {ui('designDecisions', lang)}
            </h4>
            <div className="space-y-2.5">
              {project.designDecisions.map((d, i) => (
                <div key={i} className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-3">
                  <div className="text-sm font-semibold text-[var(--color-accent)] mb-1">{t(d.title, lang)}</div>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{t(d.reasoning, lang)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* テックスタック: ブラケット表示 */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.map((tech) => (
            <span key={tech} className="text-xs px-2 py-0.5 font-mono text-[var(--color-text-muted)] bg-[var(--color-surface)] rounded border border-[var(--color-border)]">
              [{tech}]
            </span>
          ))}
        </div>

        {/* リンク群 */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors font-mono">
              ▶ GitHub
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 text-[var(--color-accent)] rounded-lg border border-[var(--color-accent)]/30 hover:border-[var(--color-accent)]/60 transition-colors font-mono">
              ▶ Demo
            </a>
          )}
          {relatedPost && relatedPost.url && (
            <a href="#notes" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
              {ui('relatedArticle', lang)} →
            </a>
          )}
          {project.visibility === 'private' && (
            <span className="text-xs text-[var(--color-text-faint)] font-mono">Private</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function FeaturedProjects() {
  const featuredProjects = projects.filter((p) => p.featured)

  return (
    <section id="projects" className="py-20 px-6 bg-[var(--color-surface)] border-t border-[var(--color-border)]/50">
      <FadeInOnScroll>
        <SectionHeading>Featured Projects</SectionHeading>
      </FadeInOnScroll>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {featuredProjects.map((project, index) => (
          <FadeInOnScroll key={project.slug} delay={index * 100}>
            <CaseStudyCard project={project} />
          </FadeInOnScroll>
        ))}
      </div>
    </section>
  )
}
