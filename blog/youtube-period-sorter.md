---
title:
  ja: "YouTubeの「期間×人気順」が公式にないので、自分用のChrome拡張を作った"
  en: "YouTube has no \"period × popularity\" filter — so I built my own Chrome extension"
date: 2026-05-03
tags: [Chrome Extension, JavaScript, YouTube API, Security Review]
excerpt:
  ja: "好きなチャンネルの「最近の代表作だけ人気順で見たい」がYouTube公式UIではできない。空白を埋めるためのChrome拡張をMV3で作り、Claude × Codexの敵対的セキュリティレビューを通してWeb Store公開した記録。"
  en: "YouTube's native UI can't show \"recent hits sorted by views\" for a channel. I built an MV3 Chrome extension to fill that gap, and shipped it to the Web Store after an adversarial security review by Claude × Codex."
---

# YouTubeの「期間×人気順」が公式にないので、自分用のChrome拡張を作った

## 何を作ったか

YouTubeのチャンネル動画を「指定した期間」かつ「人気順」で並べて表示するChrome拡張。Chrome Web Storeで公開している。

[YouTube 期間別人気動画ソーター — Chrome Web Store](https://chromewebstore.google.com/detail/youtube-%E6%9C%9F%E9%96%93%E5%88%A5%E4%BA%BA%E6%B0%97%E5%8B%95%E7%94%BB%E3%82%BD%E3%83%BC%E3%82%BF%E3%83%BC/gcoblkekjbplafeafmdgcghlcnenfdfp)

## 動機 — 自分が抱えていた不便さ

日々Youtubeを見る中で、「ここ最近の代表作だけ見たい」と思うことがよくあった。

YouTube公式UIには、「人気の動画」タブと「新着順」タブがある。だがこの2つには、それぞれ次のような問題がある。

- **人気の動画**: 全期間の累積。チャンネル開設初期にバズった動画ばかり並び、最近の傾向が分からない
- **新着順**: 再生回数を無視するので、外れ動画も混じる。素人が「外しを掴まずに代表作だけ見る」用途には向かない

「ここ3か月の動画を、再生回数の多い順で50件」だけ見たい。これだけのシンプルな要望が、公式UIでは叶わなかった。

外部サイトでチャンネル分析できるサービスはいくつかある。だが多くは登録制で、特定チャンネルだけ手早く見たい用途には重い。「自分のブラウザに住み着いて、必要なときに2クリックで結果が出る」ものが欲しかった。

ないなら作ればいい、という判断で着手した。

## 仕組み

YouTube Data API v3 を直接叩くだけのシンプルな構成。Manifest V3 のChrome拡張で、合計 22ファイル / 配布ZIP 29KB しかない。

```
manifest.json              # MV3
popup/                     # 拡張アイコンクリック時のミニUI
options/                   # APIキー設定画面
results/                   # 結果表示用の新規タブページ
background/service-worker.js   # YouTube Data API v3 呼び出し
lib/youtube-api.js         # APIラッパー
lib/cache.js               # 24時間ローカルキャッシュ
```

「特定チャンネルのある期間内の動画を再生数順で取る」のは、API的には次の組み合わせで実現できる。

1. `search.list` に `channelId` と `publishedAfter` を渡し、動画IDのリストを取得（最大50件 × 2ページで100件）
2. その動画IDで `videos.list` を一括問い合わせし、`viewCount` `likeCount` `commentCount` を取得
3. クライアント側で再生数（または他指標）でソートして表示

ソートはAPIではなくクライアント側でやる。並び替えのたびにAPIを叩かないので、無料枠（1日10,000ユニット）を浪費しない。

### キャッシュ設計

50件取得で約101ユニット、100件取得で約202ユニット消費する。同じチャンネル × 期間 × 件数の組み合わせで何度もキャッシュを叩かれると、すぐ無料枠が尽きる。

そこで `chrome.storage.local` に24時間ローカルキャッシュを実装した。最大30エントリ、TTL 24時間、LRU で古いものから捨てる。同条件の再検索はクォータを一切消費しない。「あ、もう一度見たい」が無料で済む設計だ。

「最新値が見たい」場合のために強制再取得ボタンも用意した。普通に使う分は自動でキャッシュ、必要なら一発で更新できる。

## Chrome Web Store公開前のセキュリティレビュー

Web Store に出すからには、セキュリティ観点でも可能な限り品質を高めたかった。

公開前の最終ゲートとして、Claude (Opus) と Codex (gpt-5.4) で敵対的セキュリティレビューを並列で実施した。両方に同じ15観点のチェックリストを渡し、別々に脆弱性を挙げてもらう。指摘を統合してから優先度付けし、修正後にもう一度Codexに独立検証させる、というフロー。

結果、Critical/High 3件 + Medium 3件 + Low 3件 の合計9項目を全て修正してから公開した。代表的なものを記録しておく。

### CSV/TSV Formula Injection

エクスポート機能のCSV/TSVに、`=cmd|...` `+SUM(...)` のような式が混入すると、Excelやスプレッドシートで開いた瞬間に勝手に評価されてしまう。チャンネル名や動画タイトルは攻撃者がある程度コントロールできるテキストなので、そこに細工があると拡張機能の利用者が被害を受ける。

最初の実装では `escapeCsv` だけ式無害化していた。だがCodexから「TSV経路はノーガード」と指摘が来た。

```javascript
// 強化後
function neutralizeFormula(s) {
  if (typeof s !== 'string') return String(s);
  // 先頭の空白類込みで判定（\t=cmd... のバイパスを塞ぐ）
  return /^\s*[=+\-@]/.test(s) ? "'" + s : s;
}
```

`escapeCsv` と `toTsv` の両方で同じ無害化を適用し、TSVは「式無害化 → 改行類の空白化」の順序で処理することで `\t=cmd...` のバイパスも塞いだ。

### APIキー漏洩耐性

ユーザーが発行したYouTube Data APIキーは `chrome.storage.local` に平文で保存している。これはMV3拡張の前提として避けられない（拡張内に安全に保存する仕組みがない）。だが「平文保存」を `PRIVACY.md` に明記しないのは不誠実だし、エラーメッセージやログに `?key=...` が混じる経路があれば実質的な漏洩源になる。

そこで service worker と options 画面の両方で `?key=...` を `[REDACTED]` に置き換える `sanitizeForLog()` / `sanitizeForDisplay()` を追加した。エラー文言を画面に出すときも、ログに残すときも、APIキーは絶対に表に出ない。

ヘルプの誘導も「アプリケーション制限を必須推奨」に書き換えた。`chrome-extension://<拡張ID>/*` で制限すれば、万一キーが流出しても他経路から使えない。

### サムネイルURL検証

`<img src={video.thumbnail}>` のサムネイルURLは、APIから返ってきた値をそのまま使っていた。だが「APIが返した値だから安全」とは限らない。`safeThumbnailUrl()` で https + YouTube CDN allowlist (`i.ytimg.com`, `yt3.ggpht.com` など) を強制し、`referrerPolicy="no-referrer"` も付与した。

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

地味な防御だが、CDNドメインに化けた攻撃URLが拡張内のDOMに入ることを防ぐ。

### ファイル名のUnicodeサニタイズ

CSVダウンロード時のファイル名に、チャンネル名がそのまま使われる。Bidi制御文字（RLO）を仕込まれると `report.txt` が `report.exe` のように見える拡張子偽装が成立する。

NFC正規化 → `\p{C}`（不可視文字全般）の全除去 → 末尾ドット・空白除去 → 40字制限、の順でサニタイズした。Bidi、ゼロ幅、Invisible、BOMをまとめてカバーできる。

## 配布前ガード

修正だけして満足してはダメで、「同じミスが次のリリースで戻ってこない」仕組みも入れた。

`scripts/build-zip.sh` に、配布ZIPを作る前のチェックを追加した。

- プレースホルダ（`<YOUR_*>`）が残っていたら fail
- AIza で始まるGoogle APIキーパターンや秘密鍵パターンが混入していたら fail

ZIPを作るたびにこのチェックが走る。ヒューマンエラーで「うっかりキーをコミットしたまま配布」が起きないようにした。

## 振り返り

**ChromeのMV3はミニマルに作ると本当に小さい**。22ファイル、29KB。HTML+JSだけで、ビルドツールもパッケージもない。「拡張は重そう」というイメージがあったが、純粋なAPIラッパー＋UIなら数百行で済む。

**「自分用」と「公開用」の差は、ほぼセキュリティレビューに集約される**。動かすだけなら1日で書けた。だが「自分のChromeで動かす」と「自分以外のChromeで動かす」の間には、責任の差が大きい。Claude × Codex の敵対的レビューでようやく公開ラインに乗せられた。1人で書いて1人で確認していたら、Formula Injection は確実に見落としていた。

**個人開発の不便さ駆動は強い**。動機が「自分が困っている」だと、機能の取捨選択がブレない。「カスタム期間指定」「200/500件への上限拡張」「サイドパネルUI」あたりはロードマップに入っているが、自分が困ったら作る。困らないなら作らない。それでいい。

リポジトリはMITライセンスで公開している。同じ不便さを抱えていた人がいたら、そのまま使ってほしい。

- [GitHub: Ryo722/youtube-period-sorter](https://github.com/Ryo722/youtube-period-sorter)
- [Chrome Web Store](https://chromewebstore.google.com/detail/youtube-%E6%9C%9F%E9%96%93%E5%88%A5%E4%BA%BA%E6%B0%97%E5%8B%95%E7%94%BB%E3%82%BD%E3%83%BC%E3%82%BF%E3%83%BC/gcoblkekjbplafeafmdgcghlcnenfdfp)
