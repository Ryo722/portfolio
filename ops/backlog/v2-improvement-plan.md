# ポートフォリオ v2 改善計画

作成日: 2026-03-31
ベース: Codex (GPT-5.4) による徹底レビュー + 計画レビュー

## 総評

> 「素材は強いのに、見せ方と検証可能性でかなり損している」

最優先で変えるべき3点:
1. **数値の信頼回復** — ソース間の不整合が「誇張」に見える
2. **代表作の即時可視化** — 30秒で「何ができる人か」が伝わらない
3. **private案件の証拠提示** — 主張は強いのに検証不能

この3点を先にやれば、残りは全部"上積み"になる。

---

## Phase A: 信頼回復と証拠整備

**目的**: 数値の正確性を担保し、代表作の検証可能性を最低限確保する

### A-1. 数値不整合の統一 [Critical]

| 項目 | 現状の不整合 | 対応 |
|---|---|---|
| テスト数 | profile/projects: `1,565` / blog: `1,065` | 最新の正確な値に統一 |
| コミット数 | projects: `386` / blog: `374` | 最新の正確な値に統一 |

**対象ファイル**:
- `src/data/profile.ts`
- `src/data/projects.ts`
- `src/data/blog.ts` (excerpt)
- `public/blog/building-game-engine.md`
- `public/blog/en/building-game-engine.md`

**実装方針**:
- profile.ts / projects.ts / blog.ts の表示値を最新の正確な値に統一
- ブログ記事本文は「執筆時点の数値」として注記を追加（記事冒頭に「※数値は執筆時点。最新はプロジェクトページを参照」）
- 将来の再発防止: データ整合性テストに数値の交差チェックを追加

**並行可能**: A-2と並行

### A-2. ブログ記事の執筆時点注記 [Critical]

- building-game-engine.md の冒頭に注記追加
- 英語版も同様

**並行可能**: A-1と並行

### A-3. private案件の証拠テンプレート定義 [High]

**守秘境界ルール**（全private案件に適用）:
- 画面: モック化 or スクリーンショット（個人プロジェクトなので基本OK）
- 構成図: 匿名化不要（個人開発のため）
- 数値: 実数値を使用可能

**証拠テンプレート**（1案件あたり）:
- アーキテクチャ図 1枚
- 技術判断 3点（なぜその設計にしたか）
- 成果指標 2点（定量的）

**対象**: まずDuelMasters Playsのみ作成
- アーキ図: エンジン構造（processCommand中心の純粋関数設計）
- 判断: 純粋関数選択理由、カードビルダーパターン、置換効果の設計
- 成果: テスト数、モジュール数

### A-4. Hero文言の事実ベース化 [High]

現在の抽象タグライン:
> AIと一緒に、ゲームエンジンからインフラまでつくる開発者。

**改善構造**:
- 1行目: 役割と対象領域（具体的）
- 2行目: 検証可能な代表実績（数値付き）
- CTA: `代表実績を見る` / `技術ブログを読む`（GitHub直飛びをやめる）

**並行可能**: A-3と並行

### 完了基準

- [ ] サイト内の全実績数値が整合している（テストで検証）
- [ ] ブログ記事と表示値の不整合が0件
- [ ] DuelMasters Playsに証拠パッケージ（図1枚 + 判断3点 + 成果2点）がある
- [ ] Heroから抽象語のみの自己紹介が消えている

---

## Phase B: 情報設計と導線再構築

**目的**: 30秒で「何ができる人か」が伝わり、2スクロール以内に代表実績に到達できる構造にする

### B-1. セクション順序の変更 [High]

現在: Hero → About → Skills → Projects → Notes → Contact
変更後: Hero → Featured Projects → Skills → About → Notes → Contact

**理由**: 証拠（Projects）を先に見せ、文脈（About）は後

### B-2. Featured Projects セクション新設 [High]

代表2件（DuelMasters Plays + CafeNavi）を独立セクションとして前面化。

**ケーススタディカード構造**（固定5要素）:
1. 課題: 何を解決したか
2. 役割: 自分が何をしたか
3. 技術判断: なぜその設計にしたか
4. 成果: 定量的な結果
5. 証拠リンク: Demo / GitHub / ブログ記事

残りの7件は「Other Projects」として3カラムグリッド（現状維持ベース）

**DuelMasters Playsの訴求**:
- 画像 + scale指標を目立つ位置に
- 関連ブログ記事へのリンク
- 証拠パッケージ（Phase Aで作成）

**CafeNaviの訴求**:
- Demoリンクを大きく（唯一触れる代表作）
- テスト数・コード行数の指標
- 関連ブログ記事へのリンク

### B-3. About の圧縮・再設計 [High]

現在の長文を3ブロック固定に:
1. 何を得意とするか
2. どういう基準で作るか
3. どういう案件で価値を出せるか

スマホ1画面前後で読める長さに制限。

### B-4. Skills の証拠連動 [High]

タグクラウドから「能力 → 根拠」形式に変更。

例:
| 能力 | 根拠プロジェクト | 品質指標 |
|---|---|---|
| フロントエンド設計 | CafeNavi, Portfolio | Vitest 68テスト + Playwright 14テスト |
| ゲームエンジン設計 | DuelMasters Plays | 152モジュール, 純粋関数型 |
| AI協業 | Multi-Agent OS, M4FX | 3ドメイン運営OS |

全スキルではなく、上位能力だけ証拠付きで見せる。
残りのスキルは折りたたみか補足として残す。

### B-5. Project ↔ Notes 相互リンク [Medium]

