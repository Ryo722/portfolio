import type { SkillCategory } from '../types'

export const skills: SkillCategory[] = [
  {
    name: { ja: 'フロントエンド', en: 'Frontend' },
    skills: ['React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS', 'Material-UI', 'Zustand'],
    evidence: {
      ja: 'CafeNavi（9,191行 / 82テスト）、Portfolio、DM オリカジェネレーター',
      en: 'CafeNavi (9,191 LOC / 82 tests), Portfolio, DM Card Generator',
    },
    projectSlugs: ['cafenavi', 'dm-card-generator'],
  },
  {
    name: { ja: 'バックエンド / API', en: 'Backend / API' },
    skills: ['Node.js', 'Express', 'Socket.IO', 'Python', 'FastAPI'],
    evidence: {
      ja: 'DuelMasters Plays（Socket.IOリアルタイム通信）、M4FX（FastAPI + 3パイプライン）',
      en: 'DuelMasters Plays (Socket.IO real-time), M4FX (FastAPI + 3 pipelines)',
    },
    projectSlugs: ['duel-masters-plays', 'm4fx-trade-signal'],
  },
  {
    name: { ja: 'データベース', en: 'Database' },
    skills: ['PostgreSQL', 'Prisma', 'SQLAlchemy', 'MongoDB'],
    evidence: {
      ja: 'DuelMasters Plays（Prisma）、M4FX（SQLAlchemy）、SNS自動投稿（pg-boss）',
      en: 'DuelMasters Plays (Prisma), M4FX (SQLAlchemy), SNS Auto-Post (pg-boss)',
    },
  },
  {
    name: { ja: 'ゲームエンジン設計', en: 'Game Engine Design' },
    skills: ['Pure Functions', 'State Machine', 'Canvas API', 'Unity (C#)'],
    evidence: {
      ja: '152モジュールの純粋関数型エンジン、35種コマンド、置換効果システム',
      en: '152-module pure-functional engine, 35 command types, replacement effect system',
    },
    projectSlugs: ['duel-masters-plays', 'ev-panel-8'],
  },
  {
    name: { ja: 'AI / LLM 活用', en: 'AI / LLM' },
    skills: ['Claude Code', 'OpenAI API', 'Stable Diffusion', 'RVC', 'Ollama'],
    evidence: {
      ja: '3ドメインの運営OS設計、LLMによる銀行レポート構造化パイプライン',
      en: 'Operational OS across 3 domains, LLM-powered bank report structuring pipeline',
    },
    projectSlugs: ['multi-agent-os', 'm4fx-trade-signal'],
  },
  {
    name: { ja: 'インフラ / DevOps', en: 'Infrastructure / DevOps' },
    skills: ['Docker', 'Cloudflare Tunnel', 'Tailscale', 'GitHub Actions', 'Prometheus', 'Grafana'],
    evidence: {
      ja: 'ゼロトラスト自宅サーバー（公開/管理経路分離、3重監視）',
      en: 'Zero-trust home server (public/management route separation, triple monitoring)',
    },
    projectSlugs: ['zero-trust-home-server'],
  },
  {
    name: { ja: 'テスト / 品質', en: 'Testing / Quality' },
    skills: ['Jest', 'Vitest', 'Playwright', 'Testing Library'],
    evidence: {
      ja: 'DuelMasters Plays 1,565+テスト、CafeNavi Unit 68 + E2E 14テスト',
      en: 'DuelMasters Plays 1,565+ tests, CafeNavi 68 unit + 14 E2E tests',
    },
    projectSlugs: ['duel-masters-plays', 'cafenavi'],
  },
  {
    name: { ja: '自動化', en: 'Automation' },
    skills: ['takt', 'pg-boss', 'Discord.js', 'OANDA API'],
    evidence: {
      ja: '6アカウントSNS予約投稿（pnpm monorepo + pg-boss）',
      en: '6-account SNS scheduled posting (pnpm monorepo + pg-boss)',
    },
    projectSlugs: ['sns-auto-post'],
  },
]
