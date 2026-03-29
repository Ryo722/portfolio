---
title: "Building a 6-Account SNS Auto-Poster with pnpm Workspace + pg-boss"
date: 2026-03-29
tags: [TypeScript, Next.js, PostgreSQL, pg-boss, monorepo]
excerpt: "Built a scheduled posting system for 6 SNS accounts (3 X + 3 Threads) using pnpm monorepo + pg-boss."
---

# Building a 6-Account SNS Auto-Poster with pnpm Workspace + pg-boss

## What I Built

A centralized scheduled posting system for six SNS accounts — three on X (formerly Twitter) and three on Threads.

Create and approve posts in the admin dashboard, and they're automatically published at the specified time. There's also an auto-reply feature that appends replies after the initial post.

## Why a Monorepo

This system has three distinct runtime environments:

- **Admin dashboard** (Next.js) — runs in the browser
- **Job worker** (Node.js) — runs in the background
- **DB definitions** (Prisma) — referenced by both

These need to share the same type definitions, DB schema, and validation logic. Separate repositories would turn type synchronization into a nightmare. pnpm workspace keeps everything in one repo.

```
apps/
├── web/           # Next.js 15 admin dashboard
└── worker/        # pg-boss job worker
packages/
├── db/            # Prisma schema + client
├── providers/     # SNS Publisher implementations
└── shared/        # Shared types / Zod schemas / constants
```

`packages/db` defines the Prisma schema, and both `apps/web` and `apps/worker` reference it as `@social-orchestrator/db`. Type mismatches are eliminated.

## Why pg-boss

Scheduled posting requires an async job queue. The candidates: BullMQ (Redis), AWS SQS, and pg-boss.

pg-boss won because **it runs on PostgreSQL alone.**

BullMQ needs a Redis server. SQS needs an AWS account. pg-boss uses PostgreSQL tables as a queue, so if you already have a database, no additional infrastructure is required. For a solo project, keeping the infrastructure footprint small matters.

## Approval Flow and Job Dispatch

A post's lifecycle:

```
DRAFT -> APPROVED -> SCHEDULED -> DISPATCHING -> POSTED
                                            └-> FAILED
                                            └-> NEEDS_REVIEW
```

When a post is approved in the admin dashboard, the web app registers a job with pg-boss:

```typescript
await publishJob(
  JOBS.PUBLISH_POST,
  { postId: id },
  { startAfter: delaySec, singletonKey: id }
);
```

`startAfter` specifies the scheduled time, and `singletonKey` prevents duplicate jobs for the same post.

The worker picks up and executes jobs from pg-boss:

```typescript
await boss.work(JOBS.PUBLISH_POST, { batchSize: 1 }, async (jobs) => {
  for (const job of jobs) {
    await handlePublishPost(job, boss);
  }
});
```

## Mutual Exclusion for 6-Account Parallel Posting

When six accounts post simultaneously, parallel posts from the same account cause problems — API rate limits get hit, or post ordering gets scrambled.

PostgreSQL Advisory Locks provide per-account mutual exclusion:

```typescript
const lockKey = hashToInt(post.account.key);
const locked = await prisma.$queryRaw`
  SELECT pg_try_advisory_lock(${lockKey}) as locked
`;
```

The account key is hashed to an integer and used as the Advisory Lock key. Posts from the same account are serialized; posts from different accounts run in parallel.

## Handling Ambiguous Results

SNS APIs sometimes produce "can't tell if it succeeded" outcomes. A request times out, but the post was actually published.

This case is explicitly modeled as `AMBIGUOUS`, with no automatic retry:

```typescript
if (result.ambiguous) {
  await prisma.post.update({
    data: { status: "NEEDS_REVIEW", reviewReason: "Ambiguous publish result" }
  });
}
```

It transitions to `NEEDS_REVIEW` and defers to human judgment. A human check is far safer than a duplicate post.

## Delayed Reply Scheduling

Rather than posting replies immediately after the parent post, replies can be delayed by a specified number of minutes. This spreads engagement over time.

```typescript
const replyScheduledAt = new Date(
  publishedAt.getTime() + reply.delayMin * 60 * 1000
);
```

The delay in minutes is added to the parent post's publish time, and a reply job is registered with pg-boss at that resulting timestamp.

## SNS Provider Abstraction

The X API and Threads API have different interfaces, but they're unified behind a Publisher interface:

```typescript
interface SocialPublisher {
  publishPost(input: PublishPostInput): Promise<PublishPostResult>;
  publishReply(input: PublishReplyInput): Promise<PublishReplyResult>;
}
```

XPublisher (for X), ThreadsPublisher (for Threads), and MockPublisher (for testing) all implement this interface. The worker doesn't need to know which platform it's posting to — it just calls the Publisher.

## Reflections

In 14 commits, a 6-account SNS scheduled posting system with an approval flow was up and running.

**pg-boss is practical.** Having an async job queue that runs on PostgreSQL alone is significant for solo projects. No Redis, no SQS. Scheduled execution, retries, and deduplication come as library features.

**Monorepo type sharing.** Sharing `packages/db` via pnpm workspace means zero type mismatches between Web and Worker. Prisma types flow directly to both.

**Designing for "ambiguous results."** When integrating with external APIs, "can't tell if it succeeded or failed" scenarios are inevitable. Modeling this explicitly as `AMBIGUOUS` -> `NEEDS_REVIEW` has prevented duplicate post incidents.
