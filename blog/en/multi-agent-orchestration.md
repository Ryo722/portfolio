---
title: "Building an AI-Powered Operational OS Across 3 Domains with Claude Code"
date: 2026-03-29
tags: [AI, Claude Code, Automation, Multi-Agent, takt]
excerpt: "Designing and operating AI-powered operational OS across 3 domains — novel publishing, VTuber agency, and SNS monetization — using Claude Code's agent and skill system."
---

# Building an AI-Powered Operational OS Across 3 Domains with Claude Code

## Three Operational OSes

I'm building and running operational OSes for three distinct domains, all powered by Claude Code's agent and skill architecture.

| OS | Domain | Agents | Skills | Commands |
|---|---|---|---|---|
| NanyaKanya | Novel publishing | 8 | 40 | 15 |
| KomoriAmado | VTuber agency | 11 | 13 | 14 |
| ryu-ailab-business | SNS monetization | 0 (skill-centric) | 11 | 0 (takt automation) |

I call these "operational OSes" because agents and skills within a single repository drive the entire business workflow — from planning to production, review, publishing, and analytics. The human's role is to set direction and give final approval. Everything else runs autonomously.

## Why "OS-ify" at All?

The motivation was straightforward: running three domains solo is physically impossible.

Writing novels while planning VTuber stream content while managing SNS posting schedules — each with its own quality standards, rights checks, and pre-publish reviews. Do all of that manually, and something inevitably slips through the cracks.

So I decomposed each domain's operations into agents (decision-making) and skills (execution). Routine tasks run automatically; only decisions requiring judgment get escalated to the human.

## Design Principles for Agents and Skills

Three principles are shared across all three OSes.

**Agents only make decisions. Execution is delegated to skills.**

In NanyaKanya, the studio-ceo (agent) decides "what should happen next" and delegates the actual work to nk-prose-writer (skill) or nk-reviewer (skill). Agents judge. Skills do the work. This clean separation makes it easy to swap or add roles.

**Skills follow a 3-layer structure.**

```
skills/
└── nk-prose-writer/
    ├── SKILL.md         # Entry point (what to do and how)
    ├── references/      # Reference materials (criteria, guidelines)
    └── examples/        # Concrete examples (OK/NG patterns)
```

SKILL.md is the procedure, references provide judgment criteria, and examples show concrete cases. With these three layers, the AI can execute work at a consistent quality level.

**Different domains, same structure.**

Whether it's novels, VTuber content, or SNS — the operational structure is "plan, produce, review, publish." Only the content of each step differs. The OS skeleton (agents / skills / gates / commands) stays the same; only the domain-specific skill content gets swapped in.

## 5-Gate Quality Model

All three OSes share a 5-stage quality gate system.

```
1. Brand Gate       — Brand consistency (automated)
2. T&S Gate         — Safety review (automated + human judgment)
3. Rights Gate      — Rights & legal review (automated + human judgment)
4. QC Gate          — Quality inspection (automated)
5. Publish Gate     — Final publish approval (human required)
```

Rather than "building quality in upstream (during production)," the design "passes gates downstream (before publishing)." The AI writes freely during production, and the gates verify whether standards are met before anything goes live.

In NanyaKanya, each novel chapter must pass all five gates before publication. Brand Gate checks for prohibited expressions, T&S Gate determines whether trigger warnings are needed, and Rights Gate verifies copyright compliance.

In KomoriAmado, the same five gates apply to streams and video content. The audio-visual rights check (`audio-visual-rights-check`) is particularly notable — it automatically verifies usage permissions for BGM, sound effects, and game footage.

## Each OS Has Its Own Character

The skeleton is shared, but each OS has a distinct personality.

### NanyaKanya — 40 Skills, Built for Creative Writing

The most mature of the three as a novel publishing OS, refined over 98 commits.

What stands out is the creative writing-specific skill set: `nk-prose-writer` (drafting), `nk-dialogue` (dialogue writing), `nk-character-design` (character design), `nk-metaphor-system` (metaphor system design) — specialized skills for each stage of novel production.

On the quality side, `nk-interest` (engagement diagnostics) is particularly interesting. It analyzes manuscripts along three dimensions — deviation from expectations, physicality, and perception of change — to suggest improvements that increase "experience density." Quality is measured not just by "is it correct?" but "is it compelling?"

### KomoriAmado — 11 Agents, Organizational Structure

As a VTuber agency OS, it has the most agents (11). Chief of Staff, Talent Manager, Content Strategist, Legal & Rights Officer — a real agency org chart mapped directly to agents.

What's distinctive is the emphasis on safety operations. The Trust & Safety Officer (agent) handles all moderation decisions, and the `brand-guard` skill automatically verifies tone across all content. VTuber activities happen in real-time, and retracting published content is difficult. That's why pre-publish safety checks get the most robust design.

### ryu-ailab-business — Fully Automated with takt

The SNS monetization OS has the highest degree of automation among the three. No agents — just 11 skills and 4 workflows powered by takt (a multi-agent orchestration engine).

```
/ceo "Plan this week's note article"
  -> Instruction analysis -> Task decomposition -> Parallel delegation (researcher + note-manager)
  -> Review -> Integration -> Logging
```

Just issue an instruction to the CEO skill, and analysis, delegation, execution, review, integration, and logging all run automatically. The human only does the final check. Built under a 30-day MVP constraint, the design is deliberately optimized to minimize the number of human decisions.

## Automation Deepens Incrementally

Comparing the three OSes reveals a progressive deepening of automation.

```
NanyaKanya (2026-01~):    Manual command-driven     Automation 40%
KomoriAmado (2026-03~):   Agent-driven decisions    Automation 60%
ryu-ailab (2026-03~):     Full takt automation      Automation 90%
```

This is intentional.

NanyaKanya started with manual workflows to identify through real operations what's routine and what requires judgment. Those insights fed into KomoriAmado, expanding the scope of agent-driven decisions. ryu-ailab-business incorporated all learnings from the first two and went straight to takt automation from day one.

**Operational experience -> Rule codification -> Automation.** Following this sequence prevents the "automated it but it behaves unexpectedly" failure mode.

## Security Means "Make It Impossible"

A shared security philosophy runs across all three OSes.

Not "confirm every time via approval UI," but "make dangerous operations impossible to execute."

Specifically, an OS/shell wrapper blocks destructive commands (rm -rf, git push --force, etc.), and Git hooks prevent direct pushes to protected branches. Claude itself is designed to "not execute what it judges to be dangerous."

The reasoning: "can't do it at all" is safer than "ask the human each time." No decision fatigue. The system stays safe even while the human sleeps.

## Reflections

Building operational OSes across three different domains has revealed a few things.

**The OS skeleton is reusable.** The 4-component structure of agents / skills / gates / commands is domain-independent. Whether it's novels, VTuber content, or SNS — just mount domain-specific skills onto the same skeleton and it works.

**Manual operations before automation.** Automating immediately means not knowing what should be automated. Run things manually first, identify routine vs. judgment tasks, then automate only the routine ones. This sequence preserves quality.

**One person x AI = a small organization.** Eight agents, 40 skills — all operated by one person. AI handles execution; the human sets direction. When this division is clear, one person can maintain organizational-level quality management.

As a next step, I want to abstract the design patterns accumulated across the three OSes to make expansion into new domains even easier. In fact, this portfolio site itself is being built as the fourth OS.
