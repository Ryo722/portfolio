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
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
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
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
            {t(project.name, lang)}
          </h3>
          <span className="shrink-0 text-xs px-2.5 py-1 bg-sky-400/10 text-sky-500 rounded-full border border-sky-400/20 font-medium">
            {ui('featured', lang)}
          </span>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">
          {t(project.summary, lang)}
        </p>

        {/* 数値指標 */}
        {project.scale && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {Object.entries(project.scale).map(([label, value]) => (
              <div key={label} className="text-center p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-lg font-bold text-sky-500 font-mono">{value}</div>
                <div className="text-xs text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* 設計判断 */}
        {project.designDecisions && project.designDecisions.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              {ui('designDecisions', lang)}
            </h4>
            <div className="space-y-2.5">
              {project.designDecisions.map((d, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <div className="text-sm font-semibold text-sky-500 mb-1">{t(d.title, lang)}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t(d.reasoning, lang)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* テックスタック */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.map((tech) => (
            <span key={tech} className="text-xs px-2 py-0.5 font-mono bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
              {tech}
            </span>
          ))}
        </div>

        {/* リンク群 */}
        <div className="flex flex-wrap items-center gap-3">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-500 hover:text-sky-400 transition-colors">
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-sm px-4 py-1.5 bg-sky-400/10 text-sky-500 rounded-lg border border-sky-400/20 hover:bg-sky-400/20 transition-colors font-medium">
              {lang === 'ja' ? 'デモを試す' : 'Try Demo'}
            </a>
          )}
          {relatedPost && relatedPost.url && (
            <a href={`#notes`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors">
              {ui('relatedArticle', lang)} →
            </a>
          )}
          {project.visibility === 'private' && (
            <span className="text-xs text-slate-400">Private</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function FeaturedProjects() {
  const featuredProjects = projects.filter((p) => p.featured)

  return (
    <section id="projects" className="py-20 px-6 bg-slate-100/50 dark:bg-slate-800/30">
      <FadeInOnScroll>
        <SectionHeading>Featured Projects</SectionHeading>
      </FadeInOnScroll>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {featuredProjects.map((project) => (
          <FadeInOnScroll key={project.slug}>
            <CaseStudyCard project={project} />
          </FadeInOnScroll>
        ))}
      </div>
    </section>
  )
}
