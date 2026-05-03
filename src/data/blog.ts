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
    enUrl: '/portfolio/blog/en/building-game-engine.md',
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
    enUrl: '/portfolio/blog/en/multi-agent-orchestration.md',
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
    enUrl: '/portfolio/blog/en/zero-trust-home-server.md',
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
    enUrl: '/portfolio/blog/en/canvas-rendering-engine.md',
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
    enUrl: '/portfolio/blog/en/sns-auto-post-monorepo.md',
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
    enUrl: '/portfolio/blog/en/portfolio-with-ai.md',
  },
  {
    slug: 'llm-fx-pipeline',
    title: {
      ja: 'LLMで銀行レポートを構造化する — M4FXのパイプライン設計',
      en: 'Structuring bank reports with LLMs — M4FX pipeline design',
    },
    date: '2026-03-29',
    tags: ['AI', 'LLM', 'Python', 'PostgreSQL', 'Finance'],
    excerpt: {
      ja: '邦銀FXレポートをLLMで構造化し毎朝シグナルを自動生成。6つのプロンプトと3つの時間帯パイプライン、キャッシュ戦略の設計記録。',
      en: 'Structuring bank FX reports with LLMs for daily signal generation. 6 prompts, 3 time-zone pipelines, and caching strategy.',
    },
    url: '/portfolio/blog/llm-fx-pipeline.md',
    enUrl: '/portfolio/blog/en/llm-fx-pipeline.md',
  },
  {
    slug: 'notion-journal-automation',
    title: {
      ja: 'ChatGPT音声入力 → Notion自動追記の半自動ジャーナルを作った',
      en: 'Building a semi-automated journal: ChatGPT voice → Notion',
    },
    date: '2026-03-29',
    tags: ['Automation', 'Shell Script', 'Notion API', 'Productivity'],
    excerpt: {
      ja: '音声入力をChatGPTで整理し、シェルスクリプト350行でNotionに自動追記。3層スクリプト設計で保守性を確保した話。',
      en: 'Voice input → ChatGPT → Notion auto-append in 350 lines of shell scripts. 3-layer script design for maintainability.',
    },
    url: '/portfolio/blog/notion-journal-automation.md',
    enUrl: '/portfolio/blog/en/notion-journal-automation.md',
  },
  {
    slug: 'usereducer-game-state',
    title: {
      ja: 'useReducerでゲーム状態管理を設計する',
      en: 'Designing game state management with useReducer',
    },
    date: '2026-03-29',
    tags: ['React', 'TypeScript', 'useReducer', 'Game Development'],
    excerpt: {
      ja: 'スライドパズル×マッチ3ゲームの状態管理。13アクション型、408行の純粋ロジック層、アニメーション制御をuseReducerで設計した記録。',
      en: '13 action types, 408 lines of pure logic, animation phase control — designing game state with useReducer.',
    },
    url: '/portfolio/blog/usereducer-game-state.md',
    enUrl: '/portfolio/blog/en/usereducer-game-state.md',
  },
  {
    slug: 'oss-contribution-process',
    title: {
      ja: '手元のフォーク変更をOSSコントリビュートに昇格させた全過程',
      en: 'Turning local fork changes into proper OSS contributions',
    },
    date: '2026-03-29',
    tags: ['OSS', 'Git', 'Code Review', 'AI', 'Python'],
    excerpt: {
      ja: '4つのAI音声・映像系リポジトリの手元変更を精査し、個人設定を除去、破壊的変更を分離、PR品質に引き上げた過程の記録。',
      en: 'Auditing local changes across 4 AI voice/video repositories — removing personal config, isolating breaking changes, and elevating to PR quality.',
    },
    url: '/portfolio/blog/oss-contribution-process.md',
    enUrl: '/portfolio/blog/en/oss-contribution-process.md',
  },
  {
    slug: 'cafenavi-coffee-diagnosis',
    title: {
      ja: 'コサイン類似度で「あなたに合うコーヒー」を提案するアプリを作った',
      en: 'Building a coffee recommender app with cosine similarity matching',
    },
    date: '2026-03-30',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Vitest', 'Playwright'],
    excerpt: {
      ja: '25種のコーヒー豆を10軸のフレーバースコアで定量化し、コサイン類似度でマッチング。診断→比較→統計まで、フロントエンドだけで完結するアプリをAIと作った記録。',
      en: '25 coffee beans quantified across 10 flavor axes, matched via cosine similarity. A fully client-side app with diagnosis, comparison, and stats — built with AI.',
    },
    url: '/portfolio/blog/cafenavi-coffee-diagnosis.md',
    enUrl: '/portfolio/blog/en/cafenavi-coffee-diagnosis.md',
  },
  {
    slug: 'easypngtuber-contribution',
    title: {
      ja: 'PNGTuberツールに3つの改善をコントリビュートした',
      en: 'Contributing 3 improvements to a PNGTuber tool',
    },
    date: '2026-03-30',
    tags: ['OSS', 'Python', 'PySide6', 'OpenCV', 'Performance'],
    excerpt: {
      ja: 'EasyPNGTuberに依存関係の最適化・macOS HiDPI対応・位置合わせの並列化を3ブランチに分けてコントリビュート。マルチプロセッシングで2-3倍の高速化を実現。',
      en: 'Three contributions to EasyPNGTuber: dependency optimization, macOS HiDPI support, and parallelized alignment with multiprocessing for 2-3x speedup.',
    },
    url: '/portfolio/blog/easypngtuber-contribution.md',
    enUrl: '/portfolio/blog/en/easypngtuber-contribution.md',
  },
  {
    slug: 'torabo-tsuki-case',
    title: {
      ja: 'torabo-tsuki LP XSのケースをBlender MCPで自作した話',
      en: 'Building a Custom Case for torabo-tsuki LP XS with Blender MCP',
    },
    date: '2026-04-13',
    tags: ['自作キーボード', '3Dプリント', 'Blender', 'AI'],
    excerpt: {
      ja: 'キーケット2026で購入したtorabo-tsuki LP XS用に、チルトスタンド対応・マグネット接続のケースをBlender MCPで設計し、3Dプリントした制作記録。',
      en: 'A build log of designing a custom case with tilt stand support and magnetic connection for the torabo-tsuki LP XS split keyboard, using Blender MCP and 3D printing.',
    },
    url: '/portfolio/blog/torabo-tsuki-case.md',
    enUrl: '/portfolio/blog/en/torabo-tsuki-case.md',
  },
  {
    slug: 'torabo-tsuki-keymap',
    title: {
      ja: 'torabo-tsuki LP XSのキーマップを育てている話',
      en: 'Growing My Keymap for the torabo-tsuki LP XS',
    },
    date: '2026-04-15',
    tags: ['自作キーボード', 'ZMK', 'キーマップ', 'AI'],
    excerpt: {
      ja: 'torabo-tsuki LP XSのZMKキーマップを14回チューニングして現在の形にするまでの記録。hold-tapの調整、コンボ、レイヤー設計の試行錯誤。',
      en: 'A record of 14 tuning iterations on the torabo-tsuki LP XS ZMK keymap — hold-tap timing, combos, layer design, and the trial-and-error process.',
    },
    url: '/portfolio/blog/torabo-tsuki-keymap.md',
    enUrl: '/portfolio/blog/en/torabo-tsuki-keymap.md',
  },
  {
    slug: 'claude-code-security-architecture',
    title: {
      ja: 'Claude Codeに多層のセキュリティを設計した話',
      en: 'Designing Multi-Layered Security for Claude Code',
    },
    date: '2026-04-16',
    tags: ['Security', 'AI', 'Claude Code', 'DevSecOps', 'Automation'],
    excerpt: {
      ja: 'AIと開発していたら、秘密情報の扱いが怖くなった。承認UIを押す注意力に頼るのをやめて、人間が何もしなくても安全が保たれる多層防御をAIと一緒に設計した記録。',
      en: 'Working with AI made me realize how scary secret handling can be. Instead of relying on approval dialogs, I designed multi-layered defenses with AI that stay safe without human attention.',
    },
    url: '/portfolio/blog/claude-code-security-architecture.md',
    enUrl: '/portfolio/blog/en/claude-code-security-architecture.md',
  },
  {
    slug: 'pokemon-champions-cli-tried-but-fell-short',
    title: {
      ja: '「勝てるパーティを自動で出すツール」を作ってみたら、勝率5割で寝かせることにした話',
      en: "I built a 'tool that auto-generates winning parties' for Pokemon Champions — and shelved it at 50% win-rate",
    },
    date: '2026-05-01',
    tags: ['Pokemon', 'CLI', 'AI', '振り返り'],
    excerpt: {
      ja: '上位30匹に勝てる6匹を自動で出す個人ツールを作った。カバー率93%のパーティが出てきて満足していたら、実戦に持ち込んだ瞬間に5割で詰まった。何がうまくいかなかったかの振り返り。',
      en: 'I built a personal tool that auto-generates 6-Pokemon parties to beat the top-30 metagame. The 93% coverage parties looked great — until I actually used them and got stuck at a 50% win-rate. A retrospective on what didn\'t work.',
    },
    url: '/portfolio/blog/pokemon-champions-cli-tried-but-fell-short.md',
    enUrl: '/portfolio/blog/en/pokemon-champions-cli-tried-but-fell-short.md',
  },
  {
    slug: 'pokemon-champions-cli-tech-deep-dive',
    title: {
      ja: 'ポケモンチャンピオンズCLIの裏側 — @smogon/calc差分・Nash均衡選出・技術的精度を積みすぎた反省',
      en: 'Inside the Pokemon Champions CLI — @smogon/calc overrides, Nash-equilibrium lineup selection, and the trap of over-engineering with AI',
    },
    date: '2026-05-01',
    tags: ['TypeScript', 'CLI', 'Pokemon', 'Architecture', 'AI開発'],
    excerpt: {
      ja: '前作「勝率5割で寝かせた話」の続編・技術編。21 CLI / 3,380テスト / Sprint 63.5 までClaudeと一緒に積み上げた裏側と、技術的精度ばかり詰めて実戦での有効性検証を後回しにしてしまった反省。',
      en: 'The technical companion to "I shelved it at 50% win-rate." Inside the 21-CLI, 3,380-test, Sprint-63.5 build I shipped with Claude — and an honest look at how chasing engineering rigor with an AI partner pushed real-world validation off my radar.',
    },
    url: '/portfolio/blog/pokemon-champions-cli-tech-deep-dive.md',
    enUrl: '/portfolio/blog/en/pokemon-champions-cli-tech-deep-dive.md',
  },
  {
    slug: 'youtube-period-sorter',
    title: {
      ja: 'YouTubeの「期間×人気順」が公式にないので、自分用のChrome拡張を作った',
      en: 'YouTube has no "period × popularity" filter — so I built my own Chrome extension',
    },
    date: '2026-05-03',
    tags: ['Chrome Extension', 'JavaScript', 'YouTube API', 'Security Review'],
    excerpt: {
      ja: '好きなチャンネルの「最近の代表作だけ人気順で見たい」がYouTube公式UIではできない。空白を埋めるためのChrome拡張をMV3で作り、Claude × Codexの敵対的セキュリティレビューを通してWeb Store公開した記録。',
      en: 'YouTube\'s native UI can\'t show "recent hits sorted by views" for a channel. I built an MV3 Chrome extension to fill that gap, and shipped it to the Web Store after an adversarial security review by Claude × Codex.',
    },
    url: '/portfolio/blog/youtube-period-sorter.md',
    enUrl: '/portfolio/blog/en/youtube-period-sorter.md',
  },
  {
    slug: 'youtube-period-sorter-pwa',
    title: {
      ja: 'Chrome拡張をPWA化してスマホ対応した話 — 同一コードを拡張とPWAで共有する',
      en: 'Shipping a Chrome extension as a PWA — sharing the same lib/ between both surfaces',
    },
    date: '2026-05-03',
    tags: ['PWA', 'Chrome Extension', 'Service Worker', 'JavaScript', 'Web Share Target'],
    excerpt: {
      ja: 'Chrome Web Store公開後の課題は「スマホで使えない」だった。同じlib/を拡張版とPWA版で共有するため、chrome.* 依存をplatform/backendレイヤに分離して、同一コードベースから2系統のビルドを出せるようにした記録。',
      en: 'After shipping the Chrome extension, my biggest gap was "I can\'t use it on my phone." I split chrome.* dependencies into platform / backend layers so the same lib/ powers both the extension and a PWA — one codebase, two distributions.',
    },
    url: '/portfolio/blog/youtube-period-sorter-pwa.md',
    enUrl: '/portfolio/blog/en/youtube-period-sorter-pwa.md',
  },
]
