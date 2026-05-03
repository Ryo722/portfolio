# /add-project

新規プロジェクトをポートフォリオに追加する。

## 手順
1. `content-manager` スキルの「プロジェクト追加手順」に従う
2. 対象プロジェクトのローカルディレクトリまたはGitHubリポジトリを調査
3. `src/data/projects.ts` にデータ追加（100本ノック対象なら `knock` フィールドも付与。`hundred-knock.ts` は自動派生なので触らない）
4. `brand-guard` スキルでコンテンツチェック
5. `code-quality` スキルでビルド確認 + `npx vitest run` で knock 整合性確認
6. 結果を報告し、人間にデプロイ判断を委ねる

## 引数
- $ARGUMENTS: プロジェクト名またはディレクトリパス

## 例
```
/add-project camp-planner
/add-project /Users/ryohanazaki/Documents/dev_own/camp-planner
```
