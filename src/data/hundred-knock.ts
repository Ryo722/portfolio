import type { KnockCategory } from '../types'
import { projects } from './projects'

export type { KnockCategory }

export interface KnockProduct {
  id: number
  name: string
  category: KnockCategory
  date: string
  description: string
  url?: string
  portfolioSlug?: string
  techStack: string[]
}

export interface KnockChallenge {
  startDate: string
  targetDate: string
  goal: number
  products: KnockProduct[]
}

/**
 * ポートフォリオに掲載しない 100本ノック専用エントリ。
 * 通常の制作物は projects.ts に knock フィールドを付けるだけで自動カウントされる。
 */
export const extraKnockProducts: KnockProduct[] = []

const productsFromPortfolio: KnockProduct[] = projects
  .filter((p): p is typeof p & { knock: NonNullable<typeof p.knock> } => p.knock != null)
  .map((p) => ({
    id: p.knock.id,
    name: p.name.ja,
    category: p.knock.category,
    date: p.knock.date,
    description: p.summary.ja,
    url: p.demoUrl ?? undefined,
    portfolioSlug: p.slug,
    techStack: p.techStack,
  }))

export const knockChallenge: KnockChallenge = {
  startDate: '2026-03-01',
  targetDate: '2026-05-31',
  goal: 100,
  products: [...productsFromPortfolio, ...extraKnockProducts].sort((a, b) => a.id - b.id),
}
