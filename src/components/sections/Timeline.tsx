import { projects } from '../../data/projects'
import { useLang, t } from '../../hooks/useLang'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'
import type { Lang } from '../../types'

const sectionText = {
  heading: { ja: '冒険の記録', en: 'Adventure Log' },
  unknownYear: { ja: '----', en: '----' },
} as const

function getText(key: keyof typeof sectionText, lang: Lang): string {
  return lang === 'en' && sectionText[key].en
    ? sectionText[key].en
    : sectionText[key].ja
}

/**
 * scale フィールドの period キーから年を抽出する。
 * period 例: "2024", "2024.01", "2023-2024" → 先頭の4桁年を返す。
 * period がなければ null。
 */
function extractYear(scale?: Record<string, string>): string | null {
  if (!scale) return null
  const period = scale['period'] ?? scale['Period'] ?? scale['開発時期']
  if (!period) return null
  const match = period.match(/(\d{4})/)
  return match ? match[1] : null
}

interface TimelineEntry {
  year: string | null
  slug: string
  name: string
  category: string
}

function buildTimeline(lang: Lang): TimelineEntry[] {
  return projects.map((p) => ({
    year: extractYear(p.scale),
    slug: p.slug,
    name: t(p.name, lang),
    category: p.category,
  }))
}

/**
 * 年ごとにグルーピングし、年の降順で並べる。
 * 年不明のプロジェクトは末尾にまとめる。
 */
function groupByYear(entries: TimelineEntry[]): { year: string | null; items: TimelineEntry[] }[] {
  const yearMap = new Map<string | null, TimelineEntry[]>()

  for (const entry of entries) {
    const key = entry.year
    const existing = yearMap.get(key)
    if (existing) {
      existing.push(entry)
    } else {
      yearMap.set(key, [entry])
    }
  }

  const withYear: { year: string; items: TimelineEntry[] }[] = []
  const withoutYear: TimelineEntry[] = []

  for (const [year, items] of yearMap) {
    if (year) {
      withYear.push({ year, items })
    } else {
      withoutYear.push(...items)
    }
  }

  withYear.sort((a, b) => Number(b.year) - Number(a.year))

  const result: { year: string | null; items: TimelineEntry[] }[] = [...withYear]
  if (withoutYear.length > 0) {
    result.push({ year: null, items: withoutYear })
  }

  return result
}

export function Timeline() {
  const { lang } = useLang()
  const entries = buildTimeline(lang)
  const grouped = groupByYear(entries)
  const unknownLabel = getText('unknownYear', lang)

  return (
    <section
      id="timeline"
      className="py-20 px-6 bg-[var(--color-bg)] border-t border-[var(--color-border)]/50"
    >
      <FadeInOnScroll>
        <SectionHeading>{getText('heading', lang)}</SectionHeading>
        <div className="max-w-2xl mx-auto">
          {grouped.map((group) => {
            const yearLabel = group.year ?? unknownLabel
            return (
              <div key={yearLabel} className="mb-8 last:mb-0">
                {/* Year header */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-xl font-bold text-[var(--color-accent)] shrink-0">
                    {yearLabel}
                  </span>
                  <span
                    className="block flex-1 h-px bg-[var(--color-border)]"
                    aria-hidden="true"
                  />
                </div>
                {/* Projects in this year */}
                <div className="ml-2 border-l-2 border-[var(--color-border)]/60 pl-6 space-y-4">
                  {group.items.map((item) => (
                    <a
                      key={item.slug}
                      href={`#${item.slug}`}
                      className="block group"
                    >
                      <div className="relative">
                        {/* Dot on the timeline */}
                        <span
                          className="absolute -left-[1.9rem] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] border-2 border-[var(--color-bg)] group-hover:scale-125 transition-transform"
                          aria-hidden="true"
                        />
                        <p className="font-mono text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                          {item.name}
                        </p>
                        <p className="font-mono text-xs text-[var(--color-text-muted)] mt-0.5">
                          {item.category}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </FadeInOnScroll>
    </section>
  )
}
