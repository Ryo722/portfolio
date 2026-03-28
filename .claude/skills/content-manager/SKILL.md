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
   - 説明文（日英、各2-3文）
   - 技術スタック
   - 工夫した点（日英、各3-6項目）
   - GitHub URL / Demo URL
   - 公開可否

### Step 2: データ追加
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

### Step 3: 画像（任意）
1. スクリーンショットを撮影
2. 幅800px以下にリサイズ
3. `public/images/projects/{slug}.png` に配置
4. データの `image` フィールドを更新

### Step 4: チェック
1. `code-quality` スキルでビルド確認
2. `brand-guard` スキルでコンテンツ確認

## inventory 更新
プロジェクト追加時は `portfolio-source/projects.inventory.json` も更新すること。
