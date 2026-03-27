import type { BlogPost } from '../types'

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-game-engine',
    title: {
      ja: '11,000枚のカードを動かすゲームエンジンを一人で書いた話',
      en: 'Building a game engine that powers 11,000+ cards — solo',
    },
    date: '2026-03-28',
    tags: ['TypeScript', 'Game Engine', 'Architecture'],
    excerpt: {
      ja: 'デュエル・マスターズの総合ルールに準拠した純粋関数型ゲームエンジンを、152モジュール・1,565テストの規模で個人開発した設計と実装の記録。',
      en: 'A design and implementation record of a pure-functional game engine compliant with Duel Masters comprehensive rules — 152 modules, 1,565+ tests, built solo.',
    },
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
