import type { Profile } from '../types'

export const profile: Profile = {
  name: 'Ryo722',
  tagline: {
    ja: 'AIと一緒に、ゲームエンジンからインフラまでつくる開発者。',
    en: 'Building from game engines to infrastructure — with AI as my co-developer.',
  },
  about: {
    ja: `フロントエンドからゲームエンジン、インフラまで——「自分が欲しいもの」を起点に、AIをパートナーとして設計から運用までを手がける個人開発者です。

代表作は、11,000枚超のカード定義と152モジュールの純粋関数型ゲームエンジンを搭載したオンライン対戦プラットフォーム。React + TypeScript のフロントエンドから Express + Socket.IO のリアルタイム通信、Docker + GitHub Actions の CI/CD、Cloudflare Tunnel の自宅サーバーデプロイまで、AIとの共同開発でフルスタックに構築しています。

Claude Code を活用したマルチエージェントオーケストレーションにも積極的に取り組んでおり、複数ドメインで「AIと回す運営OS」を設計・運用中。AI × 金融では、邦銀レポートを LLM で構造化して FX 売買シグナルを自動生成するシステムも開発しています。`,
    en: `A developer who builds everything from frontend to game engines to infrastructure — with AI as a co-developer, driven by the desire to create what I personally want to use.

My flagship project is an online battle platform featuring a pure-functional game engine with 152 modules and 11,000+ card definitions. Built full-stack through AI-assisted development: React + TypeScript frontend, Express + Socket.IO real-time communication, Docker + GitHub Actions CI/CD, and self-hosted deployment via Cloudflare Tunnel.

Actively exploring multi-agent orchestration with Claude Code, designing and operating "AI-powered operational OS" across multiple domains. Also developing an AI × finance system that structures Japanese bank FX reports with LLMs to auto-generate trading signals.`,
  },
  githubUrl: 'https://github.com/Ryo722',
  email: '793hanachan722@gmail.com',
}
