import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// ops/backlog/current.md の acceptance criteria テスト
// 参照: .takt/runs/20260506-043553-ops-backlog-current-md-2026-05/context/task/order.md §7

function readCurrentMd(): string {
  return readFileSync(resolve('ops/backlog/current.md'), 'utf-8')
}

describe('ops/backlog/current.md — 見出し', () => {
  it('見出しが "# Current — 2026-05-06 最終状態" になっている', () => {
    const content = readCurrentMd()
    expect(content).toMatch(/^# Current — 2026-05-06 最終状態/)
  })
})

describe('ops/backlog/current.md — 期別セクション構造', () => {
  it('2026-04 完了セクションが存在する', () => {
    const content = readCurrentMd()
    expect(content).toMatch(/2026-04/)
  })

  it('2026-05 完了セクションが存在する', () => {
    const content = readCurrentMd()
    expect(content).toMatch(/2026-05/)
  })

  it('時系列順（2026-03 → 2026-04 → 2026-05）でセクションが並んでいる', () => {
    const content = readCurrentMd()
    // 見出し行（1行目）には "2026-05-06" が含まれ indexOf('2026-05') が
    // 本文セクションより先にマッチするため、本文部分（2行目以降）で検索する
    const body = content.slice(content.indexOf('\n') + 1)
    const idx03 = body.indexOf('2026-03')
    const idx04 = body.indexOf('2026-04')
    const idx05 = body.indexOf('2026-05')
    expect(idx03, '2026-03 が見つからない').toBeGreaterThanOrEqual(0)
    expect(idx04, '2026-04 が見つからない').toBeGreaterThanOrEqual(0)
    expect(idx05, '2026-05 が見つからない').toBeGreaterThanOrEqual(0)
    expect(idx03).toBeLessThan(idx04)
    expect(idx04).toBeLessThan(idx05)
  })
})

describe('ops/backlog/current.md — 2026-04 完了事項', () => {
  it('「100本ノック refactor 完了」が含まれる', () => {
    const content = readCurrentMd()
    expect(content).toMatch(/100本ノック|100 本ノック/)
    expect(content).toMatch(/refactor|リファクタ/)
  })

  it('「依存脆弱性修正」が含まれる', () => {
    const content = readCurrentMd()
    expect(content).toMatch(/依存脆弱性|脆弱性修正/)
  })
})

describe('ops/backlog/current.md — 2026-05 完了事項', () => {
  it('「YouTube 期間別ソーター v1.0.0 Chrome ストア公開」が含まれる', () => {
    const content = readCurrentMd()
    expect(content).toMatch(/YouTube/)
    expect(content).toMatch(/Chrome/)
    expect(content).toMatch(/v1\.0\.0|v1\.0/)
  })

  it('「Takt CLI onboarding（公式 CLI 統合）」が含まれる', () => {
    const content = readCurrentMd()
    expect(content).toMatch(/Takt/)
    expect(content).toMatch(/onboarding|CLI/)
  })
})

describe('ops/backlog/current.md — 残り backlog の保持', () => {
  const originalBacklogItems = [
    { keyword: 'BL-B', description: '残り6件の実スクリーンショット' },
    { keyword: 'BL-D', description: 'URL構造実装' },
    { keyword: 'DuelMasters Plays', description: 'DuelMasters Playsデモ動画作成' },
    { keyword: 'OSSコントリビュートPR', description: 'OSSコントリビュートPRのマージ追跡' },
  ]

  for (const { keyword, description } of originalBacklogItems) {
    it(`backlog 項目「${description}」が削除されていない（キーワード: "${keyword}"）`, () => {
      const content = readCurrentMd()
      expect(content, `"${keyword}" が見つからない — 削除された可能性がある`).toContain(keyword)
    })
  }
})

describe('ops/backlog/current.md — 既存完了タスクの保持', () => {
  const preservedItems = [
    'ポートフォリオMVP構築',
    'プロジェクト9件',
    'ポートフォリオOS',
    'ブログ制作OS',
    'Vitest',
    'OSSコントリビュート',
  ]

  for (const keyword of preservedItems) {
    it(`既存完了項目「${keyword}」が保持されている`, () => {
      const content = readCurrentMd()
      expect(content, `"${keyword}" が削除されている`).toContain(keyword)
    })
  }
})

describe('ops/backlog/current.md — markdown フォーマット', () => {
  it('完了タスクに - [x] 形式が使われている', () => {
    const content = readCurrentMd()
    expect(content).toMatch(/^- \[x\]/m)
  })

  it('未完了タスクに - [ ] 形式が使われている', () => {
    const content = readCurrentMd()
    expect(content).toMatch(/^- \[ \]/m)
  })

  it('ファイルが # で始まる（H1見出し）', () => {
    const content = readCurrentMd()
    const firstLine = content.split('\n')[0]
    expect(firstLine).toMatch(/^# /)
  })

  it('セクション見出しに ## が使われている', () => {
    const content = readCurrentMd()
    expect(content).toMatch(/^## /m)
  })
})

describe('ops/backlog/current.md — 行数範囲', () => {
  it('行数が適切な範囲（32〜47行）にある', () => {
    // 元: 22行 / 増分: +10〜+25行（order.md §7）→ 32〜47行
    const content = readCurrentMd()
    // 末尾の空行を除外した実質行数
    const lines = content.split('\n')
    const nonEmptyTail = lines.at(-1) === '' ? lines.length - 1 : lines.length
    expect(nonEmptyTail, `行数が範囲外: ${nonEmptyTail}行（期待: 32〜47行）`).toBeGreaterThanOrEqual(32)
    expect(nonEmptyTail, `行数が範囲外: ${nonEmptyTail}行（期待: 32〜47行）`).toBeLessThanOrEqual(47)
  })
})
