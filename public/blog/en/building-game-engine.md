---
title: "Building a game engine that powers 11,000+ cards — with AI"
date: 2026-03-29
tags: [TypeScript, Game Engine, Architecture, AI, Claude Code]
excerpt: "A design and implementation record of a pure-functional game engine compliant with Duel Masters comprehensive rules — 152 modules, 1,065+ tests, built with AI as co-developer."
---

# Building a game engine that powers 11,000+ cards — with AI

## What I built

I'm developing "DuelMasters Plays," an online battle platform for the Duel Masters TCG. It supports both AI battles (offline) and real-time online matches via Socket.IO — a full-stack application.

Here are the numbers:

| Metric | Value |
|---|---|
| Commits | 374 |
| Engine modules | 152 files |
| Engine code | 32,776 LOC |
| Test cases | 1,065+ |
| Card definitions | 586,677 lines (11,000+ cards) |
| Command types | 35 |

The tech stack is Next.js 14 + TypeScript + Express + Socket.IO + Prisma + PostgreSQL. Everything from frontend to backend, DB, Docker, CI/CD, and self-hosted deployment — built full-stack with AI.

The component I spent the most design effort on is the game's core: the rules engine.

## Why pure functions

The entire engine is designed around one simple principle: "consolidate everything into a single function."

```typescript
function processCommand(
  state: GameState,
  playerId: PlayerId,
  command: GameCommand,
  cardCatalog: Map<string, CardDef>
): CommandResult
```

`processCommand()` is the engine's sole entry point. It takes the current game state, player ID, command, and card catalog, and returns a new state with events. No side effects.

Three reasons for this design:

**Testability.** Pure functions always return the same output for the same input. Tests are easy to write, and 1,065 test cases accumulated naturally.

**Replayability.** Record the command sequence and you can replay it. Combined with SeededRNG, even AI battles are fully deterministic and replayable.

**Frontend-backend sharing.** The engine runs on both client and server. Offline AI battles execute directly on the client; online matches execute on the server. The same code running in both places is only possible because there are no side effects.

Internally, the engine is a 35-branch switch statement over command types:

- Play commands (10): CHARGE_MANA, SUMMON_CREATURE, CAST_SPELL ...
- Battle commands (1): ATTACK
- Ability commands (1): ACTIVATE_ABILITY
- Phase commands (3): ADVANCE_PHASE, END_TURN, SURRENDER
- Choice commands (3): CHOOSE_CARDS, CHOOSE_YES_NO, CHOOSE_OPTION
- Free mode commands (15): MANUAL_MOVE_CARD, MANUAL_TAP ...

After each command, `applyPostActionSBA()` (state-based actions) runs to apply rule-based automatic processing.

## How we handle 11,000+ cards

Duel Masters has over 11,000 cards. Each has unique abilities, and combinations create countless interactions.

Card definitions are auto-converted from official JSON data into type-safe CardDef types using 6 builders:

| Builder | Target |
|---|---|
| normalCardBuilder | Normal creatures, spells, multicolor |
| psychicCardBuilder | 2-face/3-face Psychic (awakening stages) |
| dragheartCardBuilder | Dragheart (3-face dragon chain) |
| twinpactCardBuilder | Twinpact (skill split) |
| duelistCardBuilder | Duelist |
| auraCardBuilder | Aura |

Especially complex are Psychic cards (3-face awakening) and Dragheart chains (3-face dragon solve). A single card can have up to 3 faces that transform based on conditions. Expressing this in the type system was challenging.

Keyword abilities are modularized into 12 sub-modules. Ninja (`ninjaSystem.ts`), Dragon (`dragheartSystem.ts`), Special (`invasionSystem.ts`, `dynamoSystem.ts`) — each registers as an independent handler in the effect registry.

Replacement effects (Comprehensive Rule 609) are centrally managed in `replacementEffects.ts`. Priority resolution for replacement effects like "instead of being destroyed" is one of the trickiest parts of any card game engine.

## What changed with AI co-development

This project is developed in collaboration with Claude Code. Three things changed significantly through working with AI:

**TDD flows naturally.** Have AI write tests first, write minimal implementation, refactor — this cycle is dramatically faster than working solo. The 1,065 test cases accumulated thanks to pair programming with AI.

**Faster pattern discovery.** We introduced a DI pattern called `setXxxOps()` to resolve circular dependencies — this emerged naturally through dialogue with AI. Human sets the architectural direction, AI proposes concrete implementation patterns, human reviews and adopts. This back-and-forth elevates design quality.

**4-parallel review system.** Using takt (multi-agent orchestration engine), we built a system where 4 DM rule expert agents review in parallel: Comprehensive Rules Expert, Keyword Ability Expert, Effect Processing Expert, and Engine Verification Expert. Solo development, but with 4 expert-level reviews.

However, **UI development requires human driving.** Battle screen layout, drag-and-drop behavior for cards, phase display positioning, shield zone presentation — these can't be completed just by AI generating code.

Only a human can feel "this is hard to use," "this information is missing," "this interaction feels wrong" by actually interacting with it. You can tell AI "add a context menu on right-click," but "this menu appears 0.3 seconds too late" is a sensation only a player can perceive.

UI development works best with AI handling code generation while humans drive through trial and error. AI excels at logic implementation and testing. Humans excel at experience design and sensory tuning. This role division was the most important lesson from AI co-development.

## AI battle engine

Offline AI battles are implemented through board state scoring.

```
Score = (allied power total - enemy power total) / 1000
      + (allied shields - enemy shields) × 2
      + (allied hand size - enemy hand size) × 0.5
```

Based on this evaluation function, strategies branch by difficulty:

| Difficulty | Strategy |
|---|---|
| EASY | Random selection |
| NORMAL | Greedy approach based on evaluation function |
| HARD | Evaluation function + blocker detection for defense |

With integrated SeededRNG, the same seed produces the same game progression. This enables replay functionality and "reproduce that exact board state" during debugging.

AI-related code totals 862 lines. It looks small, but thanks to `processCommand()`'s pure function design, the AI side only needs to generate and pass commands. All game rule complexity is contained within the engine.

## Reflections and next steps

374 commits, 32,776 lines of engine code, 1,065 tests. Quite substantial for a solo project.

Three takeaways:

**Pure functions are justice.** No side effects means tests are writable. Tests mean refactoring is possible. Refactoring means design can continuously improve. This positive cycle became the foundation for safely implementing complex card game rules.

**AI co-development is about role division.** AI is faster at logic and tests. Humans drive UI and experience design. Humans set design direction, AI proposes implementation patterns. The clearer this division, the better both speed and quality.

**11,000 cards are solved with systems.** Rather than handling each card individually, we process them generically through card builders × keyword ability modules × effect registry. Individual cards are treated as definition data, and the engine is dedicated to interpreting definitions.

Next, we plan to gradually improve 6 quality attributes (determinism, extensibility, verifiability, maintainability, safety, traceability) through the engine reinforcement plan. Non-destructively evolving the internal foundation without breaking 1,065+ existing tests — another approach made possible by pure function design.
