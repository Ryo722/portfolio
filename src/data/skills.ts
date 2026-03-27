import type { SkillCategory } from '../types'

export const skills: SkillCategory[] = [
  {
    name: { ja: 'フロントエンド', en: 'Frontend' },
    skills: ['React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS', 'Material-UI', 'Zustand'],
  },
  {
    name: { ja: 'バックエンド / API', en: 'Backend / API' },
    skills: ['Node.js', 'Express', 'Socket.IO', 'Python', 'FastAPI'],
  },
  {
    name: { ja: 'データベース', en: 'Database' },
    skills: ['PostgreSQL', 'Prisma', 'SQLAlchemy', 'MongoDB'],
  },
  {
    name: { ja: 'ゲーム開発', en: 'Game Development' },
    skills: ['Unity (C#)', 'Canvas API', 'Game Engine Design', '@dnd-kit'],
  },
  {
    name: { ja: 'AI / LLM 活用', en: 'AI / LLM' },
    skills: ['Claude Code', 'OpenAI API', 'Stable Diffusion', 'RVC', 'Style-Bert-VITS2', 'Ollama'],
  },
  {
    name: { ja: '自動化', en: 'Automation' },
    skills: ['takt', 'pg-boss', 'Discord.js', 'OANDA API', 'kabu Station API'],
  },
  {
    name: { ja: 'インフラ / DevOps', en: 'Infrastructure / DevOps' },
    skills: ['Docker', 'Cloudflare Tunnel', 'Tailscale', 'GitHub Actions', 'Prometheus', 'Grafana'],
  },
  {
    name: { ja: 'テスト / 品質', en: 'Testing / Quality' },
    skills: ['Jest', 'Vitest', 'Playwright', 'Testing Library'],
  },
]
