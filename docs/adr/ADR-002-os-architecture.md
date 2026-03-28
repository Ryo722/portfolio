# ADR-002: ポートフォリオOS化

**日付**: 2026-03-28
**ステータス**: 承認済み

## 背景
ポートフォリオサイトの継続的な品質管理とコンテンツ更新を効率化するため、NanyaKanya/KomoriAmado で実績のあるOS設計パターンを適用する。

## 決定
5ゲート品質モデル + スキル/コマンド体系によるOS化を採用。

## 構成
- **CLAUDE.md**: プロジェクトポリシー・実行ルール
- **5ゲート**: Security / Performance / Accessibility / Brand / Deploy Readiness
- **スキル5種**: code-quality, deploy-checker, brand-guard, content-manager, daily-ops-log
- **コマンド4種**: /add-project, /deploy, /quality-check, /update-content
- **ドキュメント**: gate-model, brand-book, workflows, ADR, templates
- **運用ログ**: ops/logs/devlog/, ops/reports/, ops/decisions/

## NanyaKanya/KomoriAmado との差異
- エージェントは最小限（project-lead のみ）
- takt ワークフローは不採用（単一開発者のためオーバースペック）
- ゲートモデルはポートフォリオ向けにカスタマイズ（Brand Gate のチェック項目を変更）
