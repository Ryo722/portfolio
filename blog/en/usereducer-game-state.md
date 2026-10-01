---
title: "Designing Game State Management with useReducer"
date: 2026-03-29
tags: [React, TypeScript, useReducer, Game Development]
excerpt: "Designing state management for a slide puzzle x match-3 game with useReducer. 13 action types, 408 lines of pure logic, and animation control."
---

# Designing Game State Management with useReducer

## What I Built

Eevee Panel 8 -- a browser game built with React + TypeScript where you slide panels on a 3x3 board and clear sets of three matching types. It combines slide puzzle and match-3 mechanics. (The name references Eevee from Pokemon, as the game uses elemental type-matching.)

This post covers how I designed its state management with `useReducer`.

## Why useReducer

Game state is complex. Board layout, score, remaining time, evolution gauge, fever state, animation phase -- all tightly coupled.

Managing these with individual useState calls turns the sequence of "slide -> match check -> clear -> refill -> re-check" into a tangled mess of which state to update in which order.

useReducer makes the state transitions explicit: `SLIDE_TILE` -> `SLIDE_COMPLETE` -> `MARK_CLEARING` -> `APPLY_REFILL` -> `APPEAR_COMPLETE`. Each action has a clear responsibility, and tracking down bugs becomes straightforward.

## GameState Structure

The entire game state is expressed in a single type.

```typescript
type GameState = {
  // Phase management
  phase: 'title' | 'type-select' | 'playing' | 'result'

  // Board
  board: CellState[][]
  selectedType: 'water' | 'fire' | 'thunder' | null

  // Scoring
  score: number
  highScore: number
  clearCount: { water: number; fire: number; thunder: number }

  // Timer & gauges
  timeRemaining: number
  evolutionGauge: number
  feverType: PanelType | null

  // Animation control
  animationPhase: 'idle' | 'sliding' | 'clearing' | 'appearing'
  animationLocked: boolean
}
```

The key fields are `animationPhase` and `animationLocked`. During animations, user input must be blocked. While `animationLocked` is true, the reducer ignores `SLIDE_TILE` actions.

## 13 Action Types

The reducer handles 13 action types.

| Action | Phase | Responsibility |
|---|---|---|
| START_GAME | title -> type-select | Start game |
| SELECT_TYPE | type-select -> playing | Select type, initialize board |
| SLIDE_TILE | playing | Begin panel slide |
| SLIDE_COMPLETE | playing | Slide animation finished |
| MARK_CLEARING | playing | Enter clearing phase |
| APPLY_REFILL | playing | Apply refilled board |
| APPEAR_COMPLETE | playing | Appear animation finished |
| TICK | playing | 1-second countdown |
| UPDATE_FEVER | playing | Update fever type |
| END_GAME | playing -> result | End game, evaluate evolution |
| RESTART | result -> title | Restart |
| SET_HIGH_SCORE | any | Update high score |

A single slide triggers a chain of 5 actions: `SLIDE_TILE` -> `SLIDE_COMPLETE` -> `MARK_CLEARING` -> `APPLY_REFILL` -> `APPEAR_COMPLETE`. If matches cascade, `MARK_CLEARING` -> `APPLY_REFILL` -> `APPEAR_COMPLETE` loops.

## Logic Layer Separation

Rather than writing logic directly in the reducer, I extracted it into 408 lines of pure functions.

| Function | Lines | Responsibility |
|---|---|---|
| findMatches | 62 | Detect match-3 (horizontal & vertical) |
| slideTile | 31 | Validate and execute slide |
| generateBoard | 75 | Generate initial board |
| refillBoard | 55 | Refill after clears |
| evolution | 114 | Gauge calculation & evolution check |
| fever | 49 | Fever evaluation |
| score | 22 | Score calculation |

These are all pure functions with no React dependency. The reducer only orchestrates which functions to call and in what order.

The payoff is testability. Pass a board to `findMatches` and verify the result. Pass a gauge value to `evolution` and check the outcome. Logic can be tested without rendering any React components.

## Animation Control Pattern

Game state transitions involve animations: slide, clear, refill, appear. Managing the start and end of each animation through actions is the key pattern.

```
SLIDE_TILE      -> animationPhase: 'sliding',   animationLocked: true
SLIDE_COMPLETE  -> animationPhase: 'idle',      run match detection
MARK_CLEARING   -> animationPhase: 'clearing',  start clear animation
APPLY_REFILL    -> animationPhase: 'appearing', start appear animation
APPEAR_COMPLETE -> animationPhase: 'idle',      run match detection again
```

`animationLocked` flips to true on `SLIDE_TILE` and back to false only after all animations complete. User input during this window is ignored at the reducer level.

UI components simply read `animationPhase` and swap CSS animation classes accordingly. Concerns between the logic layer and the animation layer stay cleanly separated.

## Evolution Gauge Design

The game features an "evolution gauge." Clearing panels of your chosen type raises the gauge; clearing other types lowers it.

```typescript
function calculateGaugeDelta(
  clearedType: PanelType,
  selectedType: PanelType,
  count: number
): number {
  if (clearedType === selectedType) return count * GAUGE_PER_CLEAR
  return -(count * GAUGE_PENALTY)
}
```

Tuning game balance means adjusting this function's parameters. In practice, `GAUGE_PENALTY` was tweaked several times across PRs. Because the logic lives in a pure function, the blast radius of parameter changes is always clear.

## Reflections

useReducer + a pure function logic layer yielded game state management across 13 actions and 7 logic functions.

**useReducer is a natural fit for games.** Game state transitions map cleanly to the "action -> new state" pattern. The action sequence tells you exactly what happened, making debugging straightforward.

**Logic layer separation is the lifeline for testing.** All 408 lines of logic are pure functions independent of React, testable directly with Vitest. Reducer tests cover state transitions; logic function tests cover algorithms -- different granularities, cleanly separated.

**Manage animations as "phases."** Controlling `animationPhase` in the reducer while the UI just applies CSS classes based on the current phase is more predictable and less bug-prone than managing animation state with setTimeout or refs.
