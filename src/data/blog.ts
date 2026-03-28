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
      ja: 'Claude Codeで「一人事務所OS」を作った',
      en: 'Building a "one-person agency OS" with Claude Code',
    },
    date: '2026-03-25',
    tags: ['AI', 'Claude Code', 'Automation'],
    excerpt: {
      ja: 'taktマルチエージェントエンジンとClaude Codeのスキル体系を使い、8〜11エージェント規模の運営OSを3ドメインで構築・運用している話。',
      en: 'How I built and operate 8–11 agent operational OS across 3 domains using takt multi-agent engine and Claude Code skill system.',
    },
  },
  {
    slug: 'zero-trust-home-server',
    title: {
      ja: 'ゼロトラスト自宅サーバーを3万円で構築した',
      en: 'Building a zero-trust home server for $200',
    },
    date: '2026-03-20',
    tags: ['Infrastructure', 'Docker', 'Security'],
    excerpt: {
      ja: 'Cloudflare TunnelとTailscaleで公開/管理経路を完全分離し、Prometheus+Grafana+Uptime Kumaで3重モニタリングする自宅サーバーの構築記録。',
      en: 'A build log of a self-hosted server with complete route separation via Cloudflare Tunnel + Tailscale, and triple monitoring with Prometheus + Grafana + Uptime Kuma.',
    },
  },
]
