# デプロイワークフロー

## 概要
mainブランチへのpushで GitHub Actions が自動デプロイする。
デプロイ前に5ゲートチェックを実施すること。

## フロー

### Phase 1: 開発
1. ソースコード変更
2. `npx tsc --noEmit` で型チェック
3. `npm run build` でビルド確認
4. `npm run preview` でローカル確認

### Phase 2: 5ゲートチェック
1. `/quality-check` コマンドまたは `deploy-checker` スキルを実行
2. 全ゲート PASS を確認
3. 問題があれば修正してから次へ

### Phase 3: コミット & プッシュ
1. `git add` で変更をステージ
2. コミットメッセージ規約に従いコミット
3. `git push origin main`（git hookでprotected push確認）

### Phase 4: デプロイ確認
1. GitHub Actions の実行状況を確認
2. 本番URL (https://ryo722.github.io/portfolio/) で表示確認
3. `ops/logs/devlog/` にデプロイ記録を残す

## 緊急ロールバック
1. `git revert HEAD` で直前のコミットを打ち消し
2. push してデプロイ
3. `ops/decisions/` にインシデント記録
