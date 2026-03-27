import { createContext, useContext } from 'react'
import type { Lang, LocalizedText } from '../types'

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'ja',
  setLang: () => {},
})

export function useLang() {
  return useContext(LangContext)
}

/** LocalizedText から現在の言語のテキストを取得。en がなければ ja にフォールバック */
export function t(text: LocalizedText, lang: Lang): string {
  return (lang === 'en' && text.en) ? text.en : text.ja
}
