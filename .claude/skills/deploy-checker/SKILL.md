# deploy-checker

デプロイ前の5ゲート一括チェックを実行する。

## トリガー
- `/deploy` コマンド実行時
- `/quality-check` コマンド実行時

## 実行手順

### Gate 1: Security Gate
1. `git diff --cached` および `git diff` で以下を検索:
   - `.env`, `API_KEY`, `SECRET`, `TOKEN`, `PASSWORD` パターン
   - `/Users/` 等のローカルパス
   - メールアドレス以外の個人情報
2. `npm audit --audit-level=high` で脆弱性チェック

### Gate 2: Performance Gate
1. `code-quality` スキルを呼び出し

### Gate 3: Accessibility Gate
1. `prefers-reduced-motion` が `src/index.css` に定義されているか確認
2. `img` タグに `alt` 属性があるか確認
3. インタラクティブ要素に `aria-label` があるか確認

### Gate 4: Brand Gate
1. `brand-guard` スキルを呼び出し

### Gate 5: Deploy Readiness
1. Gate 1-4 の結果をサマリー表示
2. 全 PASS なら「デプロイ可能」、1つでも FAIL なら「要修正」を表示
3. 人間に最終確認を求める

## 出力形式

```
## Deploy Readiness Check

| Gate | Status | Details |
|---|---|---|
| Security | PASS/FAIL | ... |
| Performance | PASS/FAIL | ... |
| Accessibility | PASS/FAIL | ... |
| Brand | PASS/FAIL | ... |
| Deploy Readiness | PENDING | 人間確認待ち |

総合判定: READY / NOT READY
```
