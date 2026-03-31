import { useState } from 'react'
import { useLang } from '../../hooks/useLang'
import { useTheme } from '../../hooks/useTheme'
import { ui } from '../../data/ui-text'

const navKeys = ['about', 'skills', 'projects', 'notes', 'contact'] as const

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { lang, setLang } = useLang()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 dark:bg-slate-900/80 bg-white/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" className="text-lg font-bold text-slate-900 dark:text-slate-50 hover:text-sky-400 transition-colors">
          Ryo722
        </a>

        {/* デスクトップナビ */}
        <div className="hidden sm:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navKeys.map((key) => (
              <li key={key}>
                <a
                  href={`#${key}`}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
                >
                  {ui(key, lang)}
                </a>
              </li>
            ))}
          </ul>

          {/* テーマ切替 */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors cursor-pointer"
            aria-label={lang === 'ja' ? 'テーマ切替' : 'Toggle theme'}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* 言語切替 */}
          <button
            onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
            className="text-xs font-mono px-2 py-1 border border-slate-300 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:border-sky-400 transition-colors cursor-pointer"
          >
            {lang === 'ja' ? 'EN' : 'JA'}
          </button>
        </div>

        {/* モバイル: テーマ + 言語 + ハンバーガー */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-500 dark:text-slate-400 cursor-pointer"
            aria-label={lang === 'ja' ? 'テーマ切替' : 'Toggle theme'}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
            className="text-xs font-mono px-2 py-1 border border-slate-300 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400 cursor-pointer"
          >
            {lang === 'ja' ? 'EN' : 'JA'}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col gap-1.5 p-2 cursor-pointer"
            aria-label={lang === 'ja' ? 'メニューを開く' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span className={`block w-5 h-0.5 bg-slate-600 dark:bg-slate-300 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-slate-600 dark:bg-slate-300 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-slate-600 dark:bg-slate-300 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* モバイルメニュー */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-72 border-t border-slate-200 dark:border-slate-800' : 'max-h-0'}`}>
        <ul className="flex flex-col py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          {navKeys.map((key) => (
            <li key={key}>
              <a
                href={`#${key}`}
                onClick={() => setIsOpen(false)}
                className="block px-6 py-3 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
              >
                {ui(key, lang)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
