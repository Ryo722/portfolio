---
title: "Building a coffee recommender app with cosine similarity matching"
date: 2026-03-30
tags: [React, TypeScript, Vite, Tailwind CSS, Vitest, Playwright]
excerpt: "25 coffee beans quantified across 10 flavor axes, matched via cosine similarity. A fully client-side app with diagnosis, comparison, and stats — built with AI."
---

# Building a coffee recommender app with cosine similarity matching

## What I built

CafeNavi — a web app that recommends your ideal coffee from 25 bean profiles based on taste preferences. Fully serverless, everything runs in the browser.

Demo: https://ryo722.github.io/CafeNavi/

## How the matching works

I started by quantifying coffee flavors.

Each bean has a 10-axis flavor score: bitterness, acidity, sweetness, body, fruity, floral, nutty, chocolate, roast, and cleanness. 25 beans, each with values from 0 to 10 — 987 lines of profile data.

User responses are converted to the same 10-axis vector via sliders. Beginner mode asks 10 questions with approachable wording; intermediate mode goes deeper with 20 questions covering floral, nutty, and other nuanced axes.

Matching uses cosine similarity. It calculates the angle between the user's preference vector and each bean's flavor vector, recommending the closest match. I chose cosine similarity over Euclidean distance because I wanted to compare direction, not magnitude — "bitterness 8, acidity 2" and "bitterness 4, acidity 1" should be treated as the same preference pattern.

```typescript
const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
return dotProduct / (magnitudeA * magnitudeB)
```

## Pairing and scene awareness

Beyond pure taste, the app considers food pairings and drinking context. If you prefer chocolate-based sweets, a bean with bitterness and chocolate notes fits better than a high-acidity one. Morning drinkers and afternoon relaxers tend to prefer different body weights.

Dessert and scene selectors feed weighted adjustments into the flavor score calculation.

## Comparison feature

Beyond diagnosis results, you can compare any beans side by side with radar charts showing all 10 axes. "Is Ethiopia Yirgacheffe or Kenya AA more fruity?" — one glance at the chart answers it.

## Statistics dashboard

Diagnosis results persist in LocalStorage. Over multiple sessions, your taste trends appear in line charts.

I implemented 8 taste type classifications: fruity, bitter, choco-nut, floral, heavy-body, sweet, clean, and balanced. Repeat diagnoses reveal which type you belong to.

## Testing

68 unit tests, 14 E2E tests.

Vitest covers scoring logic, cosine similarity calculation, taste type classification, and storage operations. Playwright E2E tests verify the full diagnosis flow, bean comparison interactions, navigation, and guide page rendering.

Since matching accuracy depends on data quality, I also wrote validation tests for the profile data itself — checking that all 25 beans have scores within 0-10 range and no missing required fields.

## Tech stack

React 19 + TypeScript + Vite + Tailwind CSS 4 — the same stack as my portfolio site. Familiar environment for fast development.

Internationalization uses React Context with hand-written translations. No i18n library — at this scale, manual translations mean fewer dependencies.

Dark/light theme follows system preferences via Tailwind CSS dark mode.

## Retrospective

Creating the 25 bean profiles took the most time. Researching origin characteristics, roast-level flavor changes, and standard cupping evaluations for each bean — this was domain knowledge work, heavier on research than code.

The algorithm itself is simple, but the "how to ask" and "how to convert answers to flavor scores" design directly determines diagnosis quality. Which axis does each question measure? When one question affects multiple axes, how should the weights distribute? I iterated on this with AI.

Total: 9,191 lines of code, with data definitions accounting for roughly 2,000 lines. This is a data-heavy app, not a logic-heavy one.
