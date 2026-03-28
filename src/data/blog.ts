import type { BlogPost } from '../types'

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-game-engine',
    title: {
      ja: '11,000枚のカードを動かすゲームエンジンをAIと書いた話',
      en: 'Building a game engine that powers 11,000+ cards — with AI',
    },
    date: '2026-03-29',
    tags: ['TypeScript', 'Game Engine', 'Architecture', 'AI', 'Claude Code'],
    excerpt: {
      ja: '純粋関数型ゲームエンジンを152モジュール・1,065テストの規模でAIと共同開発した設計と実装の記録。UIは人間がドライブし、ロジックはAIと組む——役割分担の話。',
      en: 'A pure-functional game engine with 152 modules and 1,065+ tests, co-developed with AI. Logic with AI, UI driven by human — a story of role division.',
    },
    url: '/portfolio/blog/building-game-engine.md',
  },
  {
    slug: 'multi-agent-orchestration',
    title: {
      ja: 'Claude Codeで「AIと回す運営OS」を3ドメインに展開した',
      en: 'Building AI-powered operational OS across 3 domains with Claude Code',
    },
    date: '2026-03-29',
    tags: ['AI', 'Claude Code', 'Automation', 'Multi-Agent', 'takt'],
    excerpt: {
      ja: '小説出版・VTuber事務所・SNS収益化——3ドメインでエージェント・スキル体系の運営OSを設計・運用。自動化は段階的に深化する。',
      en: 'Novel publishing, VTuber agency, SNS monetization — designing operational OS with agents and skills across 3 domains. Automation deepens gradually.',
    },
    url: '/portfolio/blog/multi-agent-orchestration.md',
  },
  {
    slug: 'zero-trust-home-server',
    title: {
      ja: 'ゼロトラスト自宅サーバーを3万円で構築した全記録',
      en: 'Building a zero-trust home server for $200 — full record',
    },
    date: '2026-03-29',
    tags: ['Infrastructure', 'Docker', 'Security', 'Cloudflare', 'Tailscale'],
    excerpt: {
      ja: 'NUCBox 3にCloudflare Tunnel × Tailscaleでポート開放なしの自宅サーバー。2層ネットワーク・自動デプロイ・バックアップまでの全設計。',
      en: 'Home server on NUCBox 3 with zero open ports via Cloudflare Tunnel × Tailscale. Full design covering 2-layer networking, auto-deploy, and backup.',
    },
    url: '/portfolio/blog/zero-trust-home-server.md',
  },
]
