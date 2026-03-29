import { describe, it, expect } from 'vitest'
import { profile } from '../profile'

describe('profile データ整合性', () => {
  it('必須フィールドがある', () => {
    expect(profile.name).toBeTruthy()
    expect(profile.tagline.ja).toBeTruthy()
    expect(profile.about.ja).toBeTruthy()
    expect(profile.githubUrl).toBeTruthy()
    expect(profile.email).toBeTruthy()
  })

  it('GitHub URLが正しい形式', () => {
    expect(profile.githubUrl).toMatch(/^https:\/\/github\.com\//)
  })

  it('emailが正しい形式', () => {
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('多言語テキストにen版がある', () => {
    expect(profile.tagline.en, 'tagline.en missing').toBeTruthy()
    expect(profile.about.en, 'about.en missing').toBeTruthy()
  })
})
