---
title: "Inside the Pokemon Champions CLI — @smogon/calc overrides, Nash-equilibrium lineup selection, and a 27-Sprint-immutable 0.0574881158647651"
date: 2026-05-01
tags: [Pokemon, CLI, TypeScript, AI-assisted, Retrospective]
excerpt: "The technical companion to 'I shelved it at 50% win-rate.' Inside the 21-CLI, 3,380-test, Sprint-63.5 build I shipped with Claude — and an honest look at how chasing engineering rigor with an AI partner pushed real-world validation off my radar."
---

# Inside the Pokemon Champions CLI — @smogon/calc overrides, Nash-equilibrium lineup selection, and a 27-Sprint-immutable 0.0574881158647651

The ["tool that auto-generates winning parties"](./pokemon-champions-cli-tried-but-fell-short.md) I wrote about previously looks, from the front, like a 50% win-rate failure story.

The back end is reasonably built out. 21 CLIs, 3,380 tests, taken to Sprint 63.5 alongside Claude. There's a value, `0.0574881158647651` — an IEEE 754 exact double — that **hasn't moved by a single bit across 27 consecutive Sprints**.

This post is about that back end. It's also a record of **how I let engineering rigor accumulate while pushing real-world validation off my radar**. The trap I walked into building with an AI partner, in other words.

## The whole stack in five layers

The tool splits cleanly into five layers.

```
[Data]      season/regulation JSON (usage stats, regulations)
   ↓
[Calc]      @smogon/calc + Champions-specific overrides
   ↓
[Build]     exhaustive / GA optimizer + 4-metric evaluator
   ↓
[Lineup]    lineup-nash (C(6,3)=20 strategies, 20×20 payoff Nash equilibrium)
   ↓
[Session]   session log/stats/insight + meta-divergence
```

There are 21 CLIs, but they compress into 5 categories: build & battle-sim / info / stats view / AP allocation / box-session-data. Every CLI shares the calc and build layers and wears a thin wrapper for its specific purpose.

Dependencies: `@smogon/calc` (MIT) / `commander` (MIT) / `zod` (MIT) / TypeScript (Apache-2.0) / `vitest` (MIT). I deliberately avoided GPL-family licenses — this was built to be distributable as OSS from day one.

## Layering Champions-specific deltas on top of @smogon/calc

Pokemon Champions diverges from the mainline in several rules.

- Level fixed at 50
- IVs fixed at 31
- Instead of EVs, **66 Ability Points (AP) distributed across 6 stats** (each stat ≤ 32)
- Mega Evolution + Terastal + Gigantamax all coexist

I considered forking `@smogon/calc` and editing the core. I didn't, because I wanted to keep dependency updates flowing. If upstream ships a new generation or a base-stat correction, I want to absorb it. Forking turns merge debt into a snowball.

So I went with an **override pattern**. `src/calc/species-overrides.ts` holds the Champions-specific Mega base stats and type deltas, and `resolveSpeciesBaseStats(name, gen)` overlays them on top of the canonical `@smogon/calc` values. The library itself stays untouched.

A representative override case: in Sprint 54.5, "Aegislash's observed stats don't match" surfaced. Investigation confirmed that **`@smogon/calc` itself was already accurate per the mainline Gen6+ spec**. After updating the Attack and Special Attack base stats to the current 140, the plain `floor((140 + 20 + 32) × 1.1) = 211` matched the observation cleanly.

## The 4-metric evaluator and the "shaky foundation" admission

Party evaluation is a weighted sum of four metrics: ace 0.4 / complement 0.25 / wall 0.15 / type-consistency 0.2. Each metric aggregates "for each of the top-30 opponents, does at least one of my 6 take an A-or-better matchup?"

The "93% coverage" number comes from here. Of 30 opponents, ~28 have at least one favorable matchup somewhere in my party.

The number isn't a lie. I cross-checked it many times, and 3,380 tests pass on top of it.

But there's a **fundamental weakness**, and it's worth being honest about.

**All 4 metrics evaluate at the granularity of "1 vs 1" matchups**, then stack to a coverage rate over 6. **The combinatorial reality of "out of 6 vs 6, you each pick 3, then turn order and role-coverage decide the match" is not modeled at the evaluator layer.**

The 50% win-rate from the previous post traces back here. What the foundation measures isn't quite what real matches ask of you.

## Nash-equilibrium lineup selection — clean math, shaky inputs

I did take a separate shot at the combinatorial layer. The `lineup-nash` command.

