import { describe, it, expect } from 'vitest'
import { knockChallenge, extraKnockProducts } from '../hundred-knock'
import { projects } from '../projects'

describe('hundred-knock 整合性', () => {
  it('products 配列が空でない', () => {
    expect(knockChallenge.products.length).toBeGreaterThan(0)
  })

  it('id が重複していない', () => {
    const ids = knockChallenge.products.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('id が 1 から始まる連番である（欠番なし）', () => {
    const ids = knockChallenge.products.map((p) => p.id).sort((a, b) => a - b)
    ids.forEach((id, idx) => {
      expect(id, `expected id=${idx + 1} at index ${idx}`).toBe(idx + 1)
    })
  })

  it('date が YYYY-MM-DD 形式である', () => {
    for (const p of knockChallenge.products) {
      expect(p.date, `id=${p.id}: invalid date "${p.date}"`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('id が startDate 順に並んでいる', () => {
    const sorted = [...knockChallenge.products].sort((a, b) => a.id - b.id)
    expect(knockChallenge.products).toEqual(sorted)
  })

  it('portfolioSlug が指定されている場合、実在する project を参照している', () => {
    const projectSlugs = new Set(projects.map((p) => p.slug))
    for (const p of knockChallenge.products) {
      if (p.portfolioSlug) {
        expect(projectSlugs.has(p.portfolioSlug), `id=${p.id}: portfolioSlug "${p.portfolioSlug}" が projects に存在しない`).toBe(true)
      }
    }
  })

  it('projects.ts の knock フィールドが knockChallenge に反映されている', () => {
    const knockedProjects = projects.filter((p) => p.knock != null)
    for (const p of knockedProjects) {
      const found = knockChallenge.products.find((kp) => kp.id === p.knock?.id)
      expect(found, `project "${p.slug}" の knock.id=${p.knock?.id} が knockChallenge に見当たらない`).toBeDefined()
      expect(found?.portfolioSlug).toBe(p.slug)
    }
  })

  it('extraKnockProducts と projects.knock の id が衝突しない', () => {
    const projectKnockIds = new Set(projects.filter((p) => p.knock).map((p) => p.knock!.id))
    for (const extra of extraKnockProducts) {
      expect(projectKnockIds.has(extra.id), `extraKnockProducts id=${extra.id} が projects.knock と衝突`).toBe(false)
    }
  })

  it('進捗が goal を超えない', () => {
    expect(knockChallenge.products.length).toBeLessThanOrEqual(knockChallenge.goal)
  })
})
