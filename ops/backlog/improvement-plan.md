# 低優先度 改善計画

作成日: 2026-03-29

---

## #9 ESLint ルール強化

**現状**: `@eslint/js` recommended + `typescript-eslint` recommended
**目標**: より厳格なルールで潜在的な問題を検出

### 対応方針
1. `@typescript-eslint/strict` を試験導入
2. 既存コードで発生するエラー数を確認
3. 10件以下なら即修正して導入、10件超なら段階的に導入

### 着手条件
- テスト基盤が安定していること（Phase 2 完了済み）
- 大規模な機能追加がないタイミング

### 依存関係
- なし（独立して着手可能）

---

## #10 スクリーンショット収集

**現状**: 3/9 プロジェクトに画像あり（DuelMastersPlays, DMOriginalCardGenerator, EVPanel8）
**目標**: デモURL or ローカル起動可能なプロジェクトの画像を追加

### 対応方針
1. デモURLがあるプロジェクトから優先（public 3件は完了済み）
2. private プロジェクトはローカル起動してPlaywrightで撮影
3. 撮影後は幅800px以下にリサイズ
4. `content-manager` スキルのStep 3（画像撮影）を運用で徹底

### 着手条件
- 各プロジェクトがローカルで起動可能であること

### 依存関係
- 各プロジェクトの環境構築状態に依存

### 対象と優先順位
| プロジェクト | 方法 | 優先度 |
|---|---|---|
| M4FX | Streamlit UI をローカル起動 | 高 |
| SNS自動投稿 | Next.js 管理画面をローカル起動 | 中 |
| マルチエージェントOS | 概念図を作成 | 中 |
| ゼロトラスト自宅サーバー | 構成図を作成 | 中 |
| ポケカダメージ | Unity起動（環境依存大） | 低 |
| Notion日記自動化 | ターミナル出力のスクリーンショット | 低 |

---

## #11 portfolio-source 最新化

**現状**: `portfolio-source/` の中間成果物（projects.inventory.json等）が実装と乖離
**目標**: 実装のデータと一致した状態に同期

### 対応方針
1. `src/data/projects.ts` の内容を `portfolio-source/projects.inventory.json` に反映
2. `content-manager` スキルに「inventory同期」ステップを追加
3. プロジェクト追加/変更時に必ず同期する運用ルール

### 着手条件
- 次回のコンテンツ更新時

### 依存関係
- content-manager スキルの更新

---

## #12 ブログURL構造の改善

**現状**: `.md` ファイルへの直リンク。SPA内でfetchしてレンダリング
**課題**: SEOに不利（検索エンジンがMarkdownを正しくインデックスしない）

### 対応方針（3段階）

**Stage 1（現状維持）**: 現在の構成で運用。SPA内レンダリングは機能している
**Stage 2（中期）**: React Router 導入。`/blog/{slug}` のURL構造にする
**Stage 3（長期）**: Next.js 移行 or SSG導入。HTMLとして静的生成

### 着手条件
- Stage 2: ブログ記事が15件以上になり、検索流入を重視するタイミング
- Stage 3: サイト全体のリアーキテクチャ時

### 依存関係
- Stage 2: React Router の導入（SPA内ルーティング変更）
- Stage 3: ビルドツール変更の可能性

### リスク
- URL変更時はリダイレクト設計が必要
- GitHub Pages の 404 ハンドリング（SPA fallback）

---

## 優先順位サマリー

| # | 課題 | 次の着手タイミング |
|---|---|---|
| 10 | スクリーンショット | 次回プロジェクト更新時 |
| 9 | ESLint強化 | テスト安定後の空き時間 |
| 11 | portfolio-source | 次回コンテンツ更新時 |
| 12 | URL構造 | ブログ15記事以上 |
