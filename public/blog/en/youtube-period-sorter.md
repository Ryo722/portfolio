---
title: "YouTube has no \"period × popularity\" filter — so I built my own Chrome extension"
date: 2026-05-03
tags: [Chrome Extension, JavaScript, YouTube API, Security Review]
excerpt: "YouTube's native UI can't show \"recent hits sorted by views\" for a channel. I built an MV3 Chrome extension to fill that gap, and shipped it to the Web Store after an adversarial security review by Claude × Codex."
---

# YouTube has no "period × popularity" filter — so I built my own Chrome extension

## What I built

A Chrome extension that lists a YouTube channel's videos within a chosen time range, sorted by popularity. Published on the Chrome Web Store.

[YouTube Period Popular Sorter — Chrome Web Store](https://chromewebstore.google.com/detail/youtube-%E6%9C%9F%E9%96%93%E5%88%A5%E4%BA%BA%E6%B0%97%E5%8B%95%E7%94%BB%E3%82%BD%E3%83%BC%E3%82%BF%E3%83%BC/gcoblkekjbplafeafmdgcghlcnenfdfp)

## Motivation — the friction I had

Whenever I subscribe to a new channel, I want to binge "the recent hits" in one sitting.

YouTube's native UI gives you a "Popular" tab and a "Newest" tab. Both fall short.

- **Popular**: cumulative across all time. New subscribers only see whatever blew up when the channel was young, with no signal on recent direction.
- **Newest**: ignores view count, so misses get mixed in. Bad fit for "skip the duds, just show me the ones people actually watched."

I wanted "the videos from the last 3 months, top 50 by views." A trivial query — and the native UI couldn't answer it.

There are external analytics sites that do this, but most require sign-up and feel heavy for "I just want to peek at one channel right now." I wanted something that lives in my browser and gives me an answer in two clicks.

If it doesn't exist, build it.

## How it works

A simple wrapper around YouTube Data API v3. A Manifest V3 extension at 22 files / 29KB ZIP total.

```
manifest.json              # MV3
popup/                     # mini UI shown when the icon is clicked
options/                   # API key settings page
results/                   # results page (opened in a new tab)
background/service-worker.js   # YouTube Data API v3 calls
lib/youtube-api.js         # API wrapper
lib/cache.js               # 24h local cache
```

"Channel videos within a date range, sorted by views" maps to two API calls:

1. `search.list` with `channelId` + `publishedAfter` returns video IDs (max 50 per page, 2 pages = 100)
2. `videos.list` returns `viewCount`, `likeCount`, `commentCount` for those IDs in one batch
3. The client sorts by the chosen metric and renders

Sorting happens client-side, not via API. Re-sorting doesn't burn quota — important because the free tier is 10,000 units/day.

### Cache design

Fetching 50 results costs about 101 units; 100 results about 202 units. Without caching, repeat queries on the same channel/period exhaust the daily budget fast.

I implemented a 24-hour local cache in `chrome.storage.local`. Up to 30 entries, TTL 24h, LRU eviction. Repeat queries on the same condition cost zero quota. "Wait, let me look at that again" is free.

A force-refresh button covers the "I want the freshest numbers right now" case. Default is cached, override is one click.

## Security review before publishing

Putting something on the Web Store under your own name comes with responsibility. "It works on my machine" wasn't enough.

As a final gate before submission, I ran an adversarial security review with Claude (Opus) and Codex (gpt-5.4) in parallel. Both got the same 15-point checklist and produced findings independently. I merged the two lists, prioritized, fixed the issues, and asked Codex for an independent re-review.

End result: 3 Critical/High + 3 Medium + 3 Low — all fixed before publishing. Highlights below.

### CSV/TSV formula injection

Exported CSV/TSV can carry `=cmd|...` or `+SUM(...)` strings. Excel and Google Sheets evaluate those automatically when opened. Channel names and video titles are partially attacker-controlled, so a crafted input could attack the *user* of my extension.

My first pass only neutralized in `escapeCsv`. Codex flagged that the TSV path was completely uncovered.

```javascript
function neutralizeFormula(s) {
  if (typeof s !== 'string') return String(s);
  // Match leading whitespace too — closes \t=cmd... bypass
  return /^\s*[=+\-@]/.test(s) ? "'" + s : s;
}
```

I applied the same sanitizer to both `escapeCsv` and `toTsv`, with the order "neutralize formula → flatten newline-class whitespace" so `\t=cmd...` style bypasses don't slip through.

### API key leakage resistance

The user's YouTube Data API key is stored as plaintext in `chrome.storage.local`. That's a baseline limitation of MV3 extensions — there's no truly secret store. But not stating "stored as plaintext" in `PRIVACY.md` would be dishonest, and any path where `?key=...` could leak into logs or UI text is effectively a leak channel.

I added `sanitizeForLog()` and `sanitizeForDisplay()` in both the service worker and the options page, replacing `?key=...` with `[REDACTED]`. The key never leaves storage in user-visible form.

I also flipped the help text to recommend application restrictions as required: pinning the key to `chrome-extension://<your-id>/*` makes it useless from anywhere else if it ever leaks.

### Thumbnail URL validation

`<img src={video.thumbnail}>` was using whatever URL the API returned. "It came from the API" doesn't make it safe. I added `safeThumbnailUrl()` to enforce https + YouTube CDN allowlist (`i.ytimg.com`, `yt3.ggpht.com`, etc.) and added `referrerPolicy="no-referrer"`.

```javascript
const ALLOWED_HOSTS = new Set([
  'i.ytimg.com', 'yt3.ggpht.com', 'yt3.googleusercontent.com',
  'i9.ytimg.com', 'i.ggpht.com'
]);

function safeThumbnailUrl(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return null;
    if (!ALLOWED_HOSTS.has(u.hostname)) return null;
    return u.toString();
  } catch {
    return null;
  }
}
```

A small defense, but it stops attacker-controlled hosts from sneaking into the extension's DOM under the guise of a CDN URL.

### Filename Unicode sanitization

CSV download filenames include the channel name. A Bidi override character (RLO) can flip `report.txt` to look like `report.exe` — classic extension-spoofing trick.

I sanitize with NFC normalize → strip `\p{C}` (all invisible/control characters) → trim trailing dots and whitespace → cap at 40 chars. That covers Bidi, zero-width, invisible, and BOM in one pass.

## Pre-distribution guards

Fixing once isn't enough — I want the same mistake not to come back in the next release.

I added pre-flight checks to `scripts/build-zip.sh`:

- Fails the build if any `<YOUR_*>` placeholder is left in the source
- Fails if it spots a Google API key (`AIza...`) or private-key signature

Every ZIP build runs these. "Oops, I committed a key and shipped it" is now physically blocked.

## Reflections

**Chrome MV3 stays surprisingly tiny when you keep it minimal.** 22 files, 29KB ZIP. Plain HTML + JS, no bundler, no package manager. I'd assumed extensions were heavy; for a pure API wrapper + UI, a few hundred lines is enough.

**The gap between "for me" and "for the public" is mostly the security review.** The working version took a day. But "runs on my Chrome" and "runs on someone else's Chrome" are different products. The Claude × Codex adversarial pass is what got it across the line. On my own, I'd have shipped the formula injection bug for sure.

**Friction-driven personal projects are strong.** When the motivation is "this annoys me right now," scope decisions don't drift. Custom date ranges, 200/500-result limits, side-panel UI — all on the roadmap, but I'll only build them if I personally hit the friction. That's enough.

The repo is MIT-licensed. If you've felt the same frustration, just use it.

- [GitHub: Ryo722/youtube-period-sorter](https://github.com/Ryo722/youtube-period-sorter)
- [Chrome Web Store](https://chromewebstore.google.com/detail/youtube-%E6%9C%9F%E9%96%93%E5%88%A5%E4%BA%BA%E6%B0%97%E5%8B%95%E7%94%BB%E3%82%BD%E3%83%BC%E3%82%BF%E3%83%BC/gcoblkekjbplafeafmdgcghlcnenfdfp)
