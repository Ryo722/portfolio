# blog-publisher

レビュー済みブログ記事をポートフォリオサイトに公開する。

## トリガー
- `blog-editor` エージェントから委任時
- `/publish-blog` コマンド実行時

## 前提条件
- `blog-reviewer` による PASS 判定済み
- 人間による承認済み

## 実行手順

### Step 1: データ登録
1. `src/data/blog.ts` の `blogPosts` 配列に記事データを追加
2. 以下のフィールドを設定:
   - slug: URLスラッグ
   - title: { ja, en }
   - date: YYYY-MM-DD
   - tags: string[]
   - excerpt: { ja, en }
   - url: 外部公開先URL（note等）or undefined

### Step 2: 記事本文の配置
1. 外部公開（note等）の場合: `url` フィールドにリンク設定
2. サイト内公開の場合（将来）: `public/blog/{slug}.md` に配置

### Step 3: 品質ゲートチェック
1. `deploy-checker` スキルを実行（5ゲート）
2. 全ゲート PASS を確認

### Step 4: 公開
1. `deploy-workflow` に従いコミット・プッシュ
2. 本番URLで記事が表示されることを確認
3. `ops/logs/devlog/` に公開記録を残す

### Step 5: SNS告知（任意）
1. 記事のフック（最も面白い1文）を抽出
2. X/Threads用の告知文を生成（`blog-voice` トーン準拠）

## 出力
- 公開完了の確認メッセージ
- 本番URL
- SNS告知文（任意）
