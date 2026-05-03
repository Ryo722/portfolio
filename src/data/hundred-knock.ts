export interface KnockProduct {
  id: number
  name: string
  category: 'web' | 'cli' | 'chrome-ext' | 'game' | 'other'
  date: string
  description: string
  url?: string
  portfolioSlug?: string
  techStack: string[]
}

export interface KnockChallenge {
  startDate: string
  targetDate: string
  goal: number
  products: KnockProduct[]
}

export const knockChallenge: KnockChallenge = {
  startDate: '2026-03-01',
  targetDate: '2026-05-31',
  goal: 100,
  products: [
    {
      id: 1,
      name: 'DuelMasters Plays',
      category: 'web',
      date: '2026-03-05',
      description: 'デュエル・マスターズの対戦シミュレーター',
      portfolioSlug: 'duelmasters-plays',
      techStack: ['React', 'TypeScript', 'Vite'],
    },
    {
      id: 2,
      name: 'イーブイパネル8',
      category: 'game',
      date: '2026-03-08',
      description: 'イーブイの進化をテーマにしたパズルゲーム',
      techStack: ['React', 'TypeScript', 'CSS'],
    },
    {
      id: 3,
      name: 'M4FX',
      category: 'web',
      date: '2026-03-12',
      description: 'FXトレード分析ツール',
      techStack: ['React', 'TypeScript', 'Chart.js'],
    },
    {
      id: 4,
      name: 'マルチエージェント運営OS群',
      category: 'web',
      date: '2026-03-15',
      description: 'AIエージェントによるプロジェクト運営システム',
      techStack: ['Claude Code', 'TypeScript', 'Multi-Agent'],
    },
    {
      id: 5,
      name: 'ゼロトラスト自宅サーバー',
      category: 'other',
      date: '2026-03-18',
      description: 'ゼロトラストアーキテクチャの自宅サーバー構築',
      techStack: ['Cloudflare Tunnel', 'Docker', 'Linux'],
    },
    {
      id: 6,
      name: 'SNS自動予約投稿',
      category: 'web',
      date: '2026-03-20',
      description: 'SNSへの投稿を自動で予約・管理するツール',
      techStack: ['Node.js', 'TypeScript', 'API'],
    },
    {
      id: 7,
      name: 'Notion日記自動化',
      category: 'web',
      date: '2026-03-23',
      description: 'Notionへの日記記入を自動化するツール',
      techStack: ['Notion API', 'TypeScript', 'Automation'],
    },
    {
      id: 8,
      name: 'CafeNavi',
      category: 'web',
      date: '2026-03-28',
      description: '作業しやすいカフェを検索・ナビゲーションするアプリ',
      portfolioSlug: 'cafenavi',
      techStack: ['React', 'TypeScript', 'Google Maps API'],
    },
    {
      id: 9,
      name: 'torabo-tsuki LP XS カスタムケース',
      category: 'other',
      date: '2026-04-13',
      description: '自作キーボード用ケースをBlender MCPで設計し3Dプリント',
      portfolioSlug: 'torabo-tsuki-case',
      techStack: ['Blender', 'Blender MCP', 'Claude', '3D Printing'],
    },
    {
      id: 10,
      name: 'ポケモンチャンピオンズ パーティビルダー',
      category: 'cli',
      date: '2026-05-01',
      description: '環境上位30匹に確実有利を取るパーティを自動構築するCLI（21コマンド）',
      portfolioSlug: 'pokemon-champions-builder',
      techStack: ['TypeScript', 'Node.js', '@smogon/calc', 'Vitest'],
    },
    {
      id: 11,
      name: 'YouTube 期間別人気動画ソーター',
      category: 'chrome-ext',
      date: '2026-05-03',
      description: 'YouTubeチャンネル動画を「期間×人気順」で絞り込めるChrome拡張（Web Store公開済）',
      url: 'https://chromewebstore.google.com/detail/youtube-%E6%9C%9F%E9%96%93%E5%88%A5%E4%BA%BA%E6%B0%97%E5%8B%95%E7%94%BB%E3%82%BD%E3%83%BC%E3%82%BF%E3%83%BC/gcoblkekjbplafeafmdgcghlcnenfdfp',
      portfolioSlug: 'youtube-period-sorter',
      techStack: ['JavaScript', 'Chrome Extension MV3', 'YouTube Data API v3'],
    },
  ],
}
