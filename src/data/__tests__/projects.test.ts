import { describe, it, expect } from 'vitest'
import { projects } from '../projects'
import { profile } from '../profile'
import { blogPosts } from '../blog'
import { skills } from '../skills'
import { existsSync } from 'fs'
import { resolve } from 'path'

describe('projects データ整合性', () => {
  it('プロジェクトが1件以上ある', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it('slug が重複していない', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('全プロジェクトに必須フィールドがある', () => {
    for (const p of projects) {
      expect(p.slug, `slug missing`).toBeTruthy()
      expect(p.name.ja, `${p.slug}: name.ja missing`).toBeTruthy()
      expect(p.category, `${p.slug}: category missing`).toBeTruthy()
      expect(p.summary.ja, `${p.slug}: summary.ja missing`).toBeTruthy()
      expect(p.description.ja, `${p.slug}: description.ja missing`).toBeTruthy()
      expect(p.techStack.length, `${p.slug}: techStack empty`).toBeGreaterThan(0)
      expect(p.highlights.length, `${p.slug}: highlights empty`).toBeGreaterThan(0)
      expect(p.visibility, `${p.slug}: visibility missing`).toMatch(/^(public|private)$/)
    }
  })

  it('publicプロジェクトにはGitHub URLがある', () => {
    const publicProjects = projects.filter((p) => p.visibility === 'public')
    for (const p of publicProjects) {
      expect(p.githubUrl, `${p.slug}: public project missing githubUrl`).toBeTruthy()
    }
  })

  it('画像パスが指定されている場合、ファイルが存在する', () => {
    for (const p of projects) {
      if (p.image) {
        const imagePath = p.image.replace('/portfolio/', '')
        const fullPath = resolve('public', imagePath)
        expect(existsSync(fullPath), `${p.slug}: image not found at ${fullPath}`).toBe(true)
      }
    }
  })

  it('slug が URL-safe な文字列である', () => {
    for (const p of projects) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('profile と projects の代表実績数値が一致する', () => {
    const dmp = projects.find((p) => p.slug === 'duel-masters-plays')
    if (!dmp) return

    // profile.about に含まれるテスト数がprojectsのscaleと一致する
    const scaleTestCount = dmp.scale?.['テスト数']
    if (scaleTestCount) {
      // '1,565+' → '1,565' (表示形式のまま比較)
      const displayNum = scaleTestCount.replace(/\+$/, '')
      expect(
        profile.about.ja.includes(displayNum),
        `profile.about.ja にテスト数 "${displayNum}" が含まれていない (scale: ${scaleTestCount})`,
      ).toBe(true)
    }
  })

  it('featured プロジェクトが存在する', () => {
    const featured = projects.filter((p) => p.featured)
    expect(featured.length, 'featured プロジェクトが0件').toBeGreaterThan(0)
  })

  it('relatedNotes が実在するブログ記事の slug を参照している', () => {
    const blogSlugs = new Set(blogPosts.map((p) => p.slug))
    for (const p of projects) {
      if (p.relatedNotes) {
        for (const slug of p.relatedNotes) {
          expect(blogSlugs.has(slug), `${p.slug}: relatedNote "${slug}" がブログに存在しない`).toBe(true)
        }
      }
    }
  })

  it('skills の projectSlugs が実在するプロジェクトの slug を参照している', () => {
    const projectSlugs = new Set(projects.map((p) => p.slug))
    for (const cat of skills) {
      if (cat.projectSlugs) {
        for (const slug of cat.projectSlugs) {
          expect(projectSlugs.has(slug), `skill "${cat.name.ja}": projectSlug "${slug}" が存在しない`).toBe(true)
        }
      }
    }
  })
})

describe('projects description 品質（portfolio-soul準拠）', () => {
  it('全プロジェクトの description に ja と en の両方が存在する', () => {
    for (const p of projects) {
      expect(p.description.ja, `${p.slug}: description.ja が空`).toBeTruthy()
      expect(p.description.en, `${p.slug}: description.en が空`).toBeTruthy()
    }
  })

  it('description(ja) が十分な長さである（100字以上）', () => {
    for (const p of projects) {
      expect(
        p.description.ja.length,
        `${p.slug}: description.ja が短すぎる（${p.description.ja.length}字）`,
      ).toBeGreaterThanOrEqual(100)
    }
  })

  it('description(ja) に動機を示す表現が含まれる', () => {
    // portfolio-soul.md: 「なぜ作ったか」（個人的な動機）を盛り込む
    // 動機を示す表現パターン: 理由・きっかけ・目的・欲求・感情などが読み取れる表現
    const motivationPatterns = [
      /作りたかった/,
      /作りたい/,
      /欲し[いかった]/,
      /きっかけ/,
      /面白そう/,
      /楽し[いかっみ]/,
      /ワクワク/,
      /好き/,
      /ため[にの]/,
      /したくて/,
      /したかった/,
      /必要/,
      /困って/,
      /不便/,
      /もっと/,
      /自分[がのも]/,
      /思[いっ]/, // 「〜と思った」「〜思い立ち」
      /懐かし/,
      /復活/,
      /再構築/,
      /知りたかった/,
      /試したかった/,
      /挑戦/,
      /興味/,
      /動機/,
      /理由/,
      /原点/,
      /支援/,
      /解決/,
    ]

    for (const p of projects) {
      const hasMotivation = motivationPatterns.some((pattern) => pattern.test(p.description.ja))
      expect(
        hasMotivation,
        `${p.slug}: description.ja に動機を示す表現が見つからない。portfolio-soul.md では「なぜ作ったか」の記載が必要`,
      ).toBe(true)
    }
  })

  it('description(ja) が就活テンプレ表現を含まない', () => {
    // portfolio-soul.md の禁止表現リスト
    const forbiddenPatterns = [
      'イノベーションを推進',
      'ソリューションを提供',
      'シナジーを生む',
      'プロアクティブに',
      'パッションを持って',
      '幅広い経験を活かし',
    ]
    // 「〜に貢献したい」（具体性なし）も禁止だが、具体性がある場合はOKなので除外

    for (const p of projects) {
      for (const forbidden of forbiddenPatterns) {
        expect(
          p.description.ja.includes(forbidden),
          `${p.slug}: description.ja に禁止表現「${forbidden}」が含まれている`,
        ).toBe(false)
      }
    }
  })
})
