# ADR-003: ブログURL構造の改善計画

**日付**: 2026-03-29
**ステータス**: 計画中（実施は条件成立後）

## 背景
現在のブログ記事はSPA内でMarkdownファイルをfetchしてレンダリングしている。URLは `#notes` のアンカーのみで、個別記事URLがない。検索エンジンがMarkdownを直接インデックスできず、SEOに不利。

## 現状
- 記事数: 9本
- 表示方式: Notes セクション内の展開式 + BlogArticle コンポーネント
- URL: `https://ryo722.github.io/portfolio/#notes`（全記事共通）
- ルーティング: React Router 未導入

## 目標URL設計
```
/portfolio/blog/{slug}
例: /portfolio/blog/building-game-engine
```

## 移行計画（3段階）

### Stage 1（現状 — 記事15本未満）
- 現在のSPA内レンダリングを維持
- 個別記事URLなし
- データ構造は slug ベースで管理済み

### Stage 2（記事15本到達時）
- React Router 導入（HashRouter → BrowserRouter）
- `/portfolio/blog/{slug}` でアクセス可能にする
- GitHub Pages の 404.html を SPA fallback として活用
- 既存の `#notes` アンカーとの互換性を維持

### Stage 3（長期 — SEO重視フェーズ）
- Next.js 移行 or Vite SSG プラグイン導入
- 各記事を静的HTMLとして生成
- OGP を記事ごとに設定
- sitemap.xml 生成

## 実施トリガー
- Stage 2: ブログ記事が15本以上に到達
- Stage 3: 検索流入が有意な割合を占めるようになった時

## GitHub Pages 制約
- サブパス (`/portfolio/`) でのホスティング
- `404.html` による SPA fallback が唯一のルーティング手段
- サーバーサイドリダイレクトは不可

## リスク
- URL変更時に既存ブックマーク・共有リンクが無効化する
- GitHub Pages の 404 ハンドリングが不安定な場合がある
- React Router 導入は SPA 全体に影響

## 準備済み事項
- slug ベースのデータ管理（`src/data/blog.ts`）
- 言語別ファイル構造（`public/blog/`, `public/blog/en/`）
- BlogArticle コンポーネントの独立性（フルスクリーン表示）
