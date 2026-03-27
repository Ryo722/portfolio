import { profile } from '../../data/profile'
import { useLang } from '../../hooks/useLang'
import { ui } from '../../data/ui-text'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'

export function Contact() {
  const { lang } = useLang()

  return (
    <section id="contact" className="py-20 px-6 bg-slate-100/50 dark:bg-slate-800/30">
      <FadeInOnScroll>
        <SectionHeading>Contact</SectionHeading>
        <div className="max-w-md mx-auto text-center space-y-4">
          <p className="text-slate-500 dark:text-slate-400">
            {ui('contactMessage', lang)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-sky-400 hover:text-sky-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-sky-400 hover:text-sky-400 transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  )
}
