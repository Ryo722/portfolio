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

describe('profile 魂定義要件', () => {
  describe('tagline — 人間味のある表現', () => {
    it('tagline(ja)が技術スペック羅列ではなく人間味がある', () => {
      const tagline = profile.tagline.ja
      // 技術スペック羅列パターン（「A / B / C を軸に〜する開発者」のような定型）ではないこと
      // 人間味 = 価値観・姿勢・WHYが含まれること
      const techSpecPattern = /^(React|TypeScript|Next\.js|Vue|Node).*開発者[。.]?$/
      expect(tagline).not.toMatch(techSpecPattern)
    })

    it('tagline(en)が技術スペック羅列ではなく人間味がある', () => {
      const tagline = profile.tagline.en!
      const techSpecPattern = /^(Full-stack|Frontend|Backend) developer (building|focused on|specializing)/
      expect(tagline).not.toMatch(techSpecPattern)
    })
  })

  describe('about — 複数段落の構造', () => {
    it('about(ja)が複数段落（\\n\\n 区切り）を持つ', () => {
      const paragraphs = profile.about.ja.split('\n\n')
      expect(paragraphs.length).toBeGreaterThanOrEqual(2)
    })

    it('about(en)が複数段落（\\n\\n 区切り）を持つ', () => {
      const paragraphs = profile.about.en!.split('\n\n')
      expect(paragraphs.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('about — 「作り手の人間性」が見える内容', () => {
    it('about(ja)に原点・きっかけに関する内容がある', () => {
      const about = profile.about.ja
      // 原点・きっかけ・出発点を示す表現のいずれかが含まれること
      const originPatterns = [
        /原点/, /きっかけ/, /始め/, /出会/, /惹かれ/, /好き/, /夢中/, /楽し/, /面白/,
        /子ども/, /学生/, /最初/, /初めて/,
      ]
      const hasOrigin = originPatterns.some((p) => p.test(about))
      expect(hasOrigin, 'about(ja)に原点・きっかけを示す表現がない').toBe(true)
    })

    it('about(ja)に正直さ・誠実さに関する内容がある', () => {
      const about = profile.about.ja
      // 正直さ・誠実さ・透明性を示す表現のいずれかが含まれること
      const honestyPatterns = [
        /正直/, /誠実/, /素直/, /向き合/, /ごまかさ/, /真摯/, /丁寧/, /嘘/,
        /本音/, /率直/, /飾らな/,
      ]
      const hasHonesty = honestyPatterns.some((p) => p.test(about))
      expect(hasHonesty, 'about(ja)に正直さ・誠実さを示す表現がない').toBe(true)
    })

    it('about(ja)に信念・価値観に関する内容がある', () => {
      const about = profile.about.ja
      // 信念・価値観・こだわりを示す表現のいずれかが含まれること
      const beliefPatterns = [
        /信じ/, /信念/, /大切/, /こだわ/, /譲れ/, /貫/, /価値/, /使命/,
        /意味/, /理想/, /あるべき/, /べき/,
      ]
      const hasBelief = beliefPatterns.some((p) => p.test(about))
      expect(hasBelief, 'about(ja)に信念・価値観を示す表現がない').toBe(true)
    })

    it('about(en)にも人間性を示す内容がある', () => {
      const about = profile.about.en!
      // 英語版にも原点・正直さ・信念のいずれかに相当する表現があること
      const humanPatterns = [
        /passion/i, /believe/i, /honest/i, /care/i, /why/i, /love/i,
        /curious/i, /journey/i, /origin/i, /start/i, /value/i, /matter/i,
        /integrity/i, /genuine/i, /meaning/i, /purpose/i, /conviction/i,
      ]
      const hasHuman = humanPatterns.some((p) => p.test(about))
      expect(hasHuman, 'about(en)に人間性を示す表現がない').toBe(true)
    })
  })
})
