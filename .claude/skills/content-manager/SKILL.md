# content-manager

ポートフォリオのプロジェクト追加・更新の標準手順を実行する。

## トリガー
- `/add-project` コマンド実行時
- `/update-content` コマンド実行時

## プロジェクト追加手順

### Step 1: 情報収集
1. 対象のローカルディレクトリまたはGitHubリポジトリを調査
2. README.md, package.json, 主要ソースから以下を抽出:
   - プロジェクト名（日英）
   - カテゴリ
   - サマリー（日英、各1行）
   - 技術スタック
   - 工夫した点（日英、各3-6項目）
   - GitHub URL / Demo URL
   - 公開可否

### Step 2: オーナーインタビュー

プロジェクトの description を生成するため、オーナーに以下を質問する。

**質問項目:**
1. なぜこれを作ったのですか？（個人的な動機を正直に）
2. 誰に使ってほしいですか？（ターゲット）
3. このプロダクトの一番の「売り」は何ですか？
4. 作っていて一番苦しかった / うまくいかなかった部分は？
5. 正直な現状は？（完成度、使用状況、停止中なら理由）
6. 参考にしたプロダクトやアイデアはありますか？（リスペクト要素）

**進め方:**
- 一問ずつ聞く。回答に応じて掘り下げてよい
- 「特にない」も有効な回答として受け入れる
- 全質問の回答後、要約をオーナーに確認する

**インタビュー結果の扱い:**
- 美化・脚色しない。オーナーの言葉をそのまま活かす
- ネガティブな回答（飽きた、未完成、負けた等）もそのまま反映する
- インタビューにない情報を追加しない

### Step 3: description 生成

インタビュー結果をもとに description（ja/en）を生成する。

**参照:** `docs/architecture/portfolio-soul.md` のトーン定義・Do/Don't に従うこと。

**構成:**
1. ユーザー視点で何ができるか（1行）
2. なぜ作ったか（動機を正直に）
3. 技術的な工夫（事実ベース）
4. 正直な振り返り（うまくいったこと、いかなかったこと）

**文体ルール:**
- 一文60字以内目安
- 段落は `\n\n` で区切る
- 禁止: 「イノベーション」「ソリューション」「〜に貢献したい」等の就活テンプレ表現
- en は ja の直訳ではなく、英語として自然な表現にする

### Step 4: データ追加
1. `src/data/projects.ts` の `projects` 配列末尾に追加
2. テンプレート:

```typescript
{
  slug: 'project-slug',
  name: { ja: '日本語名', en: 'English Name' },
  category: 'カテゴリ',
  summary: { ja: '一言説明', en: 'One-line summary' },
  description: { ja: '説明文', en: 'Description' },
  techStack: ['Tech1', 'Tech2'],
  highlights: [
    { ja: '工夫1', en: 'Highlight 1' },
  ],
  githubUrl: null,  // or 'https://github.com/Ryo722/xxx'
  demoUrl: null,    // or 'https://...'
  image: null,      // or '/portfolio/images/projects/xxx.png'
  visibility: 'public',  // or 'private'
}
```

### Step 5: 画像（任意）
1. スクリーンショットを撮影
2. 幅800px以下にリサイズ
3. `public/images/projects/{slug}.png` に配置
4. データの `image` フィールドを更新

### Step 6: チェック
1. `code-quality` スキルでビルド確認
2. `brand-guard` スキルでコンテンツ確認

## inventory 更新
プロジェクト追加時は `portfolio-source/projects.inventory.json` も更新すること。

## 参照
- `docs/architecture/portfolio-soul.md`（プロジェクト記事のトーン基準）
- `docs/architecture/brand-book.md`（表現ルール）
