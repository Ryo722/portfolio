import { useState } from 'react'
import { profile } from '../../data/profile'
import { useLang } from '../../hooks/useLang'
import { ui } from '../../data/ui-text'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'

const contactCtas = [
  {
    label: { ja: '採用・転職に関するご連絡', en: 'Recruitment / career opportunities' },
    subject: { ja: '採用に関するご連絡', en: 'Recruitment inquiry' },
  },
  {
    label: { ja: '技術的な質問・相談', en: 'Technical question' },
    subject: { ja: '技術的なご質問・ご相談', en: 'Technical question / consultation' },
  },
  {
    label: { ja: 'その他のお問い合わせ', en: 'Other inquiries' },
    subject: { ja: 'お問い合わせ', en: 'General inquiry' },
  },
] as const

export function Contact() {
  const { lang } = useLang()
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section id="contact" className="py-20 px-6 bg-[var(--color-bg)] border-t border-[var(--color-border)]/50">
      <FadeInOnScroll>
        <SectionHeading>Contact</SectionHeading>
        <div className="max-w-md mx-auto text-center space-y-6">
          <p className="font-mono text-xs text-[var(--color-text-faint)] tracking-wider">
            — SAVE &amp; QUIT? —
          </p>
          <p className="text-[var(--color-text-muted)]">
            {ui('contactMessage', lang)}
          </p>

          {/* 目的別CTA */}
          <div className="space-y-2">
            {contactCtas.map((cta, i) => (
              <a
                key={i}
                href={`mailto:${profile.email}?subject=${encodeURIComponent(cta.subject[lang] ?? cta.subject.ja)}`}
                className="block w-full px-5 py-3 font-mono text-sm text-left bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)] rounded-md hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                <span className="text-[var(--color-text-faint)] mr-2">[{i + 1}]</span>
                {cta.label[lang] ?? cta.label.ja}
              </a>
            ))}
          </div>

          {/* GitHub + コピー */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)] rounded-md hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
            >
              GitHub
            </a>
            <button
              onClick={copyEmail}
              className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
            >
              {copied
                ? (lang === 'ja' ? 'コピーしました' : 'Copied!')
                : (lang === 'ja' ? 'メールアドレスをコピー' : 'Copy email address')}
            </button>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  )
}
