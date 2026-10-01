---
title:
  ja: "手元のフォーク変更をOSSコントリビュートに昇格させた全過程"
  en: "Turning local fork changes into proper OSS contributions"
date: 2026-03-29
tags: [OSS, Git, Code Review, AI, Python]
excerpt:
  ja: "4つのAI音声・映像系リポジトリの手元変更を精査し、個人設定を除去、破壊的変更を分離、PR品質に引き上げた過程の記録。"
  en: "Auditing local changes across 4 AI voice/video repositories — removing personal config, isolating breaking changes, and elevating to PR quality."
---

# 手元のフォーク変更をOSSコントリビュートに昇格させた全過程

## きっかけ

ポートフォリオの改善を進める中で、Documents配下に4つのAI系リポジトリのクローンがあることに気づいた。いずれもmacOSで動かすために手を加えたもので、コミットせずに放置していた。

| リポジトリ | 用途 | 変更状態 |
|---|---|---|
| Style-Bert-VITS2 | 音声合成 | 6ファイル変更 |
| MotionPNGTuber | リアルタイム口パク | 4ファイル変更 |
| RVC-WebUI-MacOS | 音声変換 | 3ファイル変更 |
| Applio | 音声変換 | 5ファイル変更 |

「これ、そのままPRに出せるのでは？」と思ったが、実際に精査してみると全くそのままでは出せなかった。

## 精査のチェックリスト

PRに出す前に、6つの観点で全変更を精査した。

1. **個人設定の混入** — ローカルパス、個人モデル名、個人用デフォルト値
2. **変更の汎用性** — macOS以外の環境を壊さないか
3. **上書き vs 拡張** — 既存機能を消していないか、条件分岐で拡張しているか
4. **PRとしての体裁** — コミット粒度、不要な変更の混入、分割の必要性
5. **上流リポジトリとの関係** — 活動状況、既存Issue/PR、コントリビューションガイド
6. **分離可能性** — 独立した変更が混在していないか

このチェックリストを1リポジトリずつ適用していった。

## Style-Bert-VITS2 — 最も体系的な修正

### 発見した問題

macOS対応の変更は体系的だったが、3つの問題があった。

**問題1: デバイス検出のハードコード**

```python
_DEVICE = "cpu"  # macOS: force CPU for DDP compatibility
```

CUDA環境でもCPUになってしまう。正しくは自動検出にすべきだ。

```python
if torch.cuda.is_available():
    _DEVICE = "cuda"
elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
    _DEVICE = "mps"
else:
    _DEVICE = "cpu"
```

**問題2: evaluate関数のデバイス指定が不統一**

train関数では `_DEVICE` 変数を使っているのに、evaluate関数では `"mps" if torch.backends.mps.is_available() else "cpu"` を直接書いていた。同じロジックが2箇所に散らばっている。`_DEVICE` に統一した。

**問題3: non_blockingの消失**

元コードの `.cuda(local_rank, non_blocking=True)` を `.to(_DEVICE)` に置き換えた際、`non_blocking=True` が消えていた。CUDA環境でのデータ転送パフォーマンスが低下する。

```python
_nb = _DEVICE == "cuda"
x = x.to(_DEVICE, non_blocking=_nb)
```

### PR分割

1つのリポジトリに対して3つの独立した変更があったため、PRを3本に分割した。

| PR | 内容 | ファイル数 |
|---|---|---|
| pyopenjtalk互換性修正 | `unset_user_dict()` 存在チェック + localhost修正 | 4 |
| 学習スクリプトのクロスプラットフォーム対応 | CUDA/MPS/CPU分岐 | 1 |
| macOS用requirements | 依存関係ファイル追加 | 1 |

分割した理由は、レビュワーの負荷を下げるためだ。6ファイルの変更を1本のPRにまとめると、「pyopenjtalkのAPI互換」と「PyTorchのデバイス分岐」という全く異なる関心事が混ざる。レビュワーは「この変更はどの問題を解決しているのか」が掴みにくくなる。

## MotionPNGTuber — 汎用改善と破壊的変更の分離

### コントリビュートに出せた変更

口スプライトのバウンシング防止は、プラットフォーム非依存のバグ修正だ。

