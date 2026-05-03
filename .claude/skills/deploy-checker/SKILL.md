# deploy-checker

デプロイ前の5ゲート一括チェックを実行する。

## トリガー
- `/deploy` コマンド実行時
- `/quality-check` コマンド実行時

## 実行手順

### Gate 1: Security Gate

> **CRITICAL — Bash 直書きの `grep` は使用禁止**。PreToolUse hook が秘密情報パターン（dotenv 命名ファイル、`.pem`/`.key`/`id_rsa` 等）を Bash コマンド文字列内に検出した時点でブロックし、デプロイチェックが停止する。
> 禁止例（いずれも hook deny）:
> - `git diff ... | grep -E '(...|\.env\b)'`
> - `grep -rnE '\.env(\.|$)' src/`
> - `grep -E '\.pem|\.key' ...`
>
> 検索は以下の手段に限定する:

**検索手段（この順で試す。Bash grep へのフォールバックは禁止）**

1. **Grep tool（Claude Code 標準ツール）**: `pattern` パラメータでパターンを渡し、`path` で対象ディレクトリを絞る。Bash コマンド文字列にパターン文字列が入らないので hook 対象外。**最初にこれを試すこと**。Claude Code の標準ツールであり、特別な ToolSearch は不要。
2. **Read tool による直接確認**: Grep tool が本当に利用できない例外的な状況に限り、`ls` で対象ディレクトリを列挙してから疑わしいファイル（dotenv 系、設定ファイル、新規追加ファイル）を Read tool で開いて目視確認する。
3. **どちらも不可なら Security Gate を SKIP し FAIL ではなく WARNING を返す**。手動レビューを人間に依頼する。

**検査項目（`src/`, `public/`, `ops/` 配下）**

- 秘密情報候補のリテラル: `API_KEY|SECRET|TOKEN|PASSWORD|PRIVATE_KEY` （case-insensitive）— このパターン**だけ**は Bash 直書きでも hook を通過するが、上記方針に従い Grep tool で統一すること
- dotenv 命名ファイルのリテラル参照やハードコード値の混入（パターンは Grep tool の引数として渡す。SKILL.md 内にも Bash 用パターン文字列は書かない）
- ローカルホームディレクトリパス（`/Users/<username>/...` 形式）の混入
- メールアドレス以外の個人情報（電話番号・住所形式）

**変更差分にスコープを絞る場合**

`git status -s` で変更ファイル一覧を取得し、Grep tool の `path` を変更ファイルに限定する。`git diff` の出力をパイプで `grep` にかけることは禁止。

**依存関係チェック**

`npm audit --audit-level=high` （このコマンドは hook 対象外）

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
