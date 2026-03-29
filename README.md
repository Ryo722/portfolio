# Ryo722 Portfolio

AIと一緒に、ゲームエンジンからインフラまでつくる開発者のポートフォリオサイト。

**公開URL**: https://ryo722.github.io/portfolio/

## 主な機能

- プロジェクト一覧（9件、展開式詳細）
- 技術ブログ（9記事、Markdownレンダリング）
- スキルセット（8カテゴリ）
- 日本語 / 英語切替
- ダークモード / ライトモード
- レスポンシブ対応

## 技術スタック

- **フレームワーク**: Vite + React 19 + TypeScript
- **スタイリング**: Tailwind CSS 4 (`@tailwindcss/vite`)
- **ブログ**: react-markdown + remark-gfm + rehype-highlight
- **テスト**: Vitest（データ整合性テスト20件）
- **デプロイ**: GitHub Pages + GitHub Actions
- **分析**: Plausible Analytics

## セットアップ

```bash
git clone git@github.com:Ryo722/portfolio.git
cd portfolio
npm ci
```

## 開発コマンド

```bash
npm run dev       # 開発サーバー起動
npm run build     # 本番ビルド（TypeScript型チェック含む）
npm test          # データ整合性テスト実行
npm run lint      # ESLint 実行
npm run preview   # ビルド結果のプレビュー
```

## デプロイ

`main` ブランチへの push で GitHub Actions が自動デプロイ。

```
push → npm test → npm run build → GitHub Pages
```

## ディレクトリ構成

```
├── CLAUDE.md                # プロジェクトポリシー（実行ルール・品質モデル）
├── .claude/
│   ├── agents/              # エージェント定義（2種）
│   ├── skills/              # スキル定義（12種）
│   └── commands/            # コマンド定義（9種）
├── src/
│   ├── components/          # Reactコンポーネント
│   ├── data/                # 静的データ（projects, blog, skills, profile）
│   ├── hooks/               # カスタムフック（言語, テーマ, IntersectionObserver）
│   └── types/               # 型定義
├── public/
│   ├── blog/                # ブログ記事（Markdown）
│   └── images/projects/     # プロジェクトスクリーンショット
├── docs/
│   ├── architecture/        # ゲートモデル, ブランドブック
│   ├── workflows/           # デプロイ, コンテンツ更新, ブログ制作
│   ├── adr/                 # Architecture Decision Records
│   └── templates/           # チェックリスト, ブリーフ
├── ops/
│   ├── backlog/             # タスク管理, 改善計画
│   ├── decisions/           # 意思決定ログ
│   ├── logs/devlog/         # 日次開発記録
│   └── reports/             # 品質メトリクス, 週次レポート
└── scripts/                 # Lighthouse計測等
```

## ポートフォリオOS

このリポジトリは単なるフロントエンドではなく、コンテンツ管理・品質保証・ブログ制作を統合した**運営OS**として設計されています。

- **5ゲート品質モデル**: Security / Performance / Accessibility / Brand / Deploy Readiness
- **エージェント**: project-lead, blog-editor
- **スキル**: code-quality, deploy-checker, brand-guard, blog-writer, blog-reviewer 他12種
- **コマンド**: `/add-project`, `/deploy`, `/write-blog`, `/quality-check` 他9種

詳細は `CLAUDE.md` を参照。

## ライセンス

Private
