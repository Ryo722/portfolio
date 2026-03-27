import type { Lang } from '../types'

const texts = {
  about: { ja: 'About', en: 'About' },
  skills: { ja: 'Skills', en: 'Skills' },
  projects: { ja: 'Projects', en: 'Projects' },
  contact: { ja: 'Contact', en: 'Contact' },
  notes: { ja: 'Notes', en: 'Notes' },
  featured: { ja: '代表作', en: 'Featured' },
  viewDetails: { ja: '詳細を見る', en: 'View Details' },
  close: { ja: '閉じる', en: 'Close' },
  highlights: { ja: '工夫した点', en: 'Highlights' },
  contactMessage: { ja: 'お仕事のご相談やご質問はお気軽にどうぞ。', en: 'Feel free to reach out for work inquiries or questions.' },
  notesDescription: { ja: '開発で学んだことや考えたことを書いています。', en: 'Writing about things I learned and thought about through development.' },
  comingSoon: { ja: '近日公開', en: 'Coming Soon' },
} as const

export function ui(key: keyof typeof texts, lang: Lang): string {
  return texts[key][lang]
}
