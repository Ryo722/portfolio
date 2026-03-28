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
  {
    slug: 'canvas-rendering-engine',
    title: {
      ja: 'Canvas APIで3レイヤーの画像合成エンジンを自作した',
      en: 'Building a 3-layer image compositing engine with Canvas API',
    },
    date: '2026-03-29',
    tags: ['Canvas API', 'React', 'TypeScript', 'Image Processing'],
    excerpt: {
      ja: 'Illustration / Text / Frameの3レイヤー合成エンジンをCanvas APIで自作した設計記録。テキスト描画パイプラインとツインパクト対応の話。',
      en: 'Built a 3-layer compositing engine (Illustration / Text / Frame) with Canvas API. Text rendering pipeline and Twinpact card support.',
    },
    url: '/portfolio/blog/canvas-rendering-engine.md',
  },
  {
    slug: 'sns-auto-post-monorepo',
    title: {
      ja: 'pnpm workspace + pg-bossで6アカウントSNS自動投稿を作った',
      en: 'Building a 6-account SNS auto-poster with pnpm workspace + pg-boss',
    },
    date: '2026-03-29',
    tags: ['TypeScript', 'Next.js', 'PostgreSQL', 'pg-boss', 'monorepo'],
    excerpt: {
      ja: 'X 3 + Threads 3 = 計6アカウントの予約投稿を、pnpm monorepo + pg-bossで構築。Advisory Lockで排他制御、AMBIGUOUSで二重投稿防止。',
      en: '6-account scheduled posting with pnpm monorepo + pg-boss. Advisory Lock for concurrency, AMBIGUOUS status to prevent double posts.',
    },
    url: '/portfolio/blog/sns-auto-post-monorepo.md',
  },
  {
    slug: 'portfolio-with-ai',
    title: {
      ja: 'AIと一緒にポートフォリオを作った全工程を公開する',
      en: 'Building a portfolio with AI — the entire process',
    },
    date: '2026-03-29',
    tags: ['AI', 'Claude Code', 'Portfolio', 'Vite', 'React'],
    excerpt: {
      ja: '調査・設計・実装・デプロイ・OS化まで、ポートフォリオサイトをAIと共同開発した全工程の記録。人間がやったこと・AIがやったことの役割分担。',
      en: 'Full process of building a portfolio with AI — research, design, implementation, deploy, and OS-ification. The role division between human and AI.',
    },
    url: '/portfolio/blog/portfolio-with-ai.md',
  },
]
