---
title: "Building a 3-Layer Image Compositing Engine with Canvas API"
date: 2026-03-29
tags: [Canvas API, React, TypeScript, Image Processing]
excerpt: "Built a 3-layer compositing engine (Illustration / Text / Frame) with Canvas API for a custom card generator tool."
---

# Building a 3-Layer Image Compositing Engine with Canvas API

## What I Built

A browser-based tool called "DM Orica Generator" for creating custom cards for Duel Masters, a popular Japanese trading card game. Enter a card name, race, cost, power, and effect text, upload an illustration, and the tool outputs a publication-quality card image in PNG format.

The heart of this tool is a 3-layer image compositing engine built with Canvas API.

## Why Three Layers

A card image consists of three elements:

1. **Illustration (background)** — The user-uploaded artwork
2. **Text** — Card name, race, effect text, flavor text
3. **Frame** — Card border, cost value, power value, rarity

Drawing order matters. Illustration goes on the bottom, text in the middle, frame on top. The frame has transparent regions that let the underlying illustration and text show through.

Each layer is drawn to an independent canvas buffer, then composited with drawImage at the end. Two reasons for this design:

**Independent drawing logic.** Each layer only needs to know its own responsibility. IllustrationLayer handles image placement, TextLayer handles text rendering, FrameLayer handles border drawing. Nothing more.

**Optimized re-rendering.** When only the text changes, IllustrationLayer and FrameLayer don't need to re-draw — only TextLayer gets updated.

## CanvasRenderer Design

The compositing engine's core is the `CanvasRenderer` class.

```typescript
class CanvasRenderer {
  constructor(layers: Layer[])
  async render(data: CardRenderData): Promise<HTMLCanvasElement>
  dispose(): void
}
```

The constructor takes a layer array and pre-allocates a canvas buffer for each layer. `render()` draws all layers in order and returns the composited result.

The compositing logic is straightforward:

```typescript
private composite(): HTMLCanvasElement {
  const rc = CanvasFactory.createRenderContext();
  for (const layerRc of this.layerContexts) {
    rc.ctx.drawImage(layerRc.canvas, 0, 0);
  }
  return rc.canvas;
}
```

Just draw each layer's canvas in sequence. Transparent areas let the lower layers show through. Canvas API's `drawImage` handles alpha compositing automatically.

Layer registration order directly determines compositing order:

```typescript
const layers = [
  new IllustrationLayer(),  // Layer 1: Background image
  new TextLayer(),          // Layer 2: Text
  new FrameLayer(),         // Layer 3: Card frame
];
const renderer = new CanvasRenderer(layers);
```

## Text Rendering Pipeline

TextLayer is by far the most complex of the three. Card game text can't be handled with simple fillText calls.

Text rendering goes through a 3-stage pipeline:

**TextProcessor** — Preprocessing. Detects icon symbols within effect text (blocker marks, etc.) and splits them into text segments and icon segments.

**TextMeasurer** — Measures text width and determines line break positions. When effect text is long, it automatically shrinks the font size to fit within the frame.

**TextRenderer** — The actual Canvas drawing. Adds stroke outlines to text so it remains readable over the background image.

This 3-stage separation keeps "semantic analysis of text," "layout calculation," and "drawing execution" independent. Auto font size adjustment is TextMeasurer's responsibility; stroke thickness is TextRenderer's responsibility.

## Twinpact Card Support

Duel Masters has a special card type called "Twinpact" — a single card with both a creature side and a spell side.

To support this, each layer got additional drawing logic for Twinpact cards.

IllustrationLayer draws the creature image normally, then places the spell image rotated -10 degrees at the bottom. TextLayer similarly draws the spell side's card name group rotated -10 degrees.

Image cropping also has two modes: standard cards (aspect ratio 252:344) and Twinpact (creature side 252:344 + spell side 252:140), each with its own Cropper.js instance.

## Font Management

Card text uses the LINE Seed JP font. Web font loading is asynchronous, so drawing text before the font loads produces fallback font rendering.

A FontLoader class uses `document.fonts.load()` to guarantee font preloading before any drawing. Promise caching ensures the actual load only executes once, even with multiple calls.

## Reflections

The entire rendering engine weighs in at roughly 3,500 lines (including tests). Per-layer breakdown:

| Layer | Lines of Code |
|---|---|
| IllustrationLayer | 59 |
| TextLayer | 196 |
| FrameLayer | 154 |
| Text processing (3 modules) | 588 |
| Frame processing (5 modules) | 451 |

TextLayer is the most complex because it handles line wrapping, automatic font scaling, stroke outlines, and icon rendering — all interleaved.

**The payoff of layer separation.** Since each layer is independent, changing FrameLayer's rendering doesn't affect TextLayer. Adding a new card type just means adding drawing logic to each layer.

**Canvas API's limitations.** Text rendering control is Canvas API's weak spot. Line spacing, letter spacing, and vertical text aren't supported at the API level — TextMeasurer has to calculate all of it manually. SVG or DOM manipulation would be more flexible, but for a use case that ultimately outputs PNG, Canvas API was the simplest choice.
