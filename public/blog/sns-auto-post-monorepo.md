---
title:
  ja: "pnpm workspace + pg-bossで6アカウントSNS自動投稿を作った"
  en: "Building a 6-account SNS auto-poster with pnpm workspace + pg-boss"
date: 2026-03-29
tags: [TypeScript, Next.js, PostgreSQL, pg-boss, monorepo]
excerpt:
  ja: "X 3アカウント + Threads 3アカウント = 計6つのSNSを予約投稿するシステムを、pnpm monorepo + pg-bossで構築した設計記録。"
  en: "Built a scheduled posting system for 6 SNS accounts (3 X + 3 Threads) using pnpm monorepo + pg-boss."
---

# pnpm workspace + pg-bossで6アカウントSNS自動投稿を作った

## 何を作ったか

X（旧Twitter）3アカウントとThreads 3アカウント、計6つのSNSアカウントの予約投稿を一元管理するシステムを作った。

管理画面で投稿を作成・承認すると、指定した日時に自動投稿される。投稿後にリプライを自動追加する機能もある。

## なぜ monorepo にしたか

このシステムには3つの異なる実行環境がある。

- **管理画面**（Next.js）— ブラウザで動く
- **ジョブワーカー**（Node.js）— バックグラウンドで動く
- **DB定義**（Prisma）— 両方から参照される

これらが同じ型定義、同じDBスキーマ、同じバリデーションロジックを共有する必要がある。別リポジトリにすると型の同期が地獄になる。pnpm workspace で1リポジトリに閉じた。

```
apps/
├── web/           # Next.js 15 管理画面
└── worker/        # pg-boss ジョブワーカー
packages/
├── db/            # Prisma スキーマ + クライアント
├── providers/     # SNS Publisher 実装
└── shared/        # 共通型 / Zod schema / 定数
```

`packages/db` でPrismaスキーマを定義し、`apps/web` と `apps/worker` の両方から `@social-orchestrator/db` として参照する。型の不整合が起きない。

## pg-boss を選んだ理由

予約投稿の実行には非同期ジョブキューが必要だ。選択肢としてBullMQ（Redis）、AWS SQS、pg-bossを検討した。

pg-bossを選んだ理由は**PostgreSQL だけで完結する**からだ。

BullMQはRedisサーバーが必要。SQSはAWSアカウントが必要。pg-bossはPostgreSQLのテーブルをキューとして使うので、既にDBがあれば追加のインフラは不要。個人開発でインフラを増やしたくなかった。

## 承認フローとジョブ発行

投稿のライフサイクルは以下の通り。

```
DRAFT → APPROVED → SCHEDULED → DISPATCHING → POSTED
                                          └→ FAILED
                                          └→ NEEDS_REVIEW
```

管理画面で投稿を承認すると、Web側がpg-bossにジョブを登録する。

```typescript
await publishJob(
  JOBS.PUBLISH_POST,
  { postId: id },
  { startAfter: delaySec, singletonKey: id }
);
```

`startAfter` でスケジュール時刻を指定し、`singletonKey` で同一投稿の重複ジョブを防止する。

Worker側はpg-bossからジョブを取り出して実行する。

```typescript
await boss.work(JOBS.PUBLISH_POST, { batchSize: 1 }, async (jobs) => {
  for (const job of jobs) {
    await handlePublishPost(job, boss);
  }
});
```

## 6アカウント並列投稿の排他制御

6つのアカウントが同時に投稿する場合、同一アカウントの投稿が並列で走ると問題が起きる。APIのレートリミットに引っかかったり、投稿順序が入れ替わったりする。

PostgreSQLの Advisory Lock でアカウント単位の排他制御を実装した。

```typescript
const lockKey = hashToInt(post.account.key);
const locked = await prisma.$queryRaw`
  SELECT pg_try_advisory_lock(${lockKey}) as locked
`;
```

アカウントのキーをハッシュ化して整数に変換し、Advisory Lock のキーにする。同一アカウントの投稿は直列化され、異なるアカウントの投稿は並列で走る。

## 曖昧な結果への対応

SNS APIは「成功したかどうかわからない」ケースがある。タイムアウトしたが実際には投稿されていた、という状況だ。

このケースを `AMBIGUOUS` として明示的に扱い、自動再試行をしない設計にした。

```typescript
if (result.ambiguous) {
  await prisma.post.update({
    data: { status: "NEEDS_REVIEW", reviewReason: "Ambiguous publish result" }
  });
}
```

`NEEDS_REVIEW` ステータスにして人間に判断を委ねる。二重投稿よりも、人間確認の方がはるかに安全だ。

## リプライの遅延スケジュール

投稿直後にリプライをぶら下げるのではなく、指定した分数だけ遅延させてリプライを投稿する機能がある。エンゲージメントを時間的に分散させるためだ。

```typescript
const replyScheduledAt = new Date(
  publishedAt.getTime() + reply.delayMin * 60 * 1000
);
```

投稿が公開された時刻に `delayMin` を加算し、その時刻にリプライ用のジョブをpg-bossに登録する。

## SNS Provider の抽象化

X API と Threads API はインターフェースが異なるが、Publisherインターフェースで統一した。

```typescript
interface SocialPublisher {
  publishPost(input: PublishPostInput): Promise<PublishPostResult>;
  publishReply(input: PublishReplyInput): Promise<PublishReplyResult>;
}
```

X用（XPublisher）、Threads用（ThreadsPublisher）、テスト用（MockPublisher）がこのインターフェースを実装する。Worker側はどのSNSかを意識せず、Publisherを呼び出すだけでよい。

## 振り返り

14コミットで、承認フロー付きの6アカウントSNS予約投稿システムが動くようになった。

**pg-boss の実用性**。PostgreSQLだけで非同期ジョブキューが動くのは個人開発にとって大きい。RedisもSQSも不要。スケジュール実行、リトライ、重複防止がライブラリの機能として提供される。

**monorepo の型共有**。pnpm workspace で `packages/db` を共有することで、Web と Worker の間で型の不整合が一切起きない。Prismaの型がそのまま両方で使える。

**「曖昧な結果」を設計に組み込む**。外部APIとの連携では「成功か失敗かわからない」ケースが必ず発生する。これを `AMBIGUOUS` → `NEEDS_REVIEW` として設計に組み込んだことで、二重投稿事故を防げている。
