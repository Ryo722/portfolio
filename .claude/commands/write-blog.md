# /write-blog

ブログ記事の全制作フロー（企画→執筆→レビュー→公開）を実行する。

## 手順
`blog-editor` エージェントを起動し、以下のパイプラインを実行:

1. `blog-planner` で企画・ブリーフ作成 → 人間承認
2. `blog-writer` で執筆（`blog-voice` 自動適用）
3. `blog-reviewer` + `brand-guard` で並列レビュー
4. 修正があれば改稿（最大2回）
5. `blog-publisher` でデータ登録 + 5ゲートチェック
6. 人間最終承認 → デプロイ

## 引数
- $ARGUMENTS: テーマまたはプロジェクト名

## 例
```
/write-blog ゲームエンジンの設計
/write-blog DuelMastersPlays
/write-blog マルチエージェントOS
```

## 詳細
ワークフロー: `docs/workflows/blog-production-workflow.md`
