import type { Profile } from '../types'

export const profile: Profile = {
  name: 'Ryo722',
  tagline: {
    ja: 'ゲームエンジンからインフラまで。一人でつくりきる開発者。',
    en: 'From game engines to infrastructure. A solo full-stack developer.',
  },
  about: {
    ja: `フロントエンドからゲームエンジン、インフラまで——「自分が欲しいもの」を起点に、設計から運用までを一人で完結させる個人開発者です。

代表作は、11,000枚超のカード定義と152モジュールの純粋関数型ゲームエンジンを搭載したオンライン対戦プラットフォーム。React + TypeScript のフロントエンドから Express + Socket.IO のリアルタイム通信、Docker + GitHub Actions の CI/CD、Cloudflare Tunnel の自宅サーバーデプロイまで、フルスタックで構築しています。

最近は Claude Code を活用したマルチエージェントオーケストレーションにも取り組んでおり、複数ドメインで「一人で回せる運営OS」を設計・運用中。AI × 金融では、邦銀レポートを LLM で構造化して FX 売買シグナルを自動生成するシステムも開発しています。`,
    en: `A solo developer who builds everything from frontend to game engines to infrastructure — driven by the desire to create what I personally want to use.

My flagship project is an online battle platform featuring a pure-functional game engine with 152 modules and 11,000+ card definitions. Built full-stack: React + TypeScript frontend, Express + Socket.IO real-time communication, Docker + GitHub Actions CI/CD, and self-hosted deployment via Cloudflare Tunnel.

Recently exploring multi-agent orchestration with Claude Code, designing and operating "one-person operational OS" across multiple domains. Also developing an AI × finance system that structures Japanese bank FX reports with LLMs to auto-generate trading signals.`,
  },
  githubUrl: 'https://github.com/Ryo722',
  email: '793hanachan722@gmail.com',
}