The logic is simple: choose 3 from your 6 → C(6,3) = 20 strategies, opponent has the same 20. Build a **20 × 20 payoff matrix** where each cell holds "expected win-rate of my 3 against their 3." Solve for mixed-strategy Nash equilibrium and pick accordingly.

This is textbook game theory, so the implementation is direct. I borrowed only the formulation from pkdx (MIT)'s `payoff_semantics.md` — wrote the code independently, no direct copy, with an `Adapted from` header as required.

The problem is **the precision of those 20×20 cells**.

Internally, each cell's expected win-rate comes from `screened-mc` (screened Monte Carlo) and DP-based depth-limited minimax. But the matchup-judgment underneath is, again, the "1 vs 1" stacking from the previous section.

So: **with a shaky foundation, putting clean game theory on top still inherits the foundation's shakiness**. Solving Nash equilibrium is mathematically correct. If the inputs are weak, so is the solution. GIGO isn't a machine learning exclusive.

This is the substance of "the combinatorial modeling is the deepest issue" from the previous post. No matter how clean the upper layer, without fixing the foundation, the work doesn't pay back.

## Operations — Sprint 8-step + Codex two-pass review

Why I leaned this hard on process for a solo project: **I didn't want to be the only one defending my own decisions**.

The 8-step Sprint loop:

1. Write the handoff doc (carry forward from previous Sprint result)
2. Pre-flight 4-check (`npm test` / `tsc` / `git status` / previous Sprint result)
3. Draft plan-input v1 (with Q1-Qn questions for review)
4. **Codex plan review** (strict)
5. Confirmed plan (incorporating accepted feedback)
6. Implementation (TDD + Codex-accepted decisions + invariant-9 check at every step)
7. Draft diff-input → **Codex diff review**
8. Fix + result + memory + close commit

Codex acts as an external reviewer (GPT-5/Opus-class), consulted at both plan and diff stages. Sprint 41 through 63.5 totals **27/27 GO-equivalent** (7 pure GOs, with CONDITIONAL GOs immediately remediated to count as GO-equivalent).

Predictably, the NO-GO rounds surfaced **assumptions I couldn't see myself**. Sprint 58: I planned to opaque-pack `stateKey()` as a packed string — Codex flagged that `tests/battle/state-key.test.ts` directly verifies the format with `toContain("tc=3")`. A snapshot update wouldn't be enough.

Claude and I had both missed this. Claude is fast at prototyping and implementing, but **"reading what existing tests guarantee" and "checking whether the plan breaks those guarantees"** are exactly where we both cut corners together if I let it. Adding Codex was the biggest payoff from this discipline.

## Retrospective — what I built too much of with Claude

Everything described above is precision **I only reached because Claude was on the team**. Solo, I would not have built 21 CLIs, or 3,380 tests, or the 27-Sprint invariance discipline. Or if I had, not at this speed.

But the flip side is that **I kept postponing the most important thing**.

Sprint after Sprint, `npm test` went green, Codex returned GO, the deterministic value didn't budge. All the indicators moved in good directions. Without realizing it, I was thinking **"with this much quality stacked, surely it'll win in real matches."**

I took it to actual battle long after the tool reached an MVP threshold. When 30-ish matches landed me at 50% win-rate, my honest reaction was: I should have started battling much sooner. I thought I was building "a tool with high precision," when I was actually building **"a tool whose precision indicators move."** Two different things.

The trap of building with Claude is probably right here.

- Speed compounds. **"Does it run / do tests pass / does the reviewer say GO" all line up before the actual value gets validated.**
- The moment they line up, it feels like progress. **"Is this actually working in the real match?" gets asked less often.**
- As a result, **only engineering precision moves forward.**

If I'd added "did I battle this Sprint / how many matches / what was the win-rate" to the Sprint invariants, I'd have caught the drift earlier. Next time I build something with AI, I'll **embed "is this working?" measurement in the very first Sprint**.

## Closing

Parts of this codebase are clean engineering work I'm genuinely proud of. The `@smogon/calc` override pattern, the 20×20 Nash equilibrium, the 8-layer defense, and so on. Each piece, on its own, was fun to build.

As a whole, though, my honest assessment now is: **I kept sharpening the pencil and forgot to write words with it.**

There's no escaping building-with-Claude as a style anymore. Which is exactly why, even while leaning on Claude fully, I want **a separate measurement layer for "is this working?"** baked in from the first commit of the next project.

The tool itself, as the previous post said, is shelved for now. If I find a better foundation for the evaluator, I'll come back to rebuild it.
