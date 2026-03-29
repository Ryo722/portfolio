import { profile } from '../../data/profile'
import { useLang, t } from '../../hooks/useLang'
import { useTheme } from '../../hooks/useTheme'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'

export function About() {
  const { lang } = useLang()
  const { theme } = useTheme()
  const statsTheme = theme === 'dark' ? 'github_dark' : 'default'

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
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <img
              src={`https://github-readme-stats.vercel.app/api?username=Ryo722&show_icons=true&theme=${statsTheme}&hide_border=true&bg_color=00000000&count_private=true&locale=${lang}`}
              alt="GitHub Stats"
              className="h-36"
              loading="lazy"
            />
            <img
              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=Ryo722&layout=compact&theme=${statsTheme}&hide_border=true&bg_color=00000000&langs_count=8&locale=${lang}`}
              alt="Top Languages"
              className="h-36"
              loading="lazy"
            />
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  )
}
