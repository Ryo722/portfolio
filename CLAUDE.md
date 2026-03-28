# Project CLAUDE.md
<!-- Version: 1.0 | Last updated: 2026-03-28 -->

必ず日本語で回答すること。

## このファイルの目的

このプロジェクトでは、Claude Code の承認UIに依存せず、通常の開発作業を自動実行できる運用を前提とする。
安全性は、Claudeの都度承認ではなく、OS / shell wrapper / Git hooks / Trash 運用などの技術的ガードで担保する。

## グローバル CLAUDE.md との整合ルール

グローバル CLAUDE.md にある安全原則は尊重する。

- 高リスク変更は常に慎重に扱う
- 破壊的コマンドを無確認で通さない

ただし、このプロジェクトでは、それを承認UIで毎回確認するのではなく、技術的ガードで満たすものとする。

- 高リスクな変更内容の検討・実装・差分作成は Claude が進めてよい
- 高リスクなコマンド実行は Claude が自動実行してはならない
- 危険操作が必要な場合は、Claude は実行せず、理由と手順を説明し、人間が手動実行する

## プロジェクト概要

- **名称**: Ryo722 Portfolio OS
- **目的**: ポートフォリオサイトの開発・運用・品質管理を統合的に行うOS
- **技術スタック**: Vite + React 19 + TypeScript + Tailwind CSS 4
- **公開先**: GitHub Pages (https://ryo722.github.io/portfolio/)
- **リポジトリ**: Ryo722/portfolio

## 実行モード

- 通常の開発作業は自動実行してよい
- 危険操作は承認を求めるのではなく、Claude 自身が実行しない
- 危険操作が必要と判断した場合は、まず代替手段を検討する
- 代替がない場合は、人間向けの手動手順だけを提示する

## Claude の基本行動方針

- 読み取り、確認、差分確認を優先する
- 変更前後は git status, git diff などで追跡可能な状態を維持する
- 小さく、可逆で、レビューしやすい変更を優先する
- ファイル新規作成よりも既存ファイルの編集を優先する
- 推測で書かず、不明は TBD として残す

## 禁止操作

- `rm -rf`, `git push --force`, `git reset --hard` の自動実行
- `.env` ファイルや秘密情報の読み取り・出力
- `node_modules/` への直接変更
- 他プロジェクト（Documents配下の別リポジトリ）のファイル変更
- 個人情報（メールアドレス以外）のコード内ハードコード

## 5ゲート品質モデル

すべての公開変更は、以下の5ゲートを通過すること。

| ゲート | 内容 | 方式 |
|---|---|---|
| **Security Gate** | 秘密情報の混入なし、依存関係の脆弱性なし | 自動（スキル） |
| **Performance Gate** | ビルド成功、バンドルサイズ許容範囲内 | 自動（スキル） |
| **Accessibility Gate** | prefers-reduced-motion対応、キーボード操作可 | 自動（スキル） |
| **Brand Gate** | トーン一貫性、技術的正確性、プロフェッショナルな表現 | 自動（スキル） |
| **Deploy Readiness** | 全ゲート通過確認、最終承認 | 人間確認必須 |

詳細: `docs/architecture/gate-model.md`

## 組織構成（エージェント・スキル）

### エージェント（意思決定）
- **project-lead**: 全体方針・優先順位判定・タスク委任
- **blog-editor**: ブログ記事の企画→執筆→レビュー→公開パイプライン統括

### スキル（実務）

#### サイト運用
- **code-quality**: ESLint/TypeScript チェック、コード品質確認
- **deploy-checker**: デプロイ前5ゲートチェック
- **brand-guard**: 公開コンテンツのブランド整合性チェック
- **content-manager**: プロジェクト追加・更新の標準手順
- **daily-ops-log**: 日次作業記録

#### ブログ制作
- **blog-planner**: 記事の企画・ブリーフ作成
- **blog-writer**: 記事本文の執筆（`blog-voice` 自動適用）
- **blog-voice**: ブログの文体・トーン定義（自動適用、直接呼出不可）
- **blog-reviewer**: 記事の5軸品質レビュー
- **blog-publisher**: レビュー済み記事の公開処理
- **note-formatter**: 記事をnote投稿用フォーマット（タイトル/本文/タグ/マガジン）に変換

詳細: `.claude/skills/` 配下の各 SKILL.md

## コマンド

| コマンド | 用途 |
|---|---|
| `/add-project` | 新規プロジェクトの追加 |
| `/deploy` | デプロイ前チェック + デプロイ手順表示 |
| `/quality-check` | 5ゲート一括チェック |
| `/update-content` | 既存プロジェクト情報の更新 |
| `/write-blog` | ブログ記事の全制作フロー（企画→公開） |
| `/plan-blog` | ブログ記事の企画・ブリーフのみ |
| `/review-blog` | ブログ記事のレビューのみ |
| `/publish-blog` | レビュー済み記事の公開 |
| `/format-note` | 記事をnote投稿用フォーマットに変換 |

## ディレクトリ構成

```
portfolio/site/
├── CLAUDE.md                    # このファイル（プロジェクトポリシー）
├── .claude/
│   ├── settings.local.json      # 権限設定
│   ├── skills/                  # スキル定義
│   └── commands/                # コマンド定義
├── docs/
│   ├── architecture/            # アーキテクチャ文書
│   │   ├── gate-model.md
│   │   └── brand-book.md
│   ├── workflows/               # ワークフロー定義
│   ├── adr/                     # Architecture Decision Records
│   └── templates/               # テンプレート
├── ops/
│   ├── backlog/                 # タスク管理
│   ├── decisions/               # 意思決定ログ
│   ├── logs/
│   │   └── devlog/              # 開発記録
│   └── reports/                 # レポート
├── portfolio-source/            # 調査・設計中間成果物
├── src/                         # アプリケーションソース
├── public/                      # 静的アセット
└── dist/                        # ビルド出力
```

## 開発規約

### コミットメッセージ
- `feat:` 新機能・新プロジェクト追加
- `fix:` バグ修正
- `style:` デザイン変更
- `content:` テキスト・コンテンツ変更
- `ci:` CI/CD変更
- `docs:` ドキュメント変更
- `ops:` 運用関連

### ブランチ運用
- `main` ブランチのみ（GitHub Pages直デプロイ）
- 大規模変更時はPRを作成

### テスト
- TypeScript型チェック: `npx tsc --noEmit`
- ビルド確認: `npm run build`
- ローカルプレビュー: `npm run preview`
