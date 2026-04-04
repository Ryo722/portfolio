import { profile } from '../../data/profile'
import { useLang, t } from '../../hooks/useLang'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'

export function About() {
  const { lang } = useLang()

  return (
    <section id="about" className="py-20 px-6 bg-[var(--color-surface)] border-t border-[var(--color-border)]/50">
      <FadeInOnScroll>
        <SectionHeading>About</SectionHeading>
        <div className="max-w-3xl mx-auto">
          {t(profile.about, lang).split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-[var(--color-text-muted)] leading-relaxed mb-4 last:mb-0">
              <span className="font-mono text-[var(--color-accent)] mr-1.5 select-none">&gt;</span>
              {paragraph}
            </p>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  )
}
