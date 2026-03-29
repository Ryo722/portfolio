import { describe, it, expect } from 'vitest'
import { skills } from '../skills'

describe('skills データ整合性', () => {
  it('スキルカテゴリが1件以上ある', () => {
    expect(skills.length).toBeGreaterThan(0)
  })

  it('全カテゴリに名前とスキルがある', () => {
    for (const category of skills) {
      expect(category.name.ja, 'category name.ja missing').toBeTruthy()
      expect(category.skills.length, `${category.name.ja}: skills empty`).toBeGreaterThan(0)
    }
  })

  it('スキル名が重複していない（カテゴリ横断）', () => {
    const allSkills = skills.flatMap((c) => c.skills)
    expect(new Set(allSkills).size).toBe(allSkills.length)
  })
})
