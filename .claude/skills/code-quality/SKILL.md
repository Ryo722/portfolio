# code-quality

コードの品質を確認する。TypeScript型チェック、ビルド成功、バンドルサイズを検証。

## トリガー
- コード変更後
- デプロイ前チェック（deploy-checker から呼び出し）

## 実行手順

1. TypeScript 型チェック
```bash
npx tsc --noEmit
```

2. ビルド確認
```bash
npm run build
```

3. バンドルサイズ確認
- JS: 500KB 以下（gzip 150KB 以下）
- 画像: 各 500KB 以下

## 出力形式

```
## Code Quality Check
- TypeScript: PASS / FAIL
- Build: PASS / FAIL
- Bundle Size: PASS / WARNING (実測値)
- 総合: PASS / FAIL
```

## 判定基準
- TypeScript エラー 0 件で PASS
- ビルド成功で PASS
- バンドルサイズ超過は WARNING（BLOCK ではない）
