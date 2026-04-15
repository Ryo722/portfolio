---
title:
  ja: "torabo-tsuki LP XSのキーマップを育てている話"
  en: "Growing My Keymap for the torabo-tsuki LP XS"
date: 2026-04-15
tags: [Custom Keyboard, ZMK, Keymap, AI]
excerpt:
  ja: "torabo-tsuki LP XSのZMKキーマップを14回チューニングして現在の形にするまでの記録。hold-tapの調整、コンボ、レイヤー設計の試行錯誤。"
  en: "A record of 14 tuning iterations on the torabo-tsuki LP XS ZMK keymap — hold-tap timing, combos, layer design, and the trial-and-error process."
---

# Growing My Keymap for the torabo-tsuki LP XS

## After the Case, the Keymap

In [the previous post](/blog/torabo-tsuki-case), I wrote about building a custom case. With the hardware side settled, I've moved on to the software side — keymap customization.

The torabo-tsuki LP XS runs on ZMK firmware. To update the keymap, I edit a `.keymap` configuration file, push it to GitHub, and GitHub Actions builds the firmware. Flash the built file to the keyboard, and the changes take effect.

I've gone through 14 tuning iterations so far. It's not done — but it's at a point where daily use is comfortable.

## 4-Layer Design

The current keymap uses 4 layers.

- **Layer 0 (Base)**: QWERTY layout. Everyday typing lives here
- **Layer 1**: Numbers (1–0), brackets, trackball click operations
- **Layer 2**: Symbols (!@#$% etc.), function keys (F1–F12)
- **Layer 3 (System)**: Cursor movement, page navigation, Bluetooth switching

Layer switching uses thumb key holds. `lt 1 TAB` taps for Tab, holds for Layer 1. `lt 3 RET` taps for Enter, holds for Layer 3. My thumbs always rest on these keys, so switching layers requires zero finger movement.

## Hold-Tap Tuning — The Biggest Improvement

Of all 14 tuning rounds, the single most impactful change was adjusting the hold-tap timing.

### The Problem

ZMK has a feature called hold-tap. It lets one key do two things: a short press (tap) produces one action, a long press (hold) produces another. For example, tapping the A key types `a`, while holding it activates `left Command`. In the custom keyboard community, this technique is called **home row mods**. It keeps your fingers on the home row instead of reaching for modifier keys.

The default settings had two issues:

1. **Taps misread as holds** — pressing a key just slightly longer than usual triggered the modifier instead of the character
2. **Misfires during fast typing** — quickly pressing a mod-tap key followed by another key registered an unintended modifier input

### The Fix

I worked out the parameter values with ChatGPT, based on my own typing speed.

```dts
hmt: home_mod_tap {
    compatible = "zmk,behavior-hold-tap";
    flavor = "balanced";
    tapping-term-ms = <280>;
    quick-tap-ms = <175>;
    require-prior-idle-ms = <150>;
};
```

- **`tapping-term-ms = 280`**: Sets the tap/hold boundary at 280ms. Longer than default, preventing normal-speed typing from being misread as holds
- **`quick-tap-ms = 175`**: If the same key is pressed again within 175ms, it's always treated as a tap. Prevents misfires during repeated input
- **`require-prior-idle-ms = 150`**: Hold detection doesn't start unless 150ms have passed since the last keypress. Suppresses misfires during fast typing

After introducing these three parameters, misfires essentially disappeared. This was the single biggest turning point across all 14 iterations.

## Combos — Carrying Over HHKB Muscle Memory

Coming from an HHKB, I wanted key inputs to be accessible with similar finger positions. Combos were one way to achieve that.

A combo triggers a different key when two keys are pressed simultaneously. I currently have three:

- **Language switch**: Two keys near the left pinky pressed together for `Globe` (macOS input source toggle)
- **Single quote**: Two adjacent keys pressed together for `'`
- **Backslash**: Two adjacent keys pressed together for `\`

Single quote and backslash normally require reaching far from the home position. Combos keep them within reach.

## Trackball Speed

The default trackball speed on the torabo-tsuki LP XS felt a bit slow. I bumped it to 1.5x for better cursor tracking. Trackball clicks are mapped in Layers 1 and 3 — left click, right click, and middle click are all within the keymap. There's zero need to reach for a mouse.

## Still Growing

I don't think a keymap ever has a "final" version. As my usage patterns change, the ideal layout changes with it. A few things I want to explore:

- Rearranging Layer 2 (symbols). Programming-heavy symbols could be in more accessible positions
- Adding more combos. Frequently used shortcuts have room to be combo-ized
- Conditional layers. A mechanism where specific layer combinations automatically activate another layer

Unlike case design, keymap tuning has no physical cost. Try something, and if it doesn't work, revert. That ease of experimentation is what makes it fun.

---

## Related

- [Building a Custom Case for torabo-tsuki LP XS with Blender MCP](/blog/torabo-tsuki-case)
