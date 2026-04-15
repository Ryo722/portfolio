---
title:
  ja: "torabo-tsuki LP XSのケースをBlender MCPで自作した話"
  en: "Building a Custom Case for torabo-tsuki LP XS with Blender MCP"
date: 2026-04-13
tags: [Custom Keyboard, 3D Printing, Blender, AI]
excerpt:
  ja: "キーケット2026で購入したtorabo-tsuki LP XS用に、チルトスタンド対応・マグネット接続のケースをBlender MCPで設計し、3Dプリントした制作記録。"
  en: "A build log of designing a custom case with tilt stand support and magnetic connection for the torabo-tsuki LP XS split keyboard, using Blender MCP and 3D printing."
---

# Building a Custom Case for torabo-tsuki LP XS with Blender MCP

## Meeting torabo-tsuki LP XS

I'd been using an HHKB. No complaints, but I developed a desire to complete both keyboard and mouse operations without moving my hands from the home position. That pointed to a split keyboard with an integrated trackball — and that's how I found the torabo-tsuki LP XS.

At Keeket 2026, I purchased a torabo-tsuki LP XS DIY kit designed by Sekigon ([@_gonnoc](https://x.com/_gonnoc)). It's a split keyboard with an integrated trackball — slim and stylish. This was my first custom keyboard purchase.

I now use it as my daily driver for both work and personal use. I've fully adjusted to the trackball and completely moved away from a mouse.

## Why Build a Custom Case

The stock case for the torabo-tsuki LP XS is thin and sleek — I genuinely liked the design. But after using it, I wanted two things:

- **Tilt stand support** — I wanted to type at an angle
- **Magnetic connection between halves** — I wanted to snap them together and carry them in a gadget pouch

The stock case is too thin to embed tilt stand pockets or magnets. I also couldn't find any community-designed case files.

"If it doesn't exist, build it." It's a custom keyboard after all — extending the customization to the case felt natural. I also wanted to try Blender MCP, a system that lets AI control Blender programmatically.

## Design Details

### Tilt Stand Pockets

I added two recessed pockets on the bottom of each case to hold [tilt stands from Yushakobo](https://shop.yushakobo.jp/products/10730).

The first design had pockets that fit the stands perfectly. It looked clean, but I quickly discovered there was **no gap for fingers to pull the stands out**. I widened the pockets from 56mm to 59mm and deepened them from 15mm to 18mm. Practicality over aesthetics.

### Magnetic Connection

Each case bottom has four magnet pockets (φ8mm × 3mm deep). With magnets embedded, the two halves snap together bottom-to-bottom. No more loose pieces rattling around in a bag.

The magnets are Daiso "Super Strong Magnets 8mm" (JAN: 4549131156621) — about $1 per pack. One pack covers the 8 magnets needed for a full set.

### Screw Hole Adjustments

I wanted ultra-low-head screws, but only had standard ones on hand. I adjusted the screw hole depth so the screw heads sit flush inside the holes, preventing the case from wobbling on a desk.

## Designing with Blender MCP × Claude

I used Blender MCP for the design. It lets an AI assistant (Claude) control Blender programmatically — I could say "add an 8mm hole here" or "flatten the bottom at Z = -6.3mm" and the mesh operations would execute.

For me, describing what I wanted in natural language and iterating through trial and error worked better than learning Blender's interface from scratch.

### Left-to-Right Conversion

The left and right cases are nearly identical, just mirrored. I finished the left case first, extracted the "transformation rules" that described what changed from the original, and applied the same rules to the right case.

The transformation rules:

1. Flatten the bottom (align all vertices at Z ≤ -6.30mm to -6.30mm)
2. Shift upward (raise vertices at Z > -6.30mm by +6.60mm for case thickness)
3. Add tilt stand pockets (2 locations)
4. Add magnet pockets (4 locations)

This rule-based approach was planned from the start. The trial and error on the left side transferred directly to the right.

### Challenges

The hardest part was **verbalizing the design in my head**. "Here" and "there" don't work with AI — I needed exact coordinates and dimensions. I used other AI tools for brainstorming to turn mental images into precise specifications.

The other challenge was **maintaining symmetry between left and right pocket positions**. Operating on each case separately in Blender MCP often introduced subtle misalignments. I solved this by opening both case models simultaneously in Blender, which preserved mirror-symmetric positioning.

## 3D Printed Keycaps Too

I also 3D printed keycaps — specifically [Ridge-cap](https://arailab.booth.pm/items/7905395) designed by Arai ([@Arai_Lab](https://x.com/Arai_Lab)). They support 17mm key pitch and feature a distinctive wavy profile. I purchased the STL files from BOOTH and printed them myself.

### Print Angle Optimization

For small parts like keycaps, print orientation significantly affects surface quality. I printed them rotated 30° on the X axis and 12° on the Y axis. This minimizes visible layer lines on the keycap surface — the part your fingers actually touch.

## 3D Printing Setup

Printer: Bambu Lab A1 mini. Filament: Bambu Lab PLA Tough Plus. The A1 mini is compact and handled mid-size parts like keyboard cases without issues. Both the cases and keycaps were printed on this single machine.

## Keymap Customization

The torabo-tsuki LP XS runs on ZMK firmware. The keymap is fully customizable.

I currently use a 4-layer setup. The base layer is mostly QWERTY, but with home row mods — holding the A key activates left Command, holding Z activates left Shift. No need to move fingers off the home row for modifiers.

Layer 1 holds numbers and brackets, Layer 2 has symbols and function keys, and Layer 3 handles cursor movement, page navigation, and Bluetooth switching. Trackball click operations are also mapped within the layers, so there's zero need to reach for a mouse.

The keymap is still a work in progress — I'll keep refining it as I use it.

## The Finished Build

The left case reached v11, the right case v4. Development took about 11 days (April 2 – 13), with 15 total iterations across both sides.

![torabo-tsuki LP XS before assembly](/portfolio/images/projects/torabo-tsuki-case/IMG_6385.webp)

![Completed torabo-tsuki LP XS — 3D printed case + Ridge-cap](/portfolio/images/projects/torabo-tsuki-case/IMG_6436.webp)

![Side view showing case thickness and tilt angle](/portfolio/images/projects/torabo-tsuki-case/IMG_6437.webp)

![Case bottoms — tilt stand pockets and magnet recesses](/portfolio/images/projects/torabo-tsuki-case/IMG_6438.webp)

The 3D printed cases with Ridge-cap keycaps are working great in daily use.

## Cost Breakdown

For anyone thinking about trying this, here's what it cost:

| Item | Cost (JPY, tax included) |
|------|--------------------------|
| torabo-tsuki LP XS kit | ~¥25,000 |
| Bambu Lab A1 mini (3D printer) | ~¥29,800 |
| Bambu Lab PLA Tough Plus (filament) | ¥2,400–3,900 |
| Yushakobo tilt stands | ~¥2,200 |
| Daiso super strong magnets 8mm | ¥100 |
| M2 screws (4mm & 6mm) | ~¥200 each |

Total is around ¥60,000 including the 3D printer. If you already own a printer, you can get started for under ¥30,000. I intentionally chose commonly available parts and tools — magnets from Daiso, screws from any hardware store — to keep the barrier to entry as low as possible for anyone who wants to replicate this build.

## Takeaways

The joy of custom keyboards comes down to one thing: making it exactly yours. Not just switches and keycaps — designing a case tailored to your own needs is an experience unique to the DIY keyboard world.

Adjusting the typing angle with tilt stands, snapping the halves together with magnets for portability — having both of these made the torabo-tsuki LP XS feel like a tool that truly fits my hands.

Blender MCP made it possible to attempt case design with zero 3D modeling experience. AI lowers the barrier for "I've never done this but I want to try" — this project reinforced that belief.

Next up: keymap optimization. Now that the hardware side is settled, it's time to refine the software side to fit my hands even better.

---

## Credits

| Item | Detail |
|------|--------|
| Keyboard | torabo-tsuki LP XS (designed by Sekigon [@_gonnoc](https://x.com/_gonnoc)) |
| Event | Keeket 2026 |
| Tilt Stands | [Yushakobo](https://shop.yushakobo.jp/products/10730) |
| Magnets | Daiso Super Strong Magnets 8mm (JAN: 4549131156621) |
| Keycaps | [Ridge-cap](https://arailab.booth.pm/items/7905395) (designed by Arai [@Arai_Lab](https://x.com/Arai_Lab)) |
| 3D Printer | Bambu Lab A1 mini |
| Filament | Bambu Lab PLA Tough Plus |
| Case Design | Blender + Blender MCP + Claude |