- リサイズ後の口画像がキャンバスをはみ出す → クランプ処理追加
- 口の開閉が閾値付近でバタつく → ヒステリシスデッドバンド（4%）追加
- `cv2.imshow` のGILレース → `except cv2.error` で捕捉

ただし、元コードの `except Exception: pass` は広すぎた。`cv2.error` に絞ることで、予期しないエラーが握りつぶされるのを防いだ。

### コントリビュートに出せなかった変更

`pyproject.toml` と `uv.lock` がWindows/CUDA用からmacOS用に**完全に上書き**されていた。これをそのままPRに出すと、Windowsユーザーの環境が壊れる。

元のpyproject.tomlは `torch==1.13.1+cu117` や `mmcv-full` のWindows用whlを指定していた。これをmacOS用に差し替えるのではなく、`pyproject.macos.toml` のような別ファイルを追加すべきだ。しかし、それはこのPRのスコープを超えるので、バグ修正のみを切り出した。

## RVC-WebUI-MacOS — 個人設定の山

### 発見した個人設定

このリポジトリの変更は、ほぼ全てが個人設定だった。

| 変更 | 判定 |
|---|---|
| デフォルトモデル `mia.pth` | 個人のモデル名 |
| ピッチシフト 0→10 | コメントに「天童こもり default」と明記 |
| 子音保護 0.33→0.5 | 同上 |
| 言語 zh_CN→ja_JP | 言語のハードコード切替 |
| 起動時自動ロード | 個人モデルに依存 |

コメントに自分の名前（天童こもり）が書いてあるのは、正直に言えば恥ずかしかった。個人用の設定変更をそのままPRに出していたら、レビュワーに「これは何のためのデフォルト値ですか？」と聞かれて答えに困っただろう。

### 唯一コントリビュートに出せた変更

`torch.load` のPyTorch 2.6+互換性パッチだけは汎用的なバグ修正だ。10行の追加で、全macOSユーザーが恩恵を受ける。他の変更は全て除外した。

## Applio — 削除はコントリビュートではない

### 発見した問題

3つの `.bat` ファイル（Windows用）を削除していた。macOSで不要だから消した、という個人的な理由だ。

しかし上流リポジトリはWindows/Linux/macOS全てをサポートする設計になっている。Windows用スクリプトの削除は**破壊的変更**であり、絶対に受け入れられない。

### 唯一出せた変更

`run-install.sh` の実行権限付与（`chmod +x`）。これは0行の変更（メタデータのみ）だが、macOS/Linuxユーザー全員が `./run-install.sh` で直接実行できるようになる。

ただし、このリポジトリはIssue/PRが無効化されており、PR作成権限がなかった。ブランチをフォークにpush済みで、権限が得られればPR提出可能な状態にしてある。

## 提出結果

| リポジトリ | PR数 | 除外した変更 |
|---|---|---|
| Style-Bert-VITS2 | 3本 | 不要なコメント変更 |
| MotionPNGTuber | 1本 | pyproject.toml/uv.lock（破壊的） |
| RVC-WebUI-MacOS | 1本 | 個人設定5件 |
| Applio | 0本（権限不足） | .bat削除（破壊的）、config.json（ノイズ） |

合計6PR提出、1件は権限不足で保留。

## 振り返り

**「動いている変更」と「PRに出せる変更」は別物だ。** 手元で動くことと、他の環境を壊さないことは全く別の基準。`_DEVICE = "cpu"` のハードコードは自分のMacでは完璧に動くが、CUDA環境では学習速度が壊滅する。

**個人設定は思った以上に混入する。** 「ちょっとデフォルト値を変えただけ」が、コントリビュートの観点では致命的。特にコメントに自分の名前を書いていると、一目でわかる。

**削除は拡張ではない。** 自分の環境で不要なものを消すのは楽だが、他のユーザーには必要かもしれない。macOS対応は「Windows用コードを消す」のではなく「macOS用の分岐を追加する」ことだ。

**チェックリストがあると精査が安定する。** 6つの観点を1リポジトリずつ適用したことで、「これはPRに出せるか」の判断が属人的にならなかった。AIと一緒にチェックリストを作り、AIと一緒に精査する——この流れはOSSコントリビュートの品質管理にも効く。
