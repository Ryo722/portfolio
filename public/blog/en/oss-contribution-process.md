---
title: "Turning local fork changes into proper OSS contributions"
date: 2026-03-29
tags: [OSS, Git, Code Review, AI, Python]
excerpt: "Auditing local changes across 4 AI voice/video repositories — removing personal config, isolating breaking changes, and elevating to PR quality."
---

# Turning local fork changes into proper OSS contributions

## The starting point

While improving my portfolio, I noticed 4 cloned AI repositories in my Documents folder. All had been modified to run on macOS, but the changes were uncommitted and abandoned.

| Repository | Purpose | State |
|---|---|---|
| Style-Bert-VITS2 | Voice synthesis | 6 files changed |
| MotionPNGTuber | Real-time lip sync | 4 files changed |
| RVC-WebUI-MacOS | Voice conversion | 3 files changed |
| Applio | Voice conversion | 5 files changed |

My first thought was "I can just submit these as PRs." After auditing, I realized none of them were anywhere near PR quality.

## The audit checklist

Before submitting anything, I audited every change against 6 criteria:

1. **Personal config contamination** — local paths, personal model names, personal default values
2. **Cross-platform compatibility** — does it break non-macOS environments?
3. **Override vs extension** — does it delete existing functionality or add conditional branches?
4. **PR presentation** — commit granularity, unrelated changes, need for splitting
5. **Upstream relationship** — activity level, existing issues/PRs, contribution guidelines
6. **Separability** — are independent changes mixed together?

## Style-Bert-VITS2 — The most systematic fix

### Problems found

The macOS changes were systematic, but had 3 issues.

**Problem 1: Hardcoded device detection**

```python
_DEVICE = "cpu"  # macOS: force CPU for DDP compatibility
```

This forces CPU even on CUDA environments. Fixed to auto-detect:

```python
if torch.cuda.is_available():
    _DEVICE = "cuda"
elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
    _DEVICE = "mps"
else:
    _DEVICE = "cpu"
```

**Problem 2: Inconsistent device selection in evaluate()**

The train function used the `_DEVICE` variable, but evaluate() hardcoded `"mps" if torch.backends.mps.is_available() else "cpu"`. Unified to `_DEVICE`.

**Problem 3: Lost non_blocking**

Replacing `.cuda(local_rank, non_blocking=True)` with `.to(_DEVICE)` silently dropped `non_blocking=True`, degrading CUDA transfer performance.

### PR splitting

Split into 3 PRs for independent concerns: pyopenjtalk compatibility (4 files), cross-platform training (1 file), macOS requirements (1 file). A single 6-file PR would mix unrelated API compatibility fixes with PyTorch device branching.

## MotionPNGTuber — Separating fixes from breakage

### What could be contributed

Mouth sprite bouncing prevention was a platform-independent bug fix: canvas overflow clamping, hysteresis deadband for lip level transitions, and `cv2.error` catch for GIL race conditions.

The original `except Exception: pass` was too broad — narrowed to `except cv2.error: pass`.

### What couldn't be contributed

`pyproject.toml` and `uv.lock` were completely overwritten from Windows/CUDA to macOS. Submitting this would break every Windows user's environment.

## RVC-WebUI-MacOS — A mountain of personal config

### What I found

Almost every change was personal configuration:

| Change | Verdict |
|---|---|
| Default model `mia.pth` | Personal model name |
| Pitch shift 0→10 | Comment says "Komori default" |
| Consonant protection 0.33→0.5 | Same — personal preference |
| Language zh_CN→ja_JP | Hardcoded language swap |

The comments literally had my VTuber character name in them. Only the `torch.load` PyTorch 2.6+ compatibility patch was genuinely useful to other users.

## Applio — Deletion is not contribution

Deleting 3 Windows `.bat` files because they're "unnecessary on macOS" is not an improvement — it's breaking Windows support. The only valid change was adding execute permission to `run-install.sh`, but the repository had PRs disabled.

## Results

| Repository | PRs submitted | Changes excluded |
|---|---|---|
| Style-Bert-VITS2 | 3 | Unnecessary comment change |
| MotionPNGTuber | 1 | pyproject.toml/uv.lock (breaking) |
| RVC-WebUI-MacOS | 1 | 5 personal config items |
| Applio | 0 (no permission) | .bat deletion (breaking), config.json (noise) |

6 PRs submitted, 1 blocked by permissions.

## Takeaways

**"Works locally" and "PR-ready" are different standards.** `_DEVICE = "cpu"` works perfectly on my Mac but destroys training performance on CUDA.

**Personal config contaminates more than you think.** "I just changed a default value" is fatal from a contribution perspective.

**Deletion is not extension.** macOS support means "add macOS branches," not "remove Windows code."

**A checklist makes auditing consistent.** Applying 6 criteria systematically across 4 repositories kept the judgment objective rather than gut-feel.
