---
title: "I built a 'tool that auto-generates winning parties' for Pokemon Champions — and shelved it at 50% win-rate"
date: 2026-05-01
tags: [Pokemon, CLI, Tool, AI, Retrospective]
excerpt: "I built a personal tool that auto-generates 6-Pokemon parties to beat the top-30 metagame. The 93% coverage parties looked great — until I actually used them and got stuck at a 50% win-rate. A retrospective on what didn't work."
---

# I built a "tool that auto-generates winning parties" for Pokemon Champions — and shelved it at 50% win-rate

I built a personal tool for Pokemon Champions that auto-generates 6 Pokemon "guaranteed" to beat the top-30 metagame.

Underneath, it sweeps hundreds of billions of combinations via exhaustive search and genetic algorithms, scoring them with "coverage rate," "score," and "tactical strategy" attached. One command and you get candidates with 93% coverage. The first time I saw the output, I genuinely thought "I'll never have to agonize over team-building again."

The moment I took it into actual matches, reality disagreed. **50% win-rate.** Not noticeably better than what I'd build by hand.

This is the record of how that didn't work.

## What I was trying to build (briefly)

In one line:

> **A tool that gives you a 6-Pokemon party with an advantage against the top-30 metagame, in a single command.**

The damage-calculation base is `@smogon/calc` (MIT) with Pokemon Champions–specific rules layered on (Lv50 fixed, IV 31 fixed, 66-pt AP allocation, Mega + Terastal + Gigantamax coexisting). The evaluation function uses 4 metrics: coverage, battle resilience, type spread, speed distribution. Optimization is exhaustive search + genetic algorithm.

5 feature categories, 21 CLIs total. A separate technical write-up will go into the architecture.

## The output "sets" themselves were already off

Even before taking parties into matches, looking at the output revealed weirdness.

### Example 1: Modest-nature Dragonite holding Dragon Dance

"Modest" is a special-attack-boosting nature. "Dragon Dance" is a physical-attack + speed setup move — pure physical-attacker territory. **A physical setup move handed to a special-nature Pokemon** — a combination no human player would ever pick, served up confidently.

The machine correctly identifies that "Dragon Dance is a popular move," "Dragonite is a popular Pokemon," and "Modest is a popular nature." But **it never checks whether the three combine into a coherent set**. It just assembles popular elements per axis, independently.

### Example 2: Multiple Pokemon holding the same item

Pokemon battle rules: **each item can only appear once in a party**. This is a fundamental constraint.

Yet candidates routinely showed up with two Pokemon holding Choice Scarf, three holding Lum Berry. The `build` output's lint at the end raises a `[double-scarf]` warning, but **the candidate generation itself doesn't exclude these upstream**. It's a "lint catches it later" design.

This is a question of design priority. I built "generate lots of popular combinations fast" first and bolted on "satisfy rules" afterwards. The order should have been the other way around.

## High coverage, no wins

I cleaned up the unnatural sets by hand and brought parties into matches. That didn't go cleanly either.

I've used parties — derived from the tool's suggestions and hand-tuned — for **roughly 30 matches**. **Win-rate: about 50%.** Not noticeably better or worse than what I'd build by hand. That's what hit hardest.

93% coverage isn't a lie, I don't think. In a 1-on-1 matchup, the probability that *someone* in my party has an advantage against the opponent is genuinely high. **But what actually happens in matches is 6v6 (effectively 3v3) combinatorial play**, not 1v1.

Concretely, I get stuck like this:

- **"My B handles their A" holds in theory, but B never makes it to the field before the rest is broken**
- **The opponent's 3-pick selection targets the one Pokemon in my party with thinner weaknesses**, breaks through up front, and recovery becomes impossible
- **Type-coverage looks great, but in actual face-offs the matchup falls apart** because their Choice Scarf user moves first or my Pokemon becomes setup fodder

The machine can compute "Pokemon A vs Pokemon B" advantage. But **the holistic "how does Party X play out against Party Y, accounting for selection + turn order + role distribution"** isn't really there yet.

## What I think the root causes are

Three causes, by gut feel.

### 1. No "set templates"

In the actual competitive scene, **there are shared "X is usually run as Y type" templates**. Even for the same Dragonite, "Dragon Dance attacker," "HBD wall," and "Choice Scarf" types each have crisply-defined nature / item / moveset / EV (AP) allocations.

This tool doesn't carry that. **It pulls "popular natures" and "popular moves" independently from usage data and combines them**, without holding sets that cohere as templates. That's why Modest Dragon-Dance Dragonite shows up.

### 2. The "tuning" used in real play isn't captured

The Pokemon top players run carry delicate EV (AP) tuning — "156 Speed to outrun Jolly Garchomp by 1," "H252 D* to survive +1 Life Orb Mega Lopunny's Fairy hit" — **tuning aimed at specific opponents**.

This tool only handles **basic allocation patterns** like "H252 / Atk 252 / Spe 4." Real-world tuning data isn't reachable. The whole scoring assumes basic tuning, so a gap with the real competitive scene remains.

### 3. 1v1 judgment can't model combinatorial play

This is the deepest one.

The evaluation base is **"1 Pokemon vs 1 Pokemon plus α"** advantage judgment. Coverage is computed by stacking that across 6 Pokemon. But what actually decides matches is **the composite information of Pokemon-pair compatibility, type complementarity, turn order, status-effect chains** — combinatorial play.

Modeling that composite information honestly makes both the data and the compute heavy. The 20×20 payoff Nash-equilibrium lineup-optimization (the `lineup-nash` command) is implemented — but **the per-cell expected win-rate fed into it isn't accurate enough to begin with**. When the foundation is shaky, game-theoretic optimization on top loses meaning.

## What still survives

It's not a total wash. Two things hold up.

**Coverage numbers are reasonably trustworthy.** At minimum, "who has type-based advantages against whom" aggregated across the top 30 — the machine is faster and more accurate than I am. I don't have the energy to run all 30 by hand.

**It works as a starting-point generator for parties.** It's faster to take a machine-generated candidate and "remove this, add that" than to design 6 from zero. Set unnaturalness has to be hand-cleaned, but the skeleton is given.

So **it's not a final answer, but it functions as a thinking starter**. A different landing point from the original "press the button and a winning party appears," but not a worthless one.

## Where this tool goes next

I'm **shelving it** for now.

Reason: my own improvement plan isn't crisp yet. Set coherence, tuning data ingestion, composite-information evaluation — each of these is "doable in principle," but **doing each in isolation doesn't pay off much while the foundational evaluation function stays shaky**.

In the meantime I'll **try other Pokemon-related tools that other developers are building**. People tackling the same problem — what are they solving where, what are they giving up on, what are they betting on? I want to see that before deciding what to add to / cut from my own tool.

## Closing

I built a "tool that auto-generates winning Pokemon parties," took it into actual matches, and got **50%**. That's the whole story of this article.

I don't think it's a complete failure, but it's **definitely not the success I had pictured**. So instead of a published post, I'm leaving this here as a personal draft.

The technical interior — evaluation-function design, layering Champions-specific overrides on `@smogon/calc`, the Nash-equilibrium lineup implementation, the machinery that keeps a deterministic value unchanged across 27 sprints — I'll write up separately as a tech-focused piece. "What didn't work" and "what's running underneath" are easier to write honestly when kept apart.

That follow-up will get published, eventually.
