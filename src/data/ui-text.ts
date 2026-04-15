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
  designDecisions: { ja: '設計判断', en: 'Design Decisions' },
  relatedArticle: { ja: '関連記事', en: 'Related Article' },
  relatedProject: { ja: '関連プロジェクト', en: 'Related Project' },
  contactMessage: { ja: 'ご興味をお持ちいただけましたら、お気軽にご連絡ください。', en: 'If anything here caught your interest, feel free to reach out.' },
  notesDescription: { ja: '開発で学んだことや考えたことを書いています。', en: 'Writing about things I learned and thought about through development.' },
  comingSoon: { ja: '近日公開', en: 'Coming Soon' },
  category: { ja: 'カテゴリ', en: 'Category' },
  visibility: { ja: '公開状態', en: 'Visibility' },
  visibilityPublic: { ja: '公開', en: 'Public' },
  visibilityPrivate: { ja: '非公開', en: 'Private' },
  toggleTheme: { ja: 'テーマ切替', en: 'Toggle theme' },
  switchLang: { ja: '言語を切り替え', en: 'Switch language' },
  openMenu: { ja: 'メニューを開く', en: 'Open menu' },
} as const

export function ui(key: keyof typeof texts, lang: Lang): string {
  return texts[key][lang]
}
