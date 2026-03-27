import { skills } from '../../data/skills'
import { useLang, t } from '../../hooks/useLang'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'
import { SkillBadge } from '../ui/SkillBadge'

export function Skills() {
  const { lang } = useLang()

  return (
    <section id="skills" className="py-20 px-6">
      <FadeInOnScroll>
        <SectionHeading>Skills</SectionHeading>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {skills.map((category) => (
            <div key={category.name.ja} className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">{t(category.name, lang)}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <SkillBadge key={skill} name={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  )
}
