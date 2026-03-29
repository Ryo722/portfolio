import { useState } from 'react'
import type { Project } from '../../types'
import { useLang, t } from '../../hooks/useLang'
import { ui } from '../../data/ui-text'
import { ProjectDetail } from './ProjectDetail'

const categoryGradients: Record<string, string> = {
  'フルスタック / オンラインゲーム': 'from-indigo-600/20 to-purple-600/20',
  'Webアプリ / ツール': 'from-sky-600/20 to-cyan-600/20',
  'ブラウザゲーム': 'from-emerald-600/20 to-teal-600/20',
  'AI × 金融': 'from-amber-600/20 to-orange-600/20',
  'AI × 自動化': 'from-violet-600/20 to-fuchsia-600/20',
  'インフラ / DevOps': 'from-slate-600/20 to-zinc-600/20',
  '自動化 / フルスタック': 'from-cyan-600/20 to-blue-600/20',
  'ゲームツール': 'from-rose-600/20 to-pink-600/20',
  '自動化 / CLI': 'from-green-600/20 to-emerald-600/20',
}

const categoryIcons: Record<string, string> = {
  'フルスタック / オンラインゲーム': '🎮',
  'Webアプリ / ツール': '🛠',
  'ブラウザゲーム': '🧩',
  'AI × 金融': '📊',
  'AI × 自動化': '🤖',
  'インフラ / DevOps': '🖥',
  '自動化 / フルスタック': '⚡',
  'ゲームツール': '🎯',
  '自動化 / CLI': '⌨',
}

export function ProjectCard({ project }: { project: Project }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { lang } = useLang()
  const gradient = categoryGradients[project.category] ?? 'from-slate-700/30 to-slate-600/30'
  const icon = categoryIcons[project.category] ?? '📁'

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-400/5">
      <div className={`h-36 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-2 relative`}>
        {project.image ? (
          <img src={project.image} alt={t(project.name, lang)} className="w-full h-full object-cover" width={800} height={500} loading="lazy" />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
            <span className="text-3xl" role="img" aria-hidden="true">{icon}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{project.category}</span>
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {project.techStack.slice(0, 3).map((tech) => (
                <span key={tech} className="text-[10px] px-1.5 py-0.5 font-mono bg-white/30 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
        {project.featured && (
          <span className="absolute top-3 right-3 text-xs px-2 py-0.5 bg-sky-400/20 text-sky-400 rounded-full border border-sky-400/30 backdrop-blur-sm">
            {ui('featured', lang)}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-1">{t(project.name, lang)}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">{t(project.summary, lang)}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 5).map((tech) => (
            <span key={tech} className="text-xs px-2 py-0.5 font-mono bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded">
              {tech}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="text-xs px-2 py-0.5 text-slate-400">+{project.techStack.length - 5}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-500 hover:text-sky-400 transition-colors">GitHub</a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-500 hover:text-sky-400 transition-colors">Demo</a>
          )}
          {project.visibility === 'private' && <span className="text-xs text-slate-400">Private</span>}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            {isExpanded ? ui('close', lang) : ui('viewDetails', lang)}
          </button>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          {isExpanded && <ProjectDetail project={project} />}
        </div>
      </div>
    </div>
  )
}
