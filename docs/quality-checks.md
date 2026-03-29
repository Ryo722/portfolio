# 品質確認手順書

ポートフォリオサイトの品質を維持するための確認手順。

## 自動チェック（`npm run check`）

```bash
npm run check
# 以下を順に実行:
# 1. npm run lint    — ESLint
# 2. npm test        — データ整合性テスト（20件）
# 3. npm run build   — TypeScript型チェック + Viteビルド
```

CIでは `npm test` → `npm run build` が自動実行される（lint は追加済み）。

## 手動チェック（デプロイ前）

### 表示確認
- [ ] `npm run preview` でローカルプレビュー起動
- [ ] トップページが表示される
- [ ] ナビゲーションの全リンクが動作する
- [ ] Projects の「詳細を見る」が展開する
- [ ] Notes の「もっと見る」が展開する
- [ ] Notes の記事をクリックすると記事が表示される
- [ ] 記事内のコードブロックにシンタックスハイライトがある
- [ ] 「← 戻る」でNotes一覧に戻れる
- [ ] Contact のGitHub / Emailリンクが正しい

### 切替確認
- [ ] EN/JA切替で全セクションの言語が切り替わる
- [ ] ダーク/ライト切替で全セクションのテーマが切り替わる
- [ ] ブラウザリロード後も言語・テーマ設定が保持される

### モバイル確認
- [ ] ハンバーガーメニューが動作する
- [ ] プロジェクトカードが1列で表示される
- [ ] ブログ記事がモバイルで読める

### 404確認
- [ ] https://ryo722.github.io/portfolio/nonexistent で404ページが表示される

## Lighthouse計測（任意）

```bash
./scripts/lighthouse.sh
# または URL指定
./scripts/lighthouse.sh https://ryo722.github.io/portfolio/
```

結果は `ops/reports/lighthouse/` に保存。

## メトリクス記録

デプロイ後に `ops/reports/quality-metrics.md` を更新。
