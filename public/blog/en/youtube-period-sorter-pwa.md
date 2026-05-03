---
title: "Shipping a Chrome extension as a PWA — sharing the same lib/ between both surfaces"
date: 2026-05-03
tags: [PWA, Chrome Extension, Service Worker, JavaScript, Web Share Target]
excerpt: "After shipping the Chrome extension, my biggest gap was 'I can't use it on my phone.' I split chrome.* dependencies into platform / backend layers so the same lib/ powers both the extension and a PWA — one codebase, two distributions."
---

# Shipping a Chrome extension as a PWA

## What I did

I rewrote [YouTube Period Popular Sorter](https://chromewebstore.google.com/detail/youtube-%E6%9C%9F%E9%96%93%E5%88%A5%E4%BA%BA%E6%B0%97%E5%8B%95%E7%94%BB%E3%82%BD%E3%83%BC%E3%82%BF%E3%83%BC/gcoblkekjbplafeafmdgcghlcnenfdfp) — already published on the Chrome Web Store — so it can ship as a **PWA from the same source tree**. It installs to iOS / Android home screens, and on Android it shows up in the YouTube app's share sheet.

The PWA lives alongside the docs on GitHub Pages:

- Extension: <https://chromewebstore.google.com/detail/youtube-%E6%9C%9F%E9%96%93%E5%88%A5%E4%BA%BA%E6%B0%97%E5%8B%95%E7%94%BB%E3%82%BD%E3%83%BC%E3%82%BF%E3%83%BC/gcoblkekjbplafeafmdgcghlcnenfdfp>
- PWA: <https://ryo722.github.io/youtube-period-sorter/app/>

This post is about the **realistic migration path** from a shipped extension to a PWA — not about building one from scratch. For background on the original extension, see [the previous post](./youtube-period-sorter).

## Why ship a PWA at all

What I learned after publishing to the Web Store: **the only people I can reach via the store are PC Chrome users**.

When friends tested it, the loudest feedback was "I want this on my phone." That matched my own usage — most of the time I'm browsing YouTube, I'm in bed on my phone wondering "what's been blowing up on this channel lately." I rarely have my laptop open.

But Chrome extensions don't run on Android Chrome (forget iOS entirely). No matter how polished the desktop store listing is, I'm losing more than half the realistic surface area.

Building a separate mobile app from scratch felt wrong. The period filtering, the 24h local cache, the CSV/TSV formula injection guards — they all already live in the extension. **The right answer was "run the same logic in a PWA."**

So I refactored: pull all `chrome.*` calls out of the app layer, hide them behind swappable adapters.

## Design: split into three layers

The original `lib/` was a flat YouTube API wrapper plus cache. I split it into **platform / backend / app**.

```
lib/
├── platform/          # environment adapters (extension vs. web)
│   ├── env.js        # isExtension() — runtime detection
│   ├── storage.js    # chrome.storage.local ⇄ localStorage
│   ├── tabs.js       # active tab ⇄ Web Share Target
│   ├── runtime.js    # navigation (results / options)
│   └── messaging.js  # popup ⇄ service worker
├── backend/          # API logic (environment-agnostic)
│   ├── fetch-popular-videos.js
│   ├── sanitize.js
│   └── validate.js
├── cache.js          # 24h cache (goes through storage.js)
└── youtube-api.js    # YouTube Data API v3 wrapper
```

The rule: **the app layer (popup / options / results) never touches `backend` or `cache` directly — always via `platform`**. With that, the app and backend files are **byte-identical** between the extension and the PWA. Only `platform` branches.

The branching itself is two lines in `lib/platform/env.js`:

```javascript
export const isExtension = () =>
  typeof chrome !== "undefined" && chrome?.runtime?.id != null;
```

Just checking the `chrome` global misfires on Edge / Brave (those expose partial `chrome` objects). Walking down to `chrome.runtime.id` only succeeds inside an actual extension document — bulletproof split. Every other file imports `isExtension()` instead of duplicating the check.

## Implementation notes

### storage: chrome.storage.local ⇄ localStorage

This was the scariest piece. `chrome.storage.local` is async-Promise-based, `localStorage` is synchronous. To keep the app layer untouched, I **kept everything async** and made the web side wrap localStorage.

```javascript
export const storage = {
  async get(keyOrKeys) {
    if (isExtension()) return await chrome.storage.local.get(keyOrKeys);
    // Web: same shape, JSON-serialized localStorage
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    const result = {};
    for (const k of keys) {
      const v = readWeb(k);
      if (v !== undefined) result[k] = v;
    }
    return result;
  },
  // set, remove follow the same pattern
};
```

A surprise win was **handling iOS Safari private mode**. In private mode, `localStorage.setItem` throws `QuotaExceededError`. I catch it, fall back to an in-memory `Map`, and migrate any pre-existing localStorage entries into memory so the session keeps working. Persistence is gone, but the user never sees a "broken storage" state.

```javascript
function writeWeb(key, value) {
  if (useMemory) { memoryFallback.set(key, value); return; }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // QuotaExceededError / SecurityError → escape to memory
    useMemory = true;
    tryMigrateLocalStorageToMemory();
    memoryFallback.set(key, value);
  }
}
```

### tabs: active tab ⇄ Web Share Target

The extension uses `chrome.tabs.query` to read the URL of the currently active tab. PWAs have no equivalent, so I use **Web Share Target** to receive a channel from elsewhere.

In `manifest.webmanifest`:

```json
{
  "share_target": {
    "action": "./",
    "method": "GET",
    "params": { "url": "url", "text": "text", "title": "title" }
  }
}
```

That registers the PWA in Android Chrome's share sheet. Tapping "share" inside the YouTube app and picking the PWA launches it with `?url=...&text=...&title=...`.

`tabs.js` parses that query, looking for `@handle` or `UCxxx`:

```javascript
export async function getActiveYouTubeChannel() {
  if (isExtension()) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return parseChannelFromUrl(tab?.url);
  }
  // PWA: Web Share Target / URL params
  const params = new URLSearchParams(location.search);
  const candidate =
    params.get("url") || params.get("text") ||
    params.get("channel") || params.get("title") || null;
  return parseChannelFromUrl(candidate);
}
```

`parseChannelFromUrl` is shared. It handles `youtube.com/@handle`, `youtube.com/channel/UC...`, and the bare `@handle` literal.

### runtime: navigation

The extension opens a new tab via `chrome.tabs.create({ url: chrome.runtime.getURL(...) })`. The PWA runs in a single window, so I navigate within the window using `window.location.href`.

```javascript
export function openResultsPage(params) {
  const qs = params instanceof URLSearchParams ? params.toString() : String(params || "");
  if (isExtension()) {
    const url = chrome.runtime.getURL(`results/results.html${qs ? "?" + qs : ""}`);
    return chrome.tabs.create({ url });
  }
  window.location.href = `../results/results.html${qs ? "?" + qs : ""}`;
}
```

I kept the original `popup / options / results` directory layout in the PWA dist instead of flattening. That meant zero `import` path tweaks — `build-pwa.sh` is just a recursive copy.

## Build: emit dist/pwa next to the extension ZIP

A single bash script. No Webpack, no Vite.

```bash
# core of scripts/build-pwa.sh
cp -R popup options results lib "$OUT_DIR/"
cp -R icons "$OUT_DIR/icons/"  # 16-128 + 192 + 512
cp public/manifest.webmanifest public/sw.js public/index.html "$OUT_DIR/"
cp -R public/screenshots "$OUT_DIR/"

# inject <link rel="manifest"> into popup/options/results .html for PWA only
# (the extension can't have this link — it 404s under chrome-extension://)
inject_pwa_head "$OUT_DIR/popup/popup.html"
```

Making `OUT_DIR` an env override turns this into a one-liner deploy:

```bash
OUT_DIR=docs/app ./scripts/build-pwa.sh
```

GitHub Pages can serve from `docs/`, so emitting into `docs/app/` ships the PWA at `https://ryo722.github.io/youtube-period-sorter/app/` — **no extra repo, no `gh-pages` branch**. The existing docs (index.md / PRIVACY.md / MOBILE.md) stay at `docs/` and the PWA hides under `app/` so they don't clash.

Don't forget `docs/.nojekyll` to disable GitHub Pages' default Jekyll processing — without it, anything starting with `_` gets stripped.

## Service Worker: keep it minimal

The whole PWA offline story is one Service Worker that does two things:

1. Pre-cache static assets (HTML / CSS / JS / icons) on install.
2. On fetch, serve same-origin requests cache-first.

```javascript
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Don't cache YouTube Data API — lib/cache.js already does 24h itself
  if (url.origin === "https://www.googleapis.com") return;
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((hit) => hit ?? fetch(req).then(...))
  );
});
```

I deliberately don't cache YouTube Data API responses in the SW. `lib/cache.js` already maintains a 24h cache; doubling it in the SW would just create two sources of truth. One layer, one responsibility.

The `VERSION` string gets replaced with the build timestamp at build time, which guarantees a clean cache flip on every deploy:

```bash
BUILD_TS=$(date +%Y%m%d%H%M%S)
sed -i '' "s/const VERSION = \"v1\";/const VERSION = \"v1-${BUILD_TS}\";/" "$OUT_DIR/sw.js"
```

## Mobile UI: branch via media queries

The extension popup is locked to 360x600. Pasting that straight onto an iPhone (414x896) leaves it floating in whitespace.

The CSS responsive part is just media queries. The trick was **co-locating "extension layout" and "PWA layout" in one stylesheet**. I tag `<html>` with `data-platform="extension"` or `"web"` and gate the responsive rules on the web variant:

```javascript
// lib/platform/env.js
export const markPlatform = () => {
  document.documentElement.dataset.platform = isExtension() ? "extension" : "web";
};
```

```css
/* PWA only */
html[data-platform="web"] body { width: 100%; max-width: 480px; }

@media (max-width: 600px) {
  html[data-platform="web"] body { padding: 16px; font-size: 16px; }
}
```

The fixed extension popup stays untouched; the PWA fluidly resizes for mobile. One stylesheet, two surfaces, no fork.

## Reflections

**"Port after launch" produced a better architecture than "design for both up front" would have.** Trying to engineer the extension/PWA split before the extension shipped would have led to premature abstraction. Letting feature scope solidify first and then asking "how do I move this elsewhere" pulled the right seams (platform / backend) into focus naturally.

**Listing every `chrome.*` call was the highest-leverage step.** A grep across the repo turned up just four patterns — storage, tabs, runtime, messaging. Wrap each in an adapter, and the entire app layer ports without a single edit. Boring, mechanical, totally effective.

**Web Share Target punches above its weight.** On Android, "share from YouTube app to PWA" makes the PWA's UX parity-of-experience with the extension's "click while on a YouTube tab" flow. Five lines of manifest plus URL-query parsing. Small effort, large reach.

**No build tooling stays a feature, not a regression.** Skipping Webpack/Vite let me keep the extension ZIP and the PWA dist in one bash script. No CI needed, no migration when the next ecosystem churn hits.

MIT licensed. If you're sitting on a Chrome extension and thinking "I wish this ran on my phone," the layer-split recipe above is yours to copy.

- [Open the PWA](https://ryo722.github.io/youtube-period-sorter/app/)
- [Mobile install guide (docs/MOBILE.md)](https://github.com/Ryo722/youtube-period-sorter/blob/main/docs/MOBILE.md)
- [GitHub: Ryo722/youtube-period-sorter](https://github.com/Ryo722/youtube-period-sorter)
- [Previous post: building the extension](./youtube-period-sorter)
