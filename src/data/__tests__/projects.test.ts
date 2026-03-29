import { describe, it, expect } from 'vitest'
import { projects } from '../projects'
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
})
