---
title:
  ja: "Canvas APIで3レイヤーの画像合成エンジンを自作した"
  en: "Building a 3-layer image compositing engine with Canvas API"
date: 2026-03-29
tags: [Canvas API, React, TypeScript, Image Processing]
excerpt:
  ja: "カードゲームのオリカ生成ツールのために、Illustration / Text / Frameの3レイヤー合成エンジンをCanvas APIで自作した設計記録。"
  en: "Built a 3-layer compositing engine (Illustration / Text / Frame) with Canvas API for a custom card generator tool."
---

# Canvas APIで3レイヤーの画像合成エンジンを自作した

## 何を作ったか

デュエル・マスターズのオリジナルカード（オリカ）をブラウザ上で作成できるツール「DM オリカジェネレーター」を開発した。カード名、種族、コスト、パワー、効果テキストを入力し、イラストをアップロードすると、本格的なカード画像がPNG形式で出力される。

このツールの心臓部が、Canvas APIで自作した3レイヤーの画像合成エンジンだ。

## なぜ3レイヤーにしたか

カードの画像は3つの要素で構成されている。

1. **Illustration（背景）** — ユーザーがアップロードしたイラスト
2. **Text** — カード名、種族、効果テキスト、フレーバーテキスト
3. **Frame** — カード枠、コスト数値、パワー数値、レアリティ

これらは描画順序が重要だ。イラストが最背面、テキストが中間、フレームが最前面。フレームには透過部分があり、下層のイラストとテキストが見える仕組みだ。

各レイヤーを独立したcanvasバッファに描画し、最後にdrawImageで合成する。この設計にした理由は2つある。

**独立した描画ロジック**。各レイヤーは自分の責務だけを知っていればいい。IllustrationLayerは画像の配置だけ、TextLayerはテキスト描画だけ、FrameLayerは枠の描画だけに集中できる。

**再描画の最適化**。テキストだけ変更された場合、IllustrationLayerとFrameLayerは再描画不要で、TextLayerだけ更新すればいい。

## CanvasRendererの設計

合成エンジンの核は `CanvasRenderer` クラスだ。

```typescript
class CanvasRenderer {
  constructor(layers: Layer[])
  async render(data: CardRenderData): Promise<HTMLCanvasElement>
  dispose(): void
}
```

コンストラクタでレイヤー配列を受け取り、各レイヤー用のcanvasバッファを事前確保する。`render()` で全レイヤーを順序通りに描画し、最後に合成結果を返す。

合成処理はシンプルだ。

```typescript
private composite(): HTMLCanvasElement {
  const rc = CanvasFactory.createRenderContext();
  for (const layerRc of this.layerContexts) {
    rc.ctx.drawImage(layerRc.canvas, 0, 0);
  }
  return rc.canvas;
}
```

各レイヤーのcanvasを順番に描画するだけ。透過部分はそのまま下層が見える。Canvas APIの `drawImage` が透過合成を自動的に処理してくれる。

レイヤーの登録順序がそのまま合成順序になる。

```typescript
const layers = [
  new IllustrationLayer(),  // 第1層: 背景画像
  new TextLayer(),          // 第2層: テキスト
  new FrameLayer(),         // 第3層: カード枠
];
const renderer = new CanvasRenderer(layers);
```

## テキスト描画パイプライン

3レイヤーの中で最も複雑なのがTextLayerだ。カードゲームのテキストは単純なfillTextでは済まない。

テキスト描画は3段階のパイプラインで処理している。

**TextProcessor** — テキストの前処理。効果テキスト内のアイコン記号（ブロッカーマーク等）を検出し、テキストセグメントとアイコンセグメントに分割する。

**TextMeasurer** — テキスト幅を計測し、折り返し位置を決定する。効果テキストが長い場合、フォントサイズを自動的に縮小して枠内に収める。

**TextRenderer** — 実際のCanvas描画。テキストに縁取り（ストローク）を追加し、背景画像の上でも読みやすくする。

この3段階の分離により、「テキストの意味解析」「レイアウト計算」「描画実行」が独立している。フォントサイズの自動調整は TextMeasurer の責務、縁取りの太さは TextRenderer の責務、という具合だ。

## ツインパクトカードへの対応

デュエル・マスターズには「ツインパクト」という特殊なカード型がある。1枚のカードにクリーチャー面と呪文面の2つが存在する。

これに対応するため、各レイヤーにツインパクト用の描画ロジックを追加した。

IllustrationLayerでは、クリーチャー画像を通常通り描画した上で、呪文画像を-10度回転させて下部に配置する。TextLayerでも同様に、呪文面のカード名グループを-10度回転させて描画する。

画像のトリミングも2系統用意した。通常カード用（アスペクト比252:344）とツインパクト用（クリーチャー面252:344 + 呪文面252:140）で、それぞれCropper.jsのインスタンスを分けている。

## フォント管理

カードのテキストには LINE Seed JP フォントを使用している。Webフォントの読み込みは非同期なので、フォントが読み込まれる前にテキストを描画すると、フォールバックフォントで表示されてしまう。

FontLoaderクラスで `document.fonts.load()` を使い、描画前にフォントのプリロードを保証している。Promiseキャッシュにより、複数回呼び出しても実際のロードは1回だけ実行される。

## 振り返り

描画エンジン全体で約3,500行（テスト含む）。レイヤーごとの行数は以下の通り。

| レイヤー | コード行数 |
|---|---|
| IllustrationLayer | 59行 |
| TextLayer | 196行 |
| FrameLayer | 154行 |
| テキスト処理（3モジュール） | 588行 |
| フレーム処理（5モジュール） | 451行 |

TextLayerが最も複雑なのは、テキストの折り返し・フォント自動調整・縁取り・アイコン描画という複合的な処理があるからだ。

**レイヤー分離の効果**。各レイヤーが独立しているため、FrameLayerの描画を変更してもTextLayerには影響しない。新しいカード型を追加する場合も、各レイヤーに描画ロジックを追加するだけで対応できる。

**Canvas APIの限界**。テキスト描画の制御はCanvas APIの弱点だ。行間調整、文字間調整、縦書きなどはAPIレベルではサポートされておらず、TextMeasurer で自前計算する必要がある。SVGやDOM操作の方が柔軟だが、最終的にPNG出力する用途ではCanvas APIが最もシンプルだった。
