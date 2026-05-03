---
title:
  ja: "Chrome拡張をPWA化してスマホ対応した話 — 同一コードを拡張とPWAで共有する"
  en: "Shipping a Chrome extension as a PWA — sharing the same lib/ between both surfaces"
date: 2026-05-03
tags: [PWA, Chrome Extension, Service Worker, JavaScript, Web Share Target]
excerpt:
  ja: "Chrome Web Store公開後の課題は「スマホで使えない」だった。同じlib/を拡張版とPWA版で共有するため、chrome.* 依存をplatform/backendレイヤに分離して、同一コードベースから2系統のビルドを出せるようにした記録。"
  en: "After shipping the Chrome extension, my biggest gap was 'I can't use it on my phone.' I split chrome.* dependencies into platform / backend layers so the same lib/ powers both the extension and a PWA — one codebase, two distributions."
---

# Chrome拡張をPWA化してスマホ対応した話

## 何をやったか

Chrome Web Storeで公開していた[YouTube 期間別人気動画ソーター](https://chromewebstore.google.com/detail/youtube-%E6%9C%9F%E9%96%93%E5%88%A5%E4%BA%BA%E6%B0%97%E5%8B%95%E7%94%BB%E3%82%BD%E3%83%BC%E3%82%BF%E3%83%BC/gcoblkekjbplafeafmdgcghlcnenfdfp)を、**同じソースツリーから PWA としてもビルドできる構成に書き直した**。iOS/Android のホーム画面に追加でき、Android なら YouTube アプリの「共有」メニューから直接呼び出せる。

PWA は GitHub Pages に同居させた:

- 拡張版: <https://chromewebstore.google.com/detail/youtube-%E6%9C%9F%E9%96%93%E5%88%A5%E4%BA%BA%E6%B0%97%E5%8B%95%E7%94%BB%E3%82%BD%E3%83%BC%E3%82%BF%E3%83%BC/gcoblkekjbplafeafmdgcghlcnenfdfp>
- PWA版: <https://ryo722.github.io/youtube-period-sorter/app/>

本記事は **「拡張版を出した後でPWA化する」のリアルな移行手順** の記録。前提として既存の拡張版がどう動いていたかは[前作の記事](./youtube-period-sorter)を読んでほしい。

## なぜPWA化したか

Chrome Web Storeに出してみて分かったのは、**ストア経由でリーチできる人は「PCのChrome利用者」だけ** ということ。

身の回りでテストしてもらうと、「スマホで見るYouTubeを並べ替えたい」という声が一番多かった。実際自分も、ベッドの中でスマホでYouTubeを開いて「最近この人何が伸びてるんだろう」と思うシーンの方が、PCで開くより圧倒的に多い。

しかし Chrome 拡張は **Android Chrome では動かない** (iOSは言わずもがな)。PCの拡張機能ストアにいくら気合を入れても、利用シーン的には半分以下しか取れない。

別物を一から作るのは嫌だった。期間絞り込みのロジックも、24時間ローカルキャッシュも、CSV/TSVの Formula Injection 対策も、全部既存コードに入っている。**「同じロジックをPWAでも動かせる」のが理想**。

そこで「拡張機能から chrome.* を抜いて、その層だけ差し替え可能にする」方針で書き換えた。

## 設計: 3層に分離する

既存の lib/ は YouTube API ラッパーとキャッシュだけのフラットな構成だった。これを **platform / backend / app** の3層に分けた。

```
lib/
├── platform/          # 環境差分を吸収するアダプタ (拡張 / Web)
│   ├── env.js        # isExtension() — 実行環境の判定
│   ├── storage.js    # chrome.storage.local ⇄ localStorage
│   ├── tabs.js       # 現在タブの取得 ⇄ Web Share Target
│   ├── runtime.js    # ページ遷移 (results / options)
│   └── messaging.js  # popup ⇄ service worker メッセージング
├── backend/          # API呼び出し本体 (環境非依存)
│   ├── fetch-popular-videos.js
│   ├── sanitize.js
│   └── validate.js
├── cache.js          # 24時間ローカルキャッシュ (storage.js を経由)
└── youtube-api.js    # YouTube Data API v3 ラッパー
```

ポイントは **app 層 (popup/options/results) が backend や cache を直接叩かず、必ず platform 経由にする** こと。これで拡張版とPWA版で app と backend は完全に同じファイル、platform だけ実装が分岐する。

判定の核は `lib/platform/env.js` のたった2行だ。

```javascript
export const isExtension = () =>
  typeof chrome !== "undefined" && chrome?.runtime?.id != null;
```

`chrome` グローバルだけだと Edge や Brave で誤検知する (ブラウザ側で部分的に生えていることがある)。`chrome.runtime.id` までチェックすると拡張内ドキュメントでしか真にならないので、確実に分岐できる。各ファイルでこのチェックを重複させず、必ず `isExtension()` を経由する縛りにした。

## 実装の勘所

### storage: chrome.storage.local ⇄ localStorage

これが一番怖かった。`chrome.storage.local` は非同期 Promise API、`localStorage` は同期API。インターフェースを揃えるため、**全て async で統一**して app 側を変えずに済むようにした。

```javascript
export const storage = {
  async get(keyOrKeys) {
    if (isExtension()) return await chrome.storage.local.get(keyOrKeys);
    // Web: localStorage を JSON シリアライズして同じ shape を返す
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    const result = {};
    for (const k of keys) {
      const v = readWeb(k);
      if (v !== undefined) result[k] = v;
    }
    return result;
  },
  // set, remove も同様に分岐
};
```

予想外に効いた防御は **iOS Safari プライベートモード対応**。プライベートモードでは `localStorage.setItem` が `QuotaExceededError` を投げる。例外を握りつぶして in-memory Map にフォールバックする実装を入れて、「セッション内は機能する」状態を保てるようにした。永続化はされないが、ユーザーに「壊れた」と思わせない。

```javascript
function writeWeb(key, value) {
  if (useMemory) { memoryFallback.set(key, value); return; }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // QuotaExceededError / SecurityError 等 → メモリへ退避
    useMemory = true;
    tryMigrateLocalStorageToMemory();
    memoryFallback.set(key, value);
  }
}
```

### tabs: 現在タブ ⇄ Web Share Target

拡張版は `chrome.tabs.query` で「いま開いているタブの URL」が取れる。PWA にこの API は無いので、代わりに **Web Share Target** で受け取る。

manifest.webmanifest 側でこう宣言する。

```json
{
  "share_target": {
    "action": "./",
    "method": "GET",
    "params": { "url": "url", "text": "text", "title": "title" }
  }
}
```

これで Android Chrome は「YouTube アプリの共有メニュー」にPWAを並べてくれる。共有を選ぶと `?url=...&text=...&title=...` 付きで PWA が起動する。

`tabs.js` 側はこの URL クエリをパースして `@handle` や `UCxxx` を抽出する。

```javascript
export async function getActiveYouTubeChannel() {
  if (isExtension()) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return parseChannelFromUrl(tab?.url);
  }
  // PWA: Web Share Target / URL パラメタから取得
  const params = new URLSearchParams(location.search);
  const candidate =
    params.get("url") || params.get("text") ||
    params.get("channel") || params.get("title") || null;
  return parseChannelFromUrl(candidate);
}
```

`parseChannelFromUrl` は両方共通。`youtube.com/@handle` でも `youtube.com/channel/UC...` でも、生の `@handle` リテラル文字列でも同じパースで吸収する。

### runtime: ページ遷移

拡張版では `chrome.tabs.create({ url: chrome.runtime.getURL(...) })` で新規タブを開く。PWAは単独ウィンドウで動くので、`window.location.href` で同一ウィンドウ内遷移にする。

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

PWA でも `popup/options/results` の3階層構造をそのまま維持した。フラット化せずに済んだことで、import パスの調整が一切不要。`build-pwa.sh` は単に該当ディレクトリをコピーするだけ。

## ビルド: 拡張ZIPと並行して dist/pwa を出す

ビルドは bash スクリプト1本で済ませた。Webpack や Vite は要らない。

```bash
# scripts/build-pwa.sh の核
cp -R popup options results lib "$OUT_DIR/"
cp -R icons "$OUT_DIR/icons/"  # 16-128 + 192 + 512
cp public/manifest.webmanifest public/sw.js public/index.html "$OUT_DIR/"
cp -R public/screenshots "$OUT_DIR/"

# popup/options/results.html に PWA 用の <link rel="manifest"> を inject
# (拡張版でこの link を入れると chrome-extension:// 配下で 404 になるため、
#  ビルド時にだけ追加する)
inject_pwa_head "$OUT_DIR/popup/popup.html"
```

副作用として `OUT_DIR` を環境変数で上書きできるようにしておけば、デプロイ先に直接吐ける。

```bash
OUT_DIR=docs/app ./scripts/build-pwa.sh
```

GitHub Pages は `docs/` ディレクトリを root として配信できるので、`docs/app/` に PWA を吐けば **追加リポジトリも gh-pages ブランチも不要** で `https://ryo722.github.io/youtube-period-sorter/app/` で配信される。docs/ 直下には既存のドキュメントサイト (index.md / PRIVACY.md / MOBILE.md) があるので、PWA は `app/` サブディレクトリに分離してドキュメントと干渉させない。

GitHub Pages のデフォルト Jekyll 処理を無効化するため `docs/.nojekyll` を配置するのを忘れずに。これがないと `_` で始まるアセットが404になる。

## Service Worker は最小実装

PWA のオフライン対応は Service Worker を1個置くだけ。やっていることは2つ。

1. 静的アセット (HTML/CSS/JS/icons) を install 時にプレキャッシュ
2. fetch 時に同一オリジンのみ cache-first で応答

```javascript
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // YouTube Data API はキャッシュしない (lib/cache.js が 24h 独自管理)
  if (url.origin === "https://www.googleapis.com") return;
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((hit) => hit ?? fetch(req).then(...))
  );
});
```

YouTube Data API のレスポンスは Service Worker 側ではキャッシュしない。`lib/cache.js` が既に24時間ローカルキャッシュを実装しているので、SW で二重に持つ意味がない。「同じレイヤで2箇所に同じ責務を持たせない」だけのシンプルな線引きだ。

ビルド時に `VERSION` 文字列をビルド時刻に置換することで、再デプロイ時に確実に新キャッシュへ切り替わるようにしている。

```bash
BUILD_TS=$(date +%Y%m%d%H%M%S)
sed -i '' "s/const VERSION = \"v1\";/const VERSION = \"v1-${BUILD_TS}\";/" "$OUT_DIR/sw.js"
```

## モバイルUI: メディアクエリで分岐

拡張版の popup は 360x600 の固定サイズ。これを iPhone の 414x896 にそのまま出すと余白だらけで見栄えが悪い。

CSS のレスポンシブ対応自体は素直なメディアクエリで済むが、**「拡張版とPWA版で違うレイアウト」を1つの popup.css に同居させる**のがコツ。`html` 要素に `data-platform="extension"` か `"web"` を付与して、PWA時のみメディアクエリを発動させる。

```javascript
// lib/platform/env.js
export const markPlatform = () => {
  document.documentElement.dataset.platform = isExtension() ? "extension" : "web";
};
```

```css
/* PWA時のみモバイル対応 */
html[data-platform="web"] body { width: 100%; max-width: 480px; }

@media (max-width: 600px) {
  html[data-platform="web"] body { padding: 16px; font-size: 16px; }
}
```

拡張版の固定 popup レイアウトは無傷のまま、PWAだけがモバイル幅に伸縮する。1ファイルで2系統のUIを管理できて、メンテナンスコストが上がらない。

## 振り返り

**「公開してから移植」のほうが設計圧力が高くて結果的にいい構造になった**。最初から「拡張とPWA両方」を目指していたら、たぶん早すぎる抽象化で歪んだ。一度Web Storeに出して機能が固まってから「同じものを別環境に乗せる」課題と向き合うことで、platform / backend の分離線が自然に決まった。

**chrome.* に触る箇所をリストアップする工程が一番効いた**。grep で `chrome.` を全件出すと、storage / tabs / runtime / messaging の4種類しか使っていなかった。それぞれをアダプタに切り出すだけで、app 層は1行も触らずにPWA対応できた。「依存をリストアップして1個ずつ抽象化する」だけのシンプルな手順。

**Web Share Target は地味だが効く**。Android で YouTube アプリから直接 PWA に飛べるのは、利用フローが拡張版と完全に並ぶ体験になる (拡張は「タブで開いている YouTube から」、PWA は「YouTube アプリの共有から」)。`manifest.webmanifest` に5行書いて、`tabs.js` で URL クエリを読むだけ。コストは小さく、効果は大きい。

**ビルドフリーは正義**。Webpack/Vite を入れなかったことで、bash スクリプト1本で拡張ZIPと PWA dist の両方を出せる。CI も要らない。同一コードを2系統に出すという目的に対して、ビルドツールは必要なかった。

リポジトリは MIT ライセンスで公開。同じ「拡張をスマホでも使いたい」課題を抱えている人がいたら、layer 分離の手順は丸ごと真似してもらってOK。

- [PWA を直接開く](https://ryo722.github.io/youtube-period-sorter/app/)
- [スマホ版インストール手順 (docs/MOBILE.md)](https://github.com/Ryo722/youtube-period-sorter/blob/main/docs/MOBILE.md)
- [GitHub: Ryo722/youtube-period-sorter](https://github.com/Ryo722/youtube-period-sorter)
- [前作: 拡張機能を作った話](./youtube-period-sorter)
