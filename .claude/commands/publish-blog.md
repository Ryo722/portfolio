# /publish-blog

レビュー済みブログ記事を公開する。

## 前提
- `blog-reviewer` による PASS 判定済み
- 人間による記事内容の承認済み

## 手順
1. `blog-publisher` スキルを実行
2. `src/data/blog.ts` にデータ登録
3. `deploy-checker` で5ゲートチェック
4. 全ゲート PASS → 人間にデプロイ確認
5. コミット → プッシュ → デプロイ確認

## 引数
- $ARGUMENTS: 記事のslug
