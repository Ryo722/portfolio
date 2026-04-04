import { profile } from '../../data/profile'
import { useLang, t } from '../../hooks/useLang'

const stats = [
  { value: '152', label: { ja: 'エンジンモジュール', en: 'Engine Modules' }, icon: '⚙️' },
  { value: '1,565+', label: { ja: 'テストケース', en: 'Test Cases' }, icon: '✓' },
  { value: '11,000+', label: { ja: 'カード定義', en: 'Card Definitions' }, icon: '♦' },
] as const

export function Hero() {
  const { lang } = useLang()

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 pt-14 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--color-sub-accent)]/5 rounded-full blur-3xl" />
      </div>

      <p className="text-sm font-mono text-[var(--color-accent)] mb-4 tracking-wider">PORTFOLIO</p>
      <h1 className="text-5xl sm:text-7xl font-bold text-[var(--color-text)] mb-4">
        {profile.name}
      </h1>
      <p className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-2xl text-center leading-relaxed mb-6">
        {t(profile.tagline, lang)}
      </p>

      {/* 代表実績の数値指標 — セーブデータのステータス表示風 */}
      <div className="w-full max-w-sm mb-10">
        {stats.map((s) => (
          <div key={s.value} className="flex items-center justify-between py-2.5 border-b border-[var(--color-border)] last:border-b-0">
            <span className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)]">
              <span className="text-[var(--color-sub-accent)] text-sm" aria-hidden="true">{s.icon}</span>
              {t(s.label, lang)}
            </span>
            <span className="text-sm font-bold font-mono text-[var(--color-accent)]">{s.value}</span>
          </div>
        ))}
      </div>

      {/* 分岐CTA */}
      <div className="flex items-center gap-4">
        <a
          href="#projects"
          className="px-6 py-2.5 bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold rounded-md hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          {lang === 'ja' ? '代表実績を見る' : 'View Featured Work'}
        </a>
        <a
          href="#notes"
          className="px-6 py-2.5 border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-md hover:border-[var(--color-accent)] hover:text-[var(--color-text)] transition-colors"
        >
          {lang === 'ja' ? '技術ブログを読む' : 'Read Tech Blog'}
        </a>
      </div>

      <div className="absolute bottom-8 animate-bounce">
        <svg className="w-5 h-5 text-[var(--color-text-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
