---
title:
  ja: "PNGTuberツールに3つの改善をコントリビュートした"
  en: "Contributing 3 improvements to a PNGTuber tool"
date: 2026-03-30
tags: [OSS, Python, PySide6, OpenCV, Performance]
excerpt:
  ja: "EasyPNGTuberに依存関係の最適化・macOS HiDPI対応・位置合わせの並列化を3ブランチに分けてコントリビュート。マルチプロセッシングで2-3倍の高速化を実現。"
  en: "Three contributions to EasyPNGTuber: dependency optimization, macOS HiDPI support, and parallelized alignment with multiprocessing for 2-3x speedup."
---

# PNGTuberツールに3つの改善をコントリビュートした

## EasyPNGTuberとは

PNGTuber（静止画アバター）用の表情差分画像を作成するPythonツール集。AI生成画像から目と口のパーツを抽出し、4パターン（目ON/OFF × 口ON/OFF）の表情差分を自動生成する。AKAZE/ORB特徴点マッチングで位置合わせを行い、マスク描画でパーツ領域を指定する。

PySide6でGUI、OpenCVで画像処理。個人開発者のrotejin氏が公開しているOSSだ。

VTuber活動の準備で使っていて、macOSでの使い勝手とパフォーマンスに改善の余地があった。改善は3つの独立したブランチに分けた。

## 改善1: 依存関係の最適化

`opencv-python` を `opencv-python-headless` に切り替えた。

EasyPNGTuberのGUIはPySide6が担当している。OpenCVはGUIなしの画像処理にしか使っていない。`opencv-python` には `highgui` モジュール（ウィンドウ表示機能）が含まれるが、PySide6と競合する可能性がある。`opencv-python-headless` はhighguiを含まないため、依存フットプリントが小さく、GUIフレームワークの競合リスクもない。

変更は `pyproject.toml` の1行とロックファイルの更新だけだ。

## 改善2: macOS UX

2つの問題を修正した。

**HiDPI対応（Retina displays）**

macOSのRetinaディスプレイでは、論理ピクセルと物理ピクセルが2:1になる。PreviewWidgetとMaskCanvasでデバイスピクセル比を取得し、スケーリング計算に反映させた。

```python
def _device_pixel_ratio(self) -> float:
    screen = self.screen()
    if screen is not None:
        return screen.devicePixelRatio()
    return 1.0
```

Retinaディスプレイでプレビュー画像がぼやける問題が解消された。

**ネイティブキーラベル**

undo/redoのツールチップが `Ctrl+Z` / `Ctrl+Y` とハードコードされていた。macOSでは `Cmd+Z` / `Cmd+Shift+Z` が正しい。`QKeySequence.NativeText` を使い、プラットフォームに応じたキーラベルを表示するようにした。

```python
self.btn_undo.setToolTip(
    QKeySequence(QKeySequence.StandardKey.Undo)
    .toString(QKeySequence.SequenceFormat.NativeText)
)
```

Windows/Linuxでは従来通り `Ctrl+Z` が表示される。

## 改善3: 位置合わせの並列化

これが最もインパクトの大きい変更だ。

EasyPNGTuberの位置合わせ処理は、2x2や3x3のグリッド画像を分割し、各スライスをベース画像に対してAKAZE特徴点マッチングで位置合わせする。元の実装はシリアル処理で、スライスを1枚ずつ順番に処理していた。

各スライスの位置合わせは独立している。ベース画像に対する変換行列の計算は、他のスライスの結果に依存しない。`multiprocessing.Pool` で並列化した。

```python
from multiprocessing import Pool, cpu_count

n_workers = min(len(align_args), max(1, cpu_count() - 1))
with Pool(processes=n_workers) as pool:
    results = pool.map(_align_single_slice, align_args)
```

ワーカー数はCPUコア数 - 1。PythonのGILがあるため `threading` では高速化できないが、`multiprocessing` ならCPUバウンドなOpenCVの画像処理を実際に並列実行できる。

`_align_single_slice` はモジュールレベルの関数として定義した。`multiprocessing.Pool.map` はpickle可能なオブジェクトしか渡せないため、インスタンスメソッドではなくトップレベル関数にする必要がある。各ワーカー内でAlignerインスタンスを生成する設計にした。

2x2グリッド（3差分スライス）で2-3倍、3x3グリッド（8差分スライス）ではより顕著な高速化を確認した。

## ブランチ設計

3つの改善を1つのPRにまとめなかった理由は、前回のOSSコントリビュートの経験から学んだことだ。

| ブランチ | 内容 | 変更規模 |
|---|---|---|
| `improve/update-dependencies` | opencv-python-headless への切替 | 2ファイル |
| `improve/macos-ux` | HiDPI + ネイティブキーラベル | 4ファイル、14行 |
| `improve/parallel-alignment` | 並列位置合わせ | 2ファイル、30行 |

レビュワーは「依存関係の変更」「UX修正」「パフォーマンス改善」をそれぞれ独立に評価できる。1本にまとめると、依存関係の変更に懸念があった場合に他の改善も巻き添えでブロックされるリスクがある。

## 振り返り

前回は4つのリポジトリの「個人設定の除去」と「破壊的変更の分離」が主な作業だった。今回は最初からコントリビュートを意識して作業したため、個人設定の混入はゼロだった。

チェックリストを内面化できたと感じる。変更を加える時点で「これは他の環境を壊さないか」「これは個人設定ではないか」を自然に考えるようになった。

マルチプロセッシングの並列化は、PythonのGIL制約を意識した設計判断が必要だった。`threading` で書いてから「CPUバウンドだからGILで並列化されない」と気づいて `multiprocessing` に書き直した。AIとの壁打ちでこの判断は早かった。
