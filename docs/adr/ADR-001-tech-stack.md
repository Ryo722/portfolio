# ADR-001: 技術スタック選定

**日付**: 2026-03-27
**ステータス**: 承認済み

## 背景
GitHub Pages で公開するポートフォリオサイトの技術スタックを選定する。

## 選択肢
1. Vite + React + TypeScript + Tailwind CSS
2. Next.js + TypeScript + Tailwind CSS（静的出力）

## 決定
**Vite + React 19 + TypeScript + Tailwind CSS 4** を採用。

## 理由
- GitHub Pages との相性（`vite build` → そのままデプロイ）
- 設定の単純さ（next.config.js, basePath 設定不要）
- ビルドサイズの軽さ
- SSR/ISR 不要（静的コンテンツのみ）
- 将来 Next.js への移行も容易

## 結果
- Tailwind CSS v4 は `@tailwindcss/vite` プラグインで統一（`tailwind.config.ts` 不要）
- ダークモードは `@custom-variant dark` で class ベースに設定