- ProjectカードにrelatedNotes（手動設定）を追加
- Notesカードに関連Projectへのリンクを追加
- 自動関連は不要。「この案件で使った判断/学び」だけを紐づける

### B-6. Contact導線の改善 [Medium]

- 固定ヘッダーにContactへのCTAを追加（モバイル含む）
- メールアドレスのコピー機能
- GitHub以外のリンク検討（LinkedIn等）

### B-7. CTA設計の明確化 [High]

2系統のCTA:
- 採用担当向け: `代表実績を見る` → Featured Projects
- 技術者向け: `設計判断を読む` → Notes

Hero直下に分岐を設ける。

### 完了基準

- [ ] 初回表示から2スクロール以内にFeatured Projectsに到達できる
- [ ] Featured 2件で課題・役割・判断・成果・証拠が明示されている
- [ ] Skillsが少なくとも3件、具体的なProject/Noteに紐づく
- [ ] Aboutがスマホ1画面前後で読める
- [ ] ProjectsからNotes、NotesからProjectsの往復導線が成立する

---

## Phase C: 品質と仕上げ

**目的**: 技術品質でもプロフェッショナリズムを証明する

### C-1. アクセシビリティ改善 [High]

| 対象 | 問題 | 修正 |
|---|---|---|
| ProjectCard | aria-expanded/controls なし | disclosure パターン実装 |
| Notes カード | article + role=button | ネイティブ要素に変更 |
| BlogArticle | dialog未実装 | ルート遷移化（C-3と連動）またはアクセシブルモーダル |
| Header | aria-label が日本語固定 | 言語に応じて切替 |

**完了条件**: tab, enter, space, esc でメイン導線が操作可能

### C-2. 初回描画ちらつき修正 [Low]

index.html に `<script>` でlocalStorageからテーマ/言語を先に反映。

### C-3. 軽量なURL状態管理 [Medium]

**React Router は入れない**。以下で十分:
- `?note=slug` でNotes記事を直接リンク可能に
- `?project=slug` でProject詳細を展開状態で開く
- URLパラメータ変更時にdocument.titleを更新
- OGP/title切替は最小限

フルルーター導入は反応を見てから判断。

### C-4. SEO最適化 [Medium]

この規模で必要なもののみ:
- 各状態の固有 title
- description
- canonical
- Person / WebSite のJSON-LD
- OG画像（現状の1枚で十分）

### C-5. 最小限のUIテスト [Medium]

**スコープ限定**（4系統のみ）:
1. 主要CTA → Featured Projectsへの遷移
2. Project詳細の展開/折りたたみ
3. Notes記事の遷移
4. 数値整合テストの強化

E2Eは不要。React Testing Library のみ。

### C-6. ビジュアル調整 [Low]

差別化の源泉はビジュアルではなく実績の強さ。
最小限の調整に留める:
- Featured Projectsカードのビジュアル差別化
- 代表作の画像品質向上
- 過度に時間をかけない

### C-7. 二層導線（軽量版） [Low]

完全な二重構造は不要。Hero直下に:
- `実績を3分で見る` → Featured Projects
- `技術詳細を見る` → Notes

この分岐だけで十分。

### 完了基準

- [ ] キーボードのみで主要導線を操作できる
- [ ] Lighthouse a11y重大警告 0
- [ ] 主要導線の最低限テスト（4系統）が通る
- [ ] NotesとProjectが直接リンク可能
- [ ] OGP/title/description が主要状態で破綻しない

---

## 並行実行マップ

```
Phase A（信頼回復）
├── A-1 + A-2 並行（数値整合 + ブログ注記）
├── A-3 + A-4 並行（証拠テンプレート + Hero改稿）
└── → Phase B に進む

Phase B（情報設計）
├── B-1 + B-2 （セクション順 + Featured Projects） ← 同時に進める
├── B-3 + B-4 並行（About圧縮 + Skills証拠連動）
├── B-5 + B-6 並行（相互リンク + Contact改善）
└── → Phase C に進む

Phase C（品質）
├── C-1 + C-2 並行（a11y + ちらつき修正）
├── C-3 + C-4 並行（URL管理 + SEO）
├── C-5（UIテスト）
└── C-6 + C-7 並行（ビジュアル + 二層導線）
```

**注意**: C-3（URL状態管理）はPhase Bの情報設計が固まった後に着手すること。

---

## 成果指標（計測項目）

Plausible Analytics で以下を追跡:
- Featured Projects セクション到達率
- CTA クリック率（代表実績 / 技術ブログ）
- Notes 記事遷移率
- Contact 到達率
- モバイルでのスクロール深度

---

## リスクと対策

| リスク | 対策 |
|---|---|
| 数値の再不整合 | データ整合性テストに交差チェック追加 |
| Heroが冗長に | 「何者か」と「なぜ見る価値があるか」だけに絞る |
| Aboutを削りすぎ | 3ブロック固定で下限を設ける |
| Skills一覧性低下 | 上位能力のみ証拠付き、残りは補足表示 |
| 証拠パッケージ作成コスト高 | 1案件「図1枚, 判断3点, 成果2点」に制限 |
| URL状態管理のバグ | React Router不使用、URLSearchParamsのみ |

---

## スキップ判断

以下は現時点では実施しない:
- React Router 導入（URLSearchParamsで十分）
- 厚いE2Eテスト（保守コスト > 価値）
- 情報構造の完全二重化（導線分岐で十分）
- ビジュアル大改修（実績 > 見た目で差別化）
- SSG/Next.js移行（現規模では不要）
