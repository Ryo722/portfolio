# Quality Metrics

## 2026-03-29（運用基盤整備スプリント後）

| メトリクス | 値 | Gate |
|---|---|---|
| TypeScript | PASS（エラー0） | Performance |
| ESLint | PASS | Performance |
| ビルド | PASS（164ms） | Performance |
| JSバンドル | 443.70 KB / gzip 133.19 KB | Performance |
| CSSバンドル | 55 KB / gzip 8.8 KB | Performance |
| npm audit | 0 vulnerabilities | Security |
| テスト | 20 passed / 0 failed（4ファイル、146ms） | Performance |
| OGP画像 | 55 KB (JPEG 85%) | Performance |
| プロジェクト数 | 9 | Content |
| ブログ記事数 | 9 | Content |
| スクリーンショット | 3/9 プロジェクト | Content |
| CI | lint → test → build → deploy（全PASS） | Deploy |
| `npm run check` | lint + test + build 一括実行可 | Quality |
| 404ページ | あり（public/404.html） | UX |
| Notes初期表示 | 3件 + もっと見る | UX |
| シンタックスハイライト | rehype-highlight（遅延ロード） | UX |

## 変更履歴

| 日付 | 変更 |
|---|---|
| 2026-03-29 (3rd) | lint CI追加、check script、404、Notes改善、ハイライト |
| 2026-03-29 (2nd) | README、404、Notes、ハイライト |
| 2026-03-29 (1st) | OGP最適化、Vitest導入、ops基盤、Lighthouse |
