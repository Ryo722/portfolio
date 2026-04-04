import { useMemo } from 'react'
import { skills } from '../../data/skills'
import { projects } from '../../data/projects'
import { useLang, t } from '../../hooks/useLang'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'
import { SkillBadge } from '../ui/SkillBadge'

/** Count how many projects use each skill (case-insensitive match on techStack) */
function buildSkillProjectCounts(projectList: typeof projects): Map<string, number> {
  const counts = new Map<string, number>()
  for (const project of projectList) {
    for (const tech of project.techStack) {
      const key = tech.toLowerCase()
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  return counts
}

export function Skills() {
  const { lang } = useLang()

  const { skillCounts, maxCount } = useMemo(() => {
    const counts = buildSkillProjectCounts(projects)
    let max = 0
    for (const v of counts.values()) {
      if (v > max) max = v
    }
    return { skillCounts: counts, maxCount: max }
  }, [])

  return (
    <section id="skills" className="py-20 px-6 border-t border-[var(--color-border)]/50">
      <FadeInOnScroll>
        <SectionHeading>Skills</SectionHeading>
      </FadeInOnScroll>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {skills.map((category, index) => (
            <FadeInOnScroll key={category.name.ja} delay={index * 100}>
              <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-md p-5 transition-all duration-300 hover:border-[var(--color-accent)]/40" style={{ boxShadow: 'var(--shadow-card)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)' }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-faint)] mb-2">
                  <span className="text-[var(--color-accent)] mr-2">EQUIP</span>
                  {t(category.name, lang)}
                  <span className="ml-2 text-[var(--color-text-faint)]">Lv.{String(category.skills.length).padStart(2, '0')}</span>
                </h3>
                {category.evidence && (
                  <p className="text-xs text-[var(--color-accent)] mb-3 leading-relaxed">
                    {t(category.evidence, lang)}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <SkillBadge
                      key={skill}
                      name={skill}
                      projectCount={skillCounts.get(skill.toLowerCase()) ?? 0}
                      maxProjectCount={maxCount}
                    />
                  ))}
                </div>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
    </section>
  )
}
