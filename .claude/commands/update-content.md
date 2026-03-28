# /update-content

既存プロジェクトの情報を更新する。

## 手順
1. $ARGUMENTS で指定されたプロジェクトの `slug` を特定
2. ローカルリポジトリまたはGitHubから最新情報を取得
3. `src/data/projects.ts` の該当プロジェクトを更新
4. 日本語・英語の両方を更新
5. `brand-guard` スキルでチェック
6. 結果を報告

## 引数
- $ARGUMENTS: プロジェクトのslugまたは名前

## 例
```
/update-content duel-masters-plays
/update-content EVPanel8
```
