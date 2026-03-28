# 公開前QAチェックリスト

## Security
- [ ] 秘密情報がコミットに含まれていない
- [ ] ローカルパスが含まれていない
- [ ] npm audit で critical/high なし

## Performance
- [ ] TypeScript 型チェック成功
- [ ] ビルド成功
- [ ] バンドルサイズ許容範囲内

## Accessibility
- [ ] prefers-reduced-motion 対応
- [ ] キーボード操作可能
- [ ] 画像に alt あり

## Brand
- [ ] 技術的に正確
- [ ] トーン一貫
- [ ] 日英両方更新済み

## Deploy
- [ ] ローカルプレビュー確認済み
- [ ] 上記全項目クリア
