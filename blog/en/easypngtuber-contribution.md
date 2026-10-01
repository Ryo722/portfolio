---
title: "Contributing 3 improvements to a PNGTuber tool"
date: 2026-03-30
tags: [OSS, Python, PySide6, OpenCV, Performance]
excerpt: "Three contributions to EasyPNGTuber: dependency optimization, macOS HiDPI support, and parallelized alignment with multiprocessing for 2-3x speedup."
---

# Contributing 3 improvements to a PNGTuber tool

## What is EasyPNGTuber

A Python toolset for creating expression variants for PNGTubers (static image avatars). It extracts eye and mouth parts from AI-generated images and auto-generates 4 expression patterns (eyes ON/OFF x mouth ON/OFF). Uses AKAZE/ORB feature matching for alignment and mask drawing for part region specification.

PySide6 for GUI, OpenCV for image processing. An OSS project by rotejin.

I've been using it for VTuber preparation and found room for improvement in macOS usability and performance. I split the improvements into 3 independent branches.

## Improvement 1: Dependency optimization

Switched `opencv-python` to `opencv-python-headless`.

EasyPNGTuber's GUI is handled entirely by PySide6. OpenCV is only used for headless image processing. The `opencv-python` package includes `highgui` (window display), which can conflict with PySide6. The headless variant has a smaller dependency footprint and eliminates GUI framework conflict risk.

One line in `pyproject.toml` plus lock file update.

## Improvement 2: macOS UX

Fixed two issues.

**HiDPI support (Retina displays)**

On macOS Retina displays, logical and physical pixels have a 2:1 ratio. Added device pixel ratio detection to PreviewWidget and MaskCanvas scaling calculations.

```python
def _device_pixel_ratio(self) -> float:
    screen = self.screen()
    if screen is not None:
        return screen.devicePixelRatio()
    return 1.0
```

This fixed blurry preview images on Retina displays.

**Native key labels**

Undo/redo tooltips were hardcoded as `Ctrl+Z` / `Ctrl+Y`. On macOS, the correct labels are `Cmd+Z` / `Cmd+Shift+Z`. Used `QKeySequence.NativeText` for platform-appropriate key labels.

```python
self.btn_undo.setToolTip(
    QKeySequence(QKeySequence.StandardKey.Undo)
    .toString(QKeySequence.SequenceFormat.NativeText)
)
```

Windows/Linux continues to show `Ctrl+Z` as before.

## Improvement 3: Parallelized alignment

The highest-impact change.

EasyPNGTuber's alignment splits grid images (2x2 or 3x3) into slices and aligns each against a base image using AKAZE feature matching. The original implementation processed slices serially — one at a time.

Each slice's alignment is independent. The transformation matrix calculation doesn't depend on other slices' results. Parallelized with `multiprocessing.Pool`.

```python
from multiprocessing import Pool, cpu_count

n_workers = min(len(align_args), max(1, cpu_count() - 1))
with Pool(processes=n_workers) as pool:
    results = pool.map(_align_single_slice, align_args)
```

Worker count is CPU cores - 1. Python's GIL prevents `threading` from parallelizing CPU-bound work, but `multiprocessing` actually runs OpenCV image processing in parallel across separate processes.

`_align_single_slice` is defined as a module-level function because `multiprocessing.Pool.map` requires pickle-able objects — instance methods don't qualify. Each worker creates its own Aligner instance.

Measured 2-3x speedup for 2x2 grids (3 diff slices), with more significant gains for 3x3 grids (8 diff slices).

## Branch design

I didn't combine the 3 improvements into a single PR — a lesson from my previous OSS contribution experience.

| Branch | Content | Scope |
|---|---|---|
| `improve/update-dependencies` | opencv-python-headless switch | 2 files |
| `improve/macos-ux` | HiDPI + native key labels | 4 files, 14 lines |
| `improve/parallel-alignment` | Parallel alignment | 2 files, 30 lines |

Reviewers can evaluate "dependency change," "UX fix," and "performance improvement" independently. Bundling them risks blocking unrelated improvements if one change raises concerns.

## Retrospective

My previous contribution work focused on "removing personal config" and "isolating breaking changes" across 4 repositories. This time, I worked with contribution in mind from the start, resulting in zero personal config contamination.

The checklist has become internalized. When making changes, "does this break other environments?" and "is this personal config?" now come naturally.

The multiprocessing parallelization required GIL-aware design decisions. I initially wrote it with `threading`, then realized "this is CPU-bound, GIL won't parallelize it" and rewrote with `multiprocessing`. Iterating with AI made this pivot fast.
