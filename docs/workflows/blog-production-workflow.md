# ブログ記事制作ワークフロー

## 概要
技術ブログ記事の企画から公開までの全フロー。
`blog-editor` エージェントが統括し、各フェーズで専門スキルに委任する。

## Phase 0: 企画

### Task 0-1: テーマ選定
- 入力: キーワードまたはプロジェクト名
- 実行: `blog-planner` スキル
- 出力: ブリーフ（テーマ、ペルソナ、構成案、キーメッセージ）

### Task 0-2: 人間承認
- ブリーフを提示し、方向性の承認を得る
- 承認されたら Phase 1 へ

**ゲート**: なし（企画段階は自由）

## Phase 1: 執筆

### Task 1-1: ドラフト執筆
- 入力: 承認済みブリーフ
- 実行: `blog-writer` スキル（`blog-voice` 自動適用）
- 出力: Markdown 記事ドラフト

### Task 1-2: 自己チェック
- `blog-voice` のDO/DON'Tに照合
- 技術的正確性の確認

**ゲート**: Brand Gate（`brand-guard` 自動適用）

## Phase 2: レビュー

### Task 2-1: 品質レビュー
- 実行: `blog-reviewer` スキル（5軸評価）
- 判定: PASS / REVISE / REWORK

### Task 2-2: ブランドチェック
- 実行: `brand-guard` スキル
- Task 2-1 と並列実行可

### Task 2-3: 修正（REVISE / REWORK の場合）
- REVISE: 軽微修正して Phase 3 へ
- REWORK: `blog-writer` で改稿 → Phase 2 に戻る
- 修正ループ上限: 2回

**ゲート**: QC Gate（`blog-reviewer` PASS + `brand-guard` PASS）

## Phase 3: 公開準備

### Task 3-1: データ登録
- 実行: `blog-publisher` スキル
- `src/data/blog.ts` に記事データ追加

### Task 3-2: 5ゲートチェック
- 実行: `deploy-checker` スキル
- Security / Performance / Accessibility / Brand / Deploy Readiness

### Task 3-3: 人間最終承認
- 全ゲート PASS を確認
- 記事内容の最終確認
- 公開タイミングの判断

**ゲート**: Deploy Readiness（人間確認必須）

## Phase 4: 公開 & 告知

### Task 4-1: デプロイ
- コミット → プッシュ → GitHub Actions
- 本番URLで表示確認

### Task 4-2: SNS告知（任意）
- 記事のフック抽出
- X/Threads 告知文生成

### Task 4-3: 記録
- `ops/logs/devlog/` にデプロイ記録
- `ops/reports/` にブログ記事一覧更新

## フロー図

```
[企画] → 人間承認 → [執筆] → Brand Gate
                           ↓
                    [レビュー(並列)]
                    reviewer ∥ brand-guard
                           ↓
                      QC Gate判定
                     ├─ PASS
                     ├─ REVISE → 軽微修正
                     └─ REWORK → 改稿(最大2回)
                           ↓
                    [公開準備]
                    5ゲートチェック
                           ↓
                    人間最終承認
                           ↓
                    [デプロイ & 告知]
```
