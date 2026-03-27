import { profile } from '../../data/profile'
import { useLang, t } from '../../hooks/useLang'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'

export function About() {
  const { lang } = useLang()

  return (
    <section id="about" className="py-20 px-6 bg-slate-100/50 dark:bg-slate-800/30">
      <FadeInOnScroll>
        <SectionHeading>About</SectionHeading>
        <div className="max-w-3xl mx-auto">
          {t(profile.about, lang).split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  )
}
