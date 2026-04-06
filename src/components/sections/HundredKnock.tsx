import { useState } from 'react'
import { knockChallenge } from '../../data/hundred-knock'
import type { KnockProduct } from '../../data/hundred-knock'
import { useLang } from '../../hooks/useLang'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'

const categoryLabels: Record<KnockProduct['category'], { ja: string; en: string; icon: string }> = {
  web: { ja: 'Web', en: 'Web', icon: '🌐' },
  cli: { ja: 'CLI', en: 'CLI', icon: '⌨️' },
  'chrome-ext': { ja: 'Chrome拡張', en: 'Chrome Ext', icon: '🧩' },
  game: { ja: 'ゲーム', en: 'Game', icon: '🎮' },
  other: { ja: 'その他', en: 'Other', icon: '📦' },
}

function getProgress(challenge: typeof knockChallenge) {
  const completed = challenge.products.length
  const percent = Math.round((completed / challenge.goal) * 100)

  const now = new Date()
  const target = new Date(challenge.targetDate)
  const start = new Date(challenge.startDate)
  const remainingDays = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  const remaining = challenge.goal - completed
  const requiredPace = remainingDays > 0 ? (remaining / remainingDays).toFixed(1) : '---'

  const elapsedDays = Math.max(1, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  const currentPace = (completed / elapsedDays).toFixed(1)

  return { completed, percent, remainingDays, requiredPace, currentPace }
}

function getCategoryBreakdown(products: KnockProduct[]) {
  const counts: Partial<Record<KnockProduct['category'], number>> = {}
  for (const p of products) {
    counts[p.category] = (counts[p.category] || 0) + 1
  }
  return counts
}

function getRecentProducts(products: KnockProduct[], count: number): KnockProduct[] {
  return [...products].sort((a, b) => b.date.localeCompare(a.date)).slice(0, count)
}

export function HundredKnock() {
  const { lang } = useLang()
  const [showAll, setShowAll] = useState(false)

  const { completed, percent, remainingDays, requiredPace, currentPace } = getProgress(knockChallenge)
  const categoryBreakdown = getCategoryBreakdown(knockChallenge.products)
  const recentProducts = getRecentProducts(knockChallenge.products, 5)

  const allProductsSorted = [...knockChallenge.products].sort((a, b) => a.id - b.id)

  return (
    <section
      id="hundred-knock"
      className="py-20 px-6 border-t border-[var(--color-border)]/50"
    >
      <FadeInOnScroll>
        <SectionHeading>
          {lang === 'ja' ? '100本ノック' : '100 Products Challenge'}
        </SectionHeading>
      </FadeInOnScroll>

      <div className="max-w-3xl mx-auto">
        {/* Main Counter */}
        <FadeInOnScroll>
          <div className="text-center mb-8">
            <p className="text-xs font-mono text-[var(--color-text-faint)] mb-2 tracking-wider uppercase">
              {lang === 'ja' ? 'プロダクト100本ノック' : '100 Products Challenge'}
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl sm:text-7xl font-bold font-mono text-[var(--color-accent)]">
                {completed}
              </span>
              <span className="text-2xl sm:text-3xl font-mono text-[var(--color-text-faint)]">
                / {knockChallenge.goal}
              </span>
            </div>

            {/* Progress Bar - RPG EXP bar style */}
            <div className="mt-4 mx-auto max-w-md">
              <div className="h-3 rounded-full bg-[var(--color-border)]/50 overflow-hidden border border-[var(--color-border)]">
                <div
                  className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-1000 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs font-mono text-[var(--color-text-faint)]">EXP</span>
                <span className="text-xs font-mono text-[var(--color-accent)] font-bold">{percent}%</span>
              </div>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Pace Stats */}
        <FadeInOnScroll delay={100}>
          <div className="border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] p-5 mb-6" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-xs font-mono text-[var(--color-text-faint)] mb-3 tracking-wider uppercase">
              {lang === 'ja' ? 'ペース' : 'Pace'}
            </h3>
            <div className="space-y-2">
              <div className="flex items-baseline font-mono text-sm">
                <span className="text-[var(--color-text-muted)] shrink-0">
                  {lang === 'ja' ? '残り日数' : 'Days Left'}
                </span>
                <span className="flex-1 mx-2 border-b border-dotted border-[var(--color-border)]" />
                <span className="text-[var(--color-accent)] font-bold shrink-0">
                  {remainingDays} {lang === 'ja' ? '日' : 'days'}
                </span>
              </div>
              <div className="flex items-baseline font-mono text-sm">
                <span className="text-[var(--color-text-muted)] shrink-0">
                  {lang === 'ja' ? '必要ペース' : 'Required Pace'}
                </span>
                <span className="flex-1 mx-2 border-b border-dotted border-[var(--color-border)]" />
                <span className="text-[var(--color-accent)] font-bold shrink-0">
                  {requiredPace} {lang === 'ja' ? '本/日' : '/day'}
                </span>
              </div>
              <div className="flex items-baseline font-mono text-sm">
                <span className="text-[var(--color-text-muted)] shrink-0">
                  {lang === 'ja' ? '現在のペース' : 'Current Pace'}
                </span>
                <span className="flex-1 mx-2 border-b border-dotted border-[var(--color-border)]" />
                <span className="text-[var(--color-accent)] font-bold shrink-0">
                  {currentPace} {lang === 'ja' ? '本/日' : '/day'}
                </span>
              </div>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Category Breakdown */}
        <FadeInOnScroll delay={200}>
          <div className="border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] p-5 mb-6" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-xs font-mono text-[var(--color-text-faint)] mb-3 tracking-wider uppercase">
              {lang === 'ja' ? 'カテゴリ別' : 'By Category'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {(Object.keys(categoryLabels) as KnockProduct['category'][]).map((cat) => {
                const count = categoryBreakdown[cat] || 0
                if (count === 0) return null
                const label = categoryLabels[cat]
                return (
                  <div
                    key={cat}
                    className="flex items-center gap-1.5 text-sm font-mono text-[var(--color-text-muted)]"
                  >
                    <span aria-hidden="true">{label.icon}</span>
                    <span>{lang === 'ja' ? label.ja : label.en}</span>
                    <span className="text-[var(--color-accent)] font-bold">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </FadeInOnScroll>

        {/* Recent Products */}
        <FadeInOnScroll delay={300}>
          <div className="border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] p-5 mb-6" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-xs font-mono text-[var(--color-text-faint)] mb-3 tracking-wider uppercase">
              {lang === 'ja' ? '最近の完成プロダクト' : 'Recent Products'}
            </h3>
            <div className="space-y-2.5">
              {recentProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 text-sm">
                  <span className="text-[var(--color-text-faint)] font-mono w-6 text-right shrink-0">
                    #{p.id}
                  </span>
                  <span className="text-[var(--color-text)]">
                    {p.portfolioSlug && <span className="text-[var(--color-accent)] mr-1" title={lang === 'ja' ? 'ポートフォリオ掲載' : 'Featured in Portfolio'}>★</span>}
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--color-accent)] transition-colors"
                      >
                        {p.name}
                      </a>
                    ) : (
                      p.name
                    )}
                  </span>
                  <span className="flex-1 mx-1 border-b border-dotted border-[var(--color-border)]" />
                  <span className="text-xs font-mono text-[var(--color-text-faint)] shrink-0">{p.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeInOnScroll>

        {/* All Products List (expandable) */}
        <FadeInOnScroll delay={400}>
          <div className="text-center mb-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-mono text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors border border-[var(--color-accent)]/30 rounded px-4 py-2 hover:border-[var(--color-accent)]/60"
            >
              {showAll
                ? (lang === 'ja' ? '▲ 一覧を閉じる' : '▲ Collapse List')
                : (lang === 'ja' ? '▼ 全プロダクト一覧' : '▼ View All Products')
              }
            </button>
          </div>

          {showAll && (
            <div className="border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
              {/* Table header */}
              <div className="grid grid-cols-[2.5rem_1fr_5rem_5rem] sm:grid-cols-[2.5rem_1fr_6rem_5rem_1fr] gap-2 px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <span className="text-xs font-mono text-[var(--color-text-faint)]">#</span>
                <span className="text-xs font-mono text-[var(--color-text-faint)]">
                  {lang === 'ja' ? '名前' : 'Name'}
                </span>
                <span className="hidden sm:block text-xs font-mono text-[var(--color-text-faint)]">
                  {lang === 'ja' ? 'カテゴリ' : 'Category'}
                </span>
                <span className="text-xs font-mono text-[var(--color-text-faint)]">
                  {lang === 'ja' ? '日付' : 'Date'}
                </span>
                <span className="text-xs font-mono text-[var(--color-text-faint)]">
                  {lang === 'ja' ? '技術スタック' : 'Tech Stack'}
                </span>
              </div>

              {/* Table body */}
              {allProductsSorted.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[2.5rem_1fr_5rem_5rem] sm:grid-cols-[2.5rem_1fr_6rem_5rem_1fr] gap-2 px-4 py-2.5 border-b border-[var(--color-border)]/50 last:border-b-0 hover:bg-[var(--color-surface)]/50 transition-colors"
                >
                  <span className="text-sm font-mono text-[var(--color-text-faint)]">{p.id}</span>
                  <span className="text-sm text-[var(--color-text)] truncate">
                    {p.portfolioSlug && <span className="text-[var(--color-accent)] mr-1" title={lang === 'ja' ? 'ポートフォリオ掲載' : 'Featured in Portfolio'}>★</span>}
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--color-accent)] transition-colors"
                      >
                        {p.name}
                      </a>
                    ) : (
                      p.name
                    )}
                  </span>
                  <span className="hidden sm:block text-xs font-mono text-[var(--color-text-muted)]">
                    {categoryLabels[p.category].icon} {lang === 'ja' ? categoryLabels[p.category].ja : categoryLabels[p.category].en}
                  </span>
                  <span className="text-xs font-mono text-[var(--color-text-faint)]">{p.date.slice(5)}</span>
                  <span className="text-xs text-[var(--color-text-muted)] truncate">
                    {p.techStack.map((t) => `[${t}]`).join(' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </FadeInOnScroll>
      </div>
    </section>
  )
}
