import { useState } from 'react'
import type { Project } from '../../types'
import { useLang, t } from '../../hooks/useLang'
import { ui } from '../../data/ui-text'
import { ProjectDetail } from './ProjectDetail'

const categoryIcons: Record<string, string> = {
  'フルスタック / オンラインゲーム': '🎮',
  'Webアプリ / ツール': '🌐',
  'ブラウザゲーム': '🕹️',
  'AI × 金融': '📈',
  'AI × 自動化': '🤖',
  'インフラ / DevOps': '🏗️',
  '自動化 / フルスタック': '⚡',
  'ゲームツール': '🎲',
  '自動化 / CLI': '📝',
}

export function ProjectCard({ project, slotIndex }: { project: Project; slotIndex?: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { lang } = useLang()
  const detailId = `detail-${project.slug}`
  const slotNumber = slotIndex !== undefined ? String(slotIndex).padStart(2, '0') : null
  const icon = categoryIcons[project.category] ?? '📁'

  return (
    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)]/50 bg-[var(--color-card)]" style={{ boxShadow: 'var(--shadow-card)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)' }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}>
      {/* アクセントライン — グラデーション */}
      <div className="h-[2px] bg-gradient-to-r from-[var(--color-accent)]/60 via-[var(--color-sub-accent)]/40 to-transparent" />

      <div className="p-5">
        {/* スロット番号 + カテゴリアイコン + カテゴリ */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {slotNumber && (
              <span className="font-mono tracking-widest text-xs text-[var(--color-text-faint)] uppercase">
                SLOT {slotNumber}
              </span>
            )}
            <span className="text-xs" aria-hidden="true">{icon}</span>
          </div>
          <span className="font-mono text-xs text-[var(--color-text-faint)]">
            {project.category}
          </span>
        </div>

        {/* プロジェクト名 + サマリー */}
        <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">{t(project.name, lang)}</h3>
        <p className="text-[var(--color-text-muted)] text-sm mb-4 leading-relaxed line-clamp-2">{t(project.summary, lang)}</p>

        {/* TECH行 */}
        <div className="flex items-baseline gap-3 mb-3 text-xs">
          <span className="font-mono uppercase tracking-wider text-[var(--color-text-faint)] shrink-0">TECH</span>
          <span className="font-mono text-[var(--color-text-muted)] truncate">
            {project.techStack.slice(0, 5).join(' / ')}
            {project.techStack.length > 5 && ` +${project.techStack.length - 5}`}
          </span>
        </div>

        {/* STATUS行 + リンク */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono uppercase tracking-wider text-[var(--color-text-faint)]">STATUS</span>
            <span className="font-mono text-[var(--color-text-muted)]">
              {project.visibility === 'private' ? 'Private' : 'Public'}
            </span>
            {project.featured && (
              <span className="px-1.5 py-0.5 text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded font-mono">
                {ui('featured', lang)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors font-mono">
                ▶ GitHub
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors font-mono">
                ▶ Demo
              </a>
            )}
          </div>
        </div>

        {/* 詳細ボタン */}
        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls={detailId}
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer font-mono"
          >
            {isExpanded ? ui('close', lang) : ui('viewDetails', lang)}
          </button>
        </div>
      </div>

      <div id={detailId} className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          {isExpanded && <ProjectDetail project={project} />}
        </div>
      </div>
    </div>
  )
}
