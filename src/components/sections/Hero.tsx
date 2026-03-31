import { profile } from '../../data/profile'
import { useLang, t } from '../../hooks/useLang'

const stats = [
  { value: '152', label: { ja: 'エンジンモジュール', en: 'Engine Modules' } },
  { value: '1,565+', label: { ja: 'テストケース', en: 'Test Cases' } },
  { value: '11,000+', label: { ja: 'カード定義', en: 'Card Definitions' } },
] as const

export function Hero() {
  const { lang } = useLang()

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 pt-14 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <p className="text-sm font-mono text-sky-400 mb-4 tracking-wider">PORTFOLIO</p>
      <h1 className="text-5xl sm:text-7xl font-bold text-slate-900 dark:text-slate-50 mb-4">
        {profile.name}
      </h1>
      <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl text-center leading-relaxed mb-6">
        {t(profile.tagline, lang)}
      </p>

      {/* 代表実績の数値指標 */}
      <div className="flex items-center gap-6 sm:gap-10 mb-10">
        {stats.map((s) => (
          <div key={s.value} className="text-center">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-sky-400">{s.value}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t(s.label, lang)}</div>
          </div>
        ))}
      </div>

      {/* 分岐CTA */}
      <div className="flex items-center gap-4">
        <a
          href="#projects"
          className="px-6 py-2.5 bg-sky-400 text-slate-900 font-semibold rounded-lg hover:bg-sky-300 transition-colors"
        >
          {lang === 'ja' ? '代表実績を見る' : 'View Featured Work'}
        </a>
        <a
          href="#notes"
          className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:border-slate-500 dark:hover:border-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
        >
          {lang === 'ja' ? '技術ブログを読む' : 'Read Tech Blog'}
        </a>
      </div>

      <div className="absolute bottom-8 animate-bounce">
        <svg className="w-5 h-5 text-slate-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
