import { useState } from 'react'
import { useLang } from '../../hooks/useLang'
import { FadeInOnScroll } from '../common/FadeInOnScroll'
import { SectionHeading } from '../ui/SectionHeading'

const faqItems = [
  {
    q: { ja: 'フリーランスですか？', en: 'Are you a freelancer?' },
    a: { ja: 'いいえ、IT企業でシステムエンジニアとして勤務しています。ここに載せているプロダクトは業務外の個人開発です。', en: 'No, I work as a systems engineer at an IT company. The products shown here are personal projects built outside of work.' },
  },
  {
    q: { ja: 'どの言語が得意ですか？', en: 'What languages are you best at?' },
    a: { ja: 'TypeScript / React を中心に、必要に応じて技術を選びます。', en: 'Primarily TypeScript / React, choosing tools as needed for the task.' },
  },
  {
    q: { ja: 'チーム開発の経験はありますか？', en: 'Do you have team development experience?' },
    a: { ja: '本業でチーム開発に携わっています。個人開発ではAIをフル活用した一人開発が中心です。', en: 'I work in team development at my day job. Personal projects are mostly solo, fully leveraging AI.' },
  },
] as const

export function Faq() {
  const { lang } = useLang()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i))
  }

  return (
    <section id="faq" className="py-20 px-6 bg-[var(--color-surface)] border-t border-[var(--color-border)]/50">
      <FadeInOnScroll>
        <SectionHeading>FAQ</SectionHeading>
        <div className="max-w-2xl mx-auto space-y-2">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-md overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)]/40"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full px-5 py-4 text-left font-mono text-sm flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-[var(--color-accent)] shrink-0 select-none">
                    {isOpen ? '▸' : '▹'}
                  </span>
                  <span className="text-[var(--color-text)]">
                    {item.q[lang] ?? item.q.ja}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pl-12">
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {item.a[lang] ?? item.a.ja}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </FadeInOnScroll>
    </section>
  )
}
