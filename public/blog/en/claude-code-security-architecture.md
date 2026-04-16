---
title: "Designing Multi-Layered Security for Claude Code"
date: 2026-04-16
tags: [Security, AI, Claude Code, DevSecOps, Automation]
excerpt: "Working with AI made me realize how scary secret handling can be. Instead of relying on approval dialogs, I designed multi-layered defenses with AI that stay safe without human attention."
---

# Designing Multi-Layered Security for Claude Code

## What Scared Me

One day, while developing with Claude Code, I got scared.

AI can read files. Execute commands. Communicate over the network. Operate version control. In other words, it has the ability to access secrets and send them externally.

Claude Code does have an approval UI. It asks "Allow this?" before each operation. At first, I checked carefully. But when I was deep in development, I started reflexively clicking "yes." One day I noticed I'd been rubber-stamping approvals without reading them.

The approval UI depends on human attention. Attention is a finite resource — it depletes most when you're focused. Relying on it felt dangerous.

What I needed was a system that stays safe even when I'm not paying attention.

## Starting from "Don't Trust Yourself"

Working with Claude Code, I shaped the design direction.

First, reject any operation not explicitly permitted (deny-by-default). Fall to the safe side on any anomaly (fail-closed). And if one defense breaks, the next one stops it (defense-in-depth).

What I cared about most was the fool-proof concept — security holds automatically no matter what humans do. Not "check a list every time," but "the system protects on its own." A design that doesn't trust my own attention.

## The Multi-Layer Overview

I designed defense layers by working backward from a threat model.

```
Filesystem Permissions    — OS-level protection for secret files
AI Policy                 — Behavioral guidelines defined in prompts
Permission Deny Rules     — Block dangerous operations at runtime
Pre-Execution Hooks       — Detect and reject secret patterns before execution
Supply Chain Protection   — Pin external dependency versions + periodic audits
Git Hooks                 — Secret scanning and branch protection at commit/push
Post-Execution Auditing   — Command logging with automatic redaction
Secret Management         — OS-level secret store and environment isolation
Environment Isolation     — Physical separation of workspace and secret storage
Scheduled Audit Automation — Log rotation and periodic audits
On-Demand Audits          — Parallel inspection by multiple specialist agents
```

This wasn't the starting point. As I'll describe later, it grew incrementally.

### How I Thought About Threats

I mapped out the paths through which secrets could leak.

The main threats are direct access to secret files, indirect access through alternative execution paths, and exfiltration of acquired secrets to external destinations.

Multiple layers overlap for each threat. If one layer is breached, the next one stops it. That's the defense-in-depth concept.

Layer roles split into four phases: **prevention**, **detection**, **logging**, and **auditing**. Prevention is the thickest. "Don't let it execute at all" is safer than "detect and notify."

## What I Struggled With and Learned

### The Rule Count Exploded

I initially thought blocking dangerous commands would be enough.

I was wrong. Writing out the threat model revealed that files potentially containing secrets are far more numerous than expected. And the same file needs deny rules for each access path — direct reads, indirect execution, searches, directory listings. Different methods need different rule syntax.

The count grew far beyond what I imagined. Between "I want fewer rules" and "a gap means game over," I sided with the threat model.

### Fail-Closed Was Painful at First

I designed every hook to deny on any anomaly.

```
Any abnormal condition   → Deny
Check failed             → Deny
All checks passed        → Allow (the only path to approval)
```

Right after deployment, false positives blocked legitimate work. Honestly, it was frustrating.

But the cost of a false positive (work paused) versus the cost of a secret leak — they're not comparable. False positives are "safe-side failures." Once I accepted that framing, the stress went away. Hook accuracy improves over time through use.

### Keeping Secrets Off the Filesystem

There are several approaches to secret management: hardcoding in config files, environment variables with external directory references, or OS-level secret stores.

For high-risk projects, I chose an OS-level secret store. Secrets never persist on the filesystem, which eliminates the risk of leaks through AI file access or Git operations by design.

Setup is more complex, but "secrets don't exist as files" is a powerful state. There's nothing to leak.

For development projects, I combine automatic environment variable injection with external directory references. I balance convenience and safety by matching the approach to each project's risk level.

## Automating Away Self-Trust

Security doesn't maintain itself through design alone. It needs mechanisms that keep running.

### Automatic Validation at Session Start

Every development session begins with an automatic check of the security infrastructure. Workspace constraints, secret scanning tool availability, secret management status — all verified automatically.

A manual "check the list every morning" routine would break down in three days, knowing my personality. So I handed it to the system.

### Periodic Automated Audits

Audit log rotation and external dependency audits run automatically on a schedule. No human intervention required. Whether I forget or take a day off, safety holds.

### Parallel Agent Audits

Before PRs or after major changes, multiple specialist agents run audits in parallel. They check from multiple angles simultaneously — secret contamination, vulnerability patterns, dependency risks, and more.

This leverages Claude Code's multi-agent capabilities. Sequential audits take too long; parallel execution makes deep audits fast. It feels like running security as a team with AI.

## Knowing the Limits

This design isn't bulletproof.

Automated detection has inherent theoretical limits. Multiple detection methods are layered to compensate, but not every case can be caught.

The primary goal is automatically preventing secret leaks during everyday development. Multi-layer defense makes circumvention difficult too, but it doesn't anticipate every possible attack scenario.

The rules and hooks carry setup and maintenance costs. This scale isn't for every developer — it's a judgment call based on the number and nature of projects handling secrets.

Knowing the limits and using it anyway. I think that stance matters.

## Reflections

### Security I Grew

I didn't design all layers at once.

First, I just restricted file permissions. Then I manually added deny rules. Added pattern detection hooks, automated periodic audits, and grew layers step by step.

As I wrote in [Building AI-Powered Operational OS](/portfolio/blog/en/multi-agent-orchestration.md), the order of **operations → rules → automation** is important. Automating from scratch means you don't know what to automate. Feel the pain manually first, then systematize it.

Security was the same. If I hadn't felt that initial fear, I wouldn't have stacked this many layers.

### Keep Asking "What's Dangerous"

Writing threat models directly became the criteria for "what should be permitted."

Eliminate ambiguous permissions. Keep only explicit ones. I've found this thinking useful beyond security — in API design, data flow design, and more.

Security for AI coding assistants is still a field with few established practices. I don't know if this design is the right answer. But I believe the principle of "not trusting my own attention" will keep mattering as we develop alongside AI.
