# portfolio-source の扱い

## 概要

`portfolio-source/` は、ポートフォリオ構築の調査フェーズで作成された中間成果物。
リポジトリ再作成時に `portfolio/site/` のみをgit管理にしたため、現在はgit管理外。

## 正本の定義

| データ種別 | 正本 | 中間成果物 |
|---|---|---|
| プロジェクト一覧 | `src/data/projects.ts` | `../portfolio-source/projects.inventory.json` |
| ブログ記事 | `src/data/blog.ts` + `public/blog/*.md` | — |
| スキル一覧 | `src/data/skills.ts` | — |
| プロフィール | `src/data/profile.ts` | `../portfolio-source/portfolio-content-draft.md` |
| 除外プロジェクト | — | `../portfolio-source/excluded-projects.md` |

**`src/data/` が常に正本**。portfolio-source は参考資料として残すが、同期義務はない。

## 更新ルール

1. **コンテンツ変更時**: `src/data/` のみ更新する。portfolio-source の同期は任意。
2. **新規プロジェクト調査時**: `portfolio-source/projects.inventory.json` を参照しても良いが、判断後は `src/data/projects.ts` に直接反映。
3. **廃止判断**: portfolio-source は調査時の思考過程の記録としての価値がある。削除はしないが、最新性は保証しない。

## 今後の方針

portfolio-source の同期コストが高いため、以下の方針とする。

- **同期しない**: `src/data/` が正本。portfolio-source との差分は許容。
- **参照用に保持**: 初期調査時のスコアリング、除外理由、評価基準は参照価値がある。
- **content-manager スキルでは触れない**: プロジェクト追加時に portfolio-source の更新は不要。
