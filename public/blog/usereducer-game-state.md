---
title:
  ja: "useReducerでゲーム状態管理を設計する"
  en: "Designing game state management with useReducer"
date: 2026-03-29
tags: [React, TypeScript, useReducer, Game Development]
excerpt:
  ja: "スライドパズル×マッチ3ゲームの状態管理をuseReducerで設計した記録。13アクション型、408行の純粋ロジック層、アニメーション制御の話。"
  en: "Designing state management for a slide puzzle × match-3 game with useReducer. 13 action types, 408 lines of pure logic, and animation control."
---

# useReducerでゲーム状態管理を設計する

## 何を作ったか

「イーブイパネル8」——3×3の盤面でパネルをスライドし、同じ属性を3枚揃えて消すブラウザゲームを React + TypeScript で作った。スライドパズルとマッチ3を組み合わせた複合ゲームだ。

このゲームの状態管理を `useReducer` で設計した話を書く。

## なぜ useReducer を選んだか

ゲームの状態は複雑だ。盤面の配置、スコア、残り時間、進化ゲージ、フィーバー状態、アニメーションフェーズ——これらが密結合している。

useState で個別に管理すると、「スライド後にマッチ判定→消去→補充→再判定」という一連の状態遷移で、どの state をどの順序で更新すべきかが混乱する。

useReducer なら、`SLIDE_TILE` → `SLIDE_COMPLETE` → `MARK_CLEARING` → `APPLY_REFILL` → `APPEAR_COMPLETE` というアクション列で状態遷移を明示できる。各アクションの責務が明確になり、バグの原因特定が容易になる。

## GameState の構造

ゲームの全状態を1つの型で表現している。

```typescript
type GameState = {
  // フェーズ管理
  phase: 'title' | 'type-select' | 'playing' | 'result'

  // 盤面
  board: CellState[][]
  selectedType: 'water' | 'fire' | 'thunder' | null

  // スコア系
  score: number
  highScore: number
  clearCount: { water: number; fire: number; thunder: number }

  // タイマー・ゲージ
  timeRemaining: number
  evolutionGauge: number
  feverType: PanelType | null

  // アニメーション制御
  animationPhase: 'idle' | 'sliding' | 'clearing' | 'appearing'
  animationLocked: boolean
}
```

注目すべきは `animationPhase` と `animationLocked` だ。ゲームではアニメーション中にユーザー操作を受け付けてはいけない。`animationLocked` が true の間は `SLIDE_TILE` アクションを無視する。

## 13のアクション型

reducer が処理するアクションは13種類。

| アクション | フェーズ | 責務 |
|---|---|---|
| START_GAME | title → type-select | ゲーム開始 |
| SELECT_TYPE | type-select → playing | 属性選択、盤面初期化 |
| SLIDE_TILE | playing | パネルスライド開始 |
| SLIDE_COMPLETE | playing | スライドアニメ終了 |
| MARK_CLEARING | playing | マッチ消去フェーズ |
| APPLY_REFILL | playing | 補充後の盤面適用 |
| APPEAR_COMPLETE | playing | 出現アニメ終了 |
| TICK | playing | 1秒カウント |
| UPDATE_FEVER | playing | フィーバー属性更新 |
| END_GAME | playing → result | ゲーム終了・進化判定 |
| RESTART | result → title | リスタート |
| SET_HIGH_SCORE | any | ハイスコア更新 |

1回のスライド操作で、`SLIDE_TILE` → `SLIDE_COMPLETE` → `MARK_CLEARING` → `APPLY_REFILL` → `APPEAR_COMPLETE` の5アクションが連鎖する。マッチが連鎖すれば `MARK_CLEARING` → `APPLY_REFILL` → `APPEAR_COMPLETE` がループする。

## ロジック層の分離

reducer内に直接ロジックを書かず、408行の純粋関数群に分離した。

| 関数 | 行数 | 責務 |
|---|---|---|
| findMatches | 62行 | マッチ3検出（横・縦） |
| slideTile | 31行 | スライド可能判定・実行 |
| generateBoard | 75行 | 初期盤面生成 |
| refillBoard | 55行 | 消去後の補充 |
| evolution | 114行 | ゲージ計算・進化判定 |
| fever | 49行 | フィーバー判定 |
| score | 22行 | スコア計算 |

これらはすべて純粋関数で、Reactに依存しない。reducer は「どの関数をどの順序で呼ぶか」を制御するだけだ。

この分離の利点は、テストが書きやすいこと。`findMatches` に盤面を渡して結果を検証する、`evolution` にゲージ値を渡して進化判定を検証する——Reactコンポーネントを描画せずにロジックだけをテストできる。

## アニメーション制御のパターン

ゲームの状態遷移にはアニメーションが伴う。スライドして、消えて、補充されて、出現する。各アニメーションの開始と終了をアクションで管理するのがポイントだ。

```
SLIDE_TILE      → animationPhase: 'sliding',  animationLocked: true
SLIDE_COMPLETE  → animationPhase: 'idle',     マッチ判定実行
MARK_CLEARING   → animationPhase: 'clearing', 消去アニメ開始
APPLY_REFILL    → animationPhase: 'appearing', 出現アニメ開始
APPEAR_COMPLETE → animationPhase: 'idle',     再度マッチ判定
```

`animationLocked` は `SLIDE_TILE` で true になり、全アニメーション完了後に false に戻る。この間のユーザー操作はreducer内で無視される。

UIコンポーネントは `animationPhase` を見て CSS アニメーションのクラスを切り替えるだけ。ロジック層とアニメーション層の関心が分離されている。

## 進化ゲージの設計

このゲームには「進化ゲージ」がある。選んだ属性のパネルを消すとゲージが上がり、他の属性を消すとゲージが下がる。

```typescript
function calculateGaugeDelta(
  clearedType: PanelType,
  selectedType: PanelType,
  count: number
): number {
  if (clearedType === selectedType) return count * GAUGE_PER_CLEAR
  return -(count * GAUGE_PENALTY)
}
```

ゲームバランスの調整はこの関数のパラメータを変えるだけでよい。実際、`GAUGE_PENALTY` の値はPRで何度か調整した。ロジックが純粋関数に分離されているから、パラメータ調整の影響範囲が明確だ。

## 振り返り

useReducer + 純粋関数ロジック層で、13アクション × 7ロジック関数のゲーム状態管理ができた。

**useReducer はゲームに向いている**。ゲームの状態遷移は「アクション→新状態」のパターンに自然にマッピングできる。アクション列を見れば何が起きたかが追跡でき、デバッグしやすい。

**ロジック層の分離はテストの生命線**。408行のロジックが全てReact非依存の純粋関数なので、Vitestでそのままテストできる。reducer自体のテストは状態遷移のテスト、ロジック関数のテストはアルゴリズムのテスト、と粒度を分けられる。

**アニメーションは「フェーズ」で管理する**。`animationPhase` を reducer で制御し、UIはフェーズに応じたCSSクラスを当てるだけ。setTimeoutやref でアニメーション状態を管理するよりも予測可能で、バグが出にくい。
