import { useMemo, useState } from 'react'
import { projects } from '../../data/projects'
import { useLang } from '../../hooks/useLang'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'
import { ProjectCard } from '../ui/ProjectCard'

type FilterType = 'category' | 'tech'

const ALL_KEY = 'ALL'

/** プロジェクト一覧からユニークなカテゴリを抽出 */
function extractCategories(source: typeof projects): string[] {
  const set = new Set<string>()
  for (const p of source) {
    set.add(p.category)
  }
  return Array.from(set)
}

/** プロジェクト一覧からユニークなtechStackを抽出 */
function extractTechStacks(source: typeof projects): string[] {
  const map = new Map<string, number>()
  for (const p of source) {
    for (const t of p.techStack) {
      map.set(t, (map.get(t) ?? 0) + 1)
    }
  }
  // 2プロジェクト以上で使われている技術のみ表示（フィルタの実用性のため）
  return Array.from(map.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([tech]) => tech)
}

interface FilterButtonProps {
  label: string
  active: boolean
  onClick: () => void
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-xs px-2 py-1 border transition-colors duration-150 cursor-pointer ${
        active
          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]'
      }`}
    >
      [{label}]
    </button>
  )
}

interface FilterTabProps {
  label: string
  active: boolean
  onClick: () => void
}

function FilterTab({ label, active, onClick }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-xs px-2 py-1 transition-colors duration-150 cursor-pointer ${
        active
          ? 'text-[var(--color-accent)] border-b border-[var(--color-accent)]'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
      }`}
    >
      {label}
    </button>
  )
}

export function Projects() {
  const { lang } = useLang()
  const otherProjects = useMemo(() => projects.filter((p) => !p.featured), [])

  const [filterType, setFilterType] = useState<FilterType>('category')
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_KEY)
  const [selectedTech, setSelectedTech] = useState<string>(ALL_KEY)

  const categories = useMemo(() => extractCategories(otherProjects), [otherProjects])
  const techStacks = useMemo(() => extractTechStacks(otherProjects), [otherProjects])

  const filteredProjects = useMemo(() => {
    if (filterType === 'category') {
      if (selectedCategory === ALL_KEY) return otherProjects
      return otherProjects.filter((p) => p.category === selectedCategory)
    }
    if (selectedTech === ALL_KEY) return otherProjects
    return otherProjects.filter((p) => p.techStack.includes(selectedTech))
  }, [otherProjects, filterType, selectedCategory, selectedTech])

  if (otherProjects.length === 0) return null

  const activeFilter = filterType === 'category' ? selectedCategory : selectedTech
  const filterOptions = filterType === 'category' ? categories : techStacks
  const setActiveFilter = filterType === 'category' ? setSelectedCategory : setSelectedTech

  return (
    <section id="all-projects" className="py-20 px-6 border-t border-[var(--color-border)]/50">
      <FadeInOnScroll>
        <SectionHeading>{lang === 'ja' ? 'Other Projects' : 'Other Projects'}</SectionHeading>
      </FadeInOnScroll>

      {/* Filter UI */}
      <div className="max-w-5xl mx-auto mb-6">
        {/* Filter type tabs */}
        <div className="flex gap-3 mb-3">
          <FilterTab
            label={lang === 'ja' ? 'CATEGORY' : 'CATEGORY'}
            active={filterType === 'category'}
            onClick={() => setFilterType('category')}
          />
          <FilterTab
            label={lang === 'ja' ? 'TECH' : 'TECH'}
            active={filterType === 'tech'}
            onClick={() => setFilterType('tech')}
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <FilterButton
            label={ALL_KEY}
            active={activeFilter === ALL_KEY}
            onClick={() => setActiveFilter(ALL_KEY)}
          />
          {filterOptions.map((option) => (
            <FilterButton
              key={option}
              label={option}
              active={activeFilter === option}
              onClick={() => setActiveFilter(option)}
            />
          ))}
        </div>

        {/* Result count */}
        <p className="font-mono text-xs text-[var(--color-text-faint)] mt-2">
          {filteredProjects.length} / {otherProjects.length} projects
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project, index) => (
          <FadeInOnScroll key={project.slug} delay={index * 80}>
            <ProjectCard project={project} slotIndex={index + 1} />
          </FadeInOnScroll>
        ))}
      </div>
    </section>
  )
}
