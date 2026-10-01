---
title:
  ja: "AIと一緒にポートフォリオを作った全工程を公開する"
  en: "Building a portfolio with AI — the entire process"
date: 2026-03-29
tags: [AI, Claude Code, Portfolio, Vite, React]
excerpt:
  ja: "調査・設計・実装・デプロイ・OS化まで、ポートフォリオサイトをAIと共同開発した全工程の記録。"
  en: "The full process of building a portfolio site with AI — from research to design, implementation, deployment, and OS-ification."
---

# AIと一緒にポートフォリオを作った全工程を公開する

## 何をしたか

このポートフォリオサイト自体を、Claude Codeとの共同開発で作った。調査から設計、実装、デプロイ、そしてサイト運用のOS化まで。1つのセッションの中で、以下の工程を順に進めた。

1. ローカルリポジトリ全量調査（26プロジェクト）
2. スコアリングと掲載候補選定
3. 技術スタック選定とcodexレビュー
4. MVP実装（Vite + React + TypeScript + Tailwind CSS 4）
5. GitHub Pagesデプロイ
6. デザイン改善
7. スクリーンショット撮影・OGP・Lighthouse最適化
8. 英語版対応・ダークモード・Analytics
9. ポートフォリオOSの構築（5ゲート品質モデル）
10. ブログ制作OS（エージェント + スキル + ワークフロー）
11. ブログ記事の執筆・セキュリティレビュー・公開

## 調査フェーズ — 26プロジェクトを5分で分類

最初にやったのは、Documents配下の全ディレクトリの調査だ。

`.git` の有無、`package.json` や `requirements.txt` の存在、`src/` ディレクトリの有無で、26のプロジェクト候補を自動抽出した。

次に各プロジェクトの README、package.json、git log、ソースコードを並列エージェントで調査した。AIが4〜5個の調査エージェントを同時に走らせ、数分で全プロジェクトの概要を収集した。

人間が1つ1つ確認していたら半日かかる作業だ。

## スコアリング — 技術力×独自性×完成度

各プロジェクトを5軸（技術力・独自性・完成度・継続性・ポートフォリオ適性）で1-5段階評価し、Tier S/A/B/Cに分類した。

最大の発見は **DuelMasters Plays** だった。386コミット、152モジュール、1,565テスト、11,000枚のカード定義。自分でも「ここまでの規模になっていたのか」と驚いた。AIが客観的に数値を集計してくれたからこそ、プロジェクトの実態が可視化された。

最終的にTier S（5件）+ Tier A（1件）の計6件を初期掲載候補として選定し、後から3件を追加して計9件になった。

## 設計フェーズ — codexにレビューを依頼

技術スタックの選定では、Vite + React と Next.js の比較検討を行い、GitHub Pagesとの相性でViteを選択した。

この計画をcodex（OpenAI Codex CLI）にレビュー依頼した。返ってきた指摘が的確だった。

- Tailwind CSS 4 は v3 の設定を混ぜると壊れる → `@tailwindcss/vite` で統一
- ProjectDetail はモーダルより展開式が実装コスト対効果が高い
- デプロイは `gh-pages` パッケージより GitHub Actions が再現性高い
- データ構造は最初から多言語対応可能にしておく

AIツール同士（Claude Code + codex）を組み合わせたレビュー体制。人間は指摘を読んで採否を判断するだけだ。

## 実装フェーズ — 型定義から始める

実装はデータ層の型定義から始めた。

```typescript
type LocalizedText = {
  ja: string
  en?: string
}
```

この `LocalizedText` 型を最初に定義したことで、後から英語版を追加する際に全面改修が不要だった。codexの「最初から多言語対応可能にしておく」という指摘が効いた。

コンポーネントは、Header → Hero → About → Skills → Projects → Contact の順にボトムアップで組み上げた。各コンポーネントは静的データ（`src/data/`）を参照するだけで、API呼び出しは一切ない。

## デプロイ — pushからデプロイ完了まで30秒

GitHub Actions で main ブランチへの push をトリガーにビルド・デプロイが走る。push から本番反映まで約30秒。

```yaml
jobs:
  build:
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npm run build
    - uses: actions/upload-pages-artifact@v3
  deploy:
    - uses: actions/deploy-pages@v4
```

この CI/CD パイプラインもAIが生成した。人間は動作確認するだけだ。

## OS化 — 5ゲート品質モデル

サイトが動いた後、運用の品質管理を仕組み化した。NanyaKanya（小説制作OS）やKomoriAmado（VTuber事務所OS）で実績のある設計パターンを、ポートフォリオに適用した。

5つのゲートを通過しないと公開できない仕組みだ。

| ゲート | 内容 | 方式 |
|---|---|---|
| Security | 秘密情報・ローカルパスの混入なし | 自動 |
| Performance | ビルド成功・バンドルサイズ許容範囲 | 自動 |
| Accessibility | motion対応・キーボード操作 | 自動 |
| Brand | トーン一貫性・技術的正確性 | 自動 |
| Deploy Readiness | 全ゲート通過確認 | 人間確認 |

加えて、10個のスキルと8個のコマンドを定義した。`/add-project` でプロジェクトを追加し、`/deploy` でゲートチェック + デプロイ、`/write-blog` でブログ記事の全制作フローが走る。

## ブログ制作OS — 記事もAIと共同制作

ブログ記事の制作パイプラインもOS化した。

```
[企画] blog-planner → 人間承認
  ↓
[執筆] blog-writer (+ blog-voice)
  ↓
[レビュー(3並列)]
  blog-reviewer ∥ brand-guard ∥ blog-security-reviewer
  ↓
[公開] blog-publisher → 5ゲート → 人間最終承認
```

`blog-voice` スキルがトーンを定義し、`blog-security-reviewer` スキルがインフラ情報の露出をチェックする。実際に、自宅サーバーの記事ではSSHのユーザー名やUFWルールの具体値が公開されかけていたのを、セキュリティレビューで検出して修正した。

## 人間がやったこと・AIがやったこと

全工程を振り返ると、人間とAIの役割分担が明確だった。

**人間がやったこと:**
- プロジェクトの掲載可否の判断（「これは載せる、これは載せない」）
- 自己紹介のニュアンス調整（「一人で作る」→「AIと一緒に作る」）
- デザインの最終判断（色、レイアウト、フォントの好み）
- セキュリティポリシーの判断（何を公開して何を伏せるか）
- ブログ記事のテーマ選定と優先順位

**AIがやったこと:**
- 26プロジェクトの自動調査・分類・スコアリング
- コンポーネント・スタイリング・データ構造の実装
- GitHub Actions ワークフローの生成
- 5ゲート品質モデル・スキル・コマンドの設計と実装
- ブログ記事の素材収集・執筆・セキュリティレビュー

## 振り返り

**AIは「調査と実装」が圧倒的に速い**。26プロジェクトの調査、コンポーネントの生成、ワークフローの設計——これらは人間が手作業でやると数日かかる。AIなら数分〜数十分だ。

**人間は「判断と方向性」に集中できる**。「何を載せるか」「どう見せるか」「何を公開して何を伏せるか」——こうした判断は人間にしかできない。AIが下準備を済ませてくれるから、人間は判断だけに集中できる。

**OS化で品質が持続する**。サイトを作って終わりではなく、5ゲート品質モデルとスキル・コマンド体系を構築したことで、今後の更新でも同じ品質基準が維持される。このブログ記事自体も、blog-security-reviewer を通してから公開している。
