# コンテンツ更新ワークフロー

## 概要
プロジェクトの追加・更新・削除、プロフィール変更、ブログ記事追加のフロー。

## プロジェクト追加

### Phase 1: 調査
1. ローカルリポジトリまたはGitHubから情報収集
2. `portfolio-source/projects.inventory.json` に追記
3. 掲載可否を人間に確認

### Phase 2: データ追加
1. `src/data/projects.ts` にプロジェクトデータ追加
2. 日本語・英語の両方のテキストを記入
3. スクリーンショットがあれば `public/images/projects/` に配置（幅800px以下）

### Phase 3: チェック
1. Brand Gate: 技術的正確性、トーン一貫性
2. Security Gate: 秘密情報の混入なし
3. ビルド確認

### Phase 4: デプロイ
- デプロイワークフローに従う

## ブログ記事追加

### Phase 1: データ追加
1. `src/data/blog.ts` に記事データ追加
2. URL がある場合はリンクを設定、なければ Coming Soon

### Phase 2: チェック & デプロイ
- デプロイワークフローに従う
