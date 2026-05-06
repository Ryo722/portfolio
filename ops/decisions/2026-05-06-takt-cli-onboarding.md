# Takt CLI Onboarding (Phase 1)

**Date**: 2026-05-06
**Status**: Decided
**Sprint**: workspace-wide Takt onboarding phase 1

## 背景

`~/claude-workspace/` 全体で公式 Takt CLI (`nrslib/takt`) の onboarding を進める方針が決定した（workspace 共通方針 A-1〜A-4）。第一弾 5 PJ の 1 件として本 PJ も対象。

詳細: `~/claude-workspace/docs/workspace-project-inventory.md`

## 決定

### 採用

- `.takt/config.yaml` を新規作成（`provider: claude-sdk` / `model: sonnet` / `workflow: frontend-mini`）
- `.takt/.gitignore` に `workflows/` 許可ルールを追加（公式 Takt CLI 用）
- `CLAUDE.md` に「Takt 統合運用」節を追記

### 不採用（既存体系を尊重）

- `tasks.json` の新規作成 → 既存 `ops/backlog/current.md` が role を担っている
- `decision-log.md` の新規作成 → 既存 `ops/decisions/` ディレクトリが role を担っている

### 既存コマンドとの使い分け

| 用途 | 使うもの |
|---|---|
| プロジェクト追加・ブログ作成・X 投稿 | 既存 `/add-project` / `/write-blog` / `/x-post` 等 |
| 大規模 refactor / 多段レビュー必要なコンテンツ | 公式 Takt CLI |

## 根拠

- workspace 共通の `tasks.json + decision-log.md` 構造を導入すると、既存 `ops/` 体系と二重管理になる
- 既存運用が確立しており、混乱を避けるため
- Takt は補完手段（既存コマンドの代替ではない）

## 影響

- `.takt/config.yaml` / `.gitignore` / `CLAUDE.md` の 3 ファイル変更
- 既存コマンド・スキル・5 ゲート品質モデルへの影響なし
- src/ ビルド出力への影響なし

## 参照

- `~/claude-workspace/docs/takt-workflow.md`
- `~/claude-workspace/docs/ai-development-workflow.md`
- `~/claude-workspace/docs/workspace-project-inventory.md`
