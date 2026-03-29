import { describe, it, expect } from 'vitest'
import { blogPosts } from '../blog'
import { existsSync } from 'fs'
import { resolve } from 'path'

describe('blog データ整合性', () => {
  it('ブログ記事が1件以上ある', () => {
    expect(blogPosts.length).toBeGreaterThan(0)
  })

  it('slug が重複していない', () => {
    const slugs = blogPosts.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('全記事に必須フィールドがある', () => {
    for (const post of blogPosts) {
      expect(post.slug, `slug missing`).toBeTruthy()
      expect(post.title.ja, `${post.slug}: title.ja missing`).toBeTruthy()
      expect(post.date, `${post.slug}: date missing`).toBeTruthy()
      expect(post.tags.length, `${post.slug}: tags empty`).toBeGreaterThan(0)
      expect(post.excerpt.ja, `${post.slug}: excerpt.ja missing`).toBeTruthy()
    }
  })

  it('日付が YYYY-MM-DD 形式である', () => {
    for (const post of blogPosts) {
      expect(post.date, `${post.slug}: invalid date format`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      const parsed = new Date(post.date)
      expect(parsed.toString(), `${post.slug}: invalid date value`).not.toBe('Invalid Date')
    }
  })

  it('URL が指定されている場合、ファイルが存在する', () => {
    for (const post of blogPosts) {
      if (post.url && post.url.startsWith('/portfolio/blog/')) {
        const filePath = post.url.replace('/portfolio/', '')
        const fullPath = resolve('public', filePath)
        expect(existsSync(fullPath), `${post.slug}: blog file not found at ${fullPath}`).toBe(true)
      }
    }
  })

  it('slug が URL-safe な文字列である', () => {
    for (const post of blogPosts) {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('タグが3個以上ある', () => {
    for (const post of blogPosts) {
      expect(post.tags.length, `${post.slug}: less than 3 tags`).toBeGreaterThanOrEqual(3)
    }
  })

  it('enUrl が指定されている場合、英語版ファイルが存在する', () => {
    for (const post of blogPosts) {
      if (post.enUrl && post.enUrl.startsWith('/portfolio/blog/en/')) {
        const filePath = post.enUrl.replace('/portfolio/', '')
        const fullPath = resolve('public', filePath)
        expect(existsSync(fullPath), `${post.slug}: English blog file not found at ${fullPath}`).toBe(true)
      }
    }
  })
})
