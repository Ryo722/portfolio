---
title:
  ja: "ゼロトラスト自宅サーバーを3万円で構築した全記録"
  en: "Building a zero-trust home server for $200 — full record"
date: 2026-03-29
tags: [Infrastructure, Docker, Security, Cloudflare, Tailscale]
excerpt:
  ja: "NUCBox 3にCloudflare Tunnel × Tailscaleでポート開放なしの自宅サーバーを構築。2層ネットワーク・自動デプロイ・バックアップまでの全設計記録。"
  en: "Built a home server on NUCBox 3 with Cloudflare Tunnel × Tailscale — zero open ports. Full design record covering 2-layer networking, auto-deploy, and backup."
---

# ゼロトラスト自宅サーバーを3万円で構築した全記録

## 何を作ったか

GMKtec NUCBox 3（Celeron J4125, 8GB RAM, 128GB SSD）に、Dockerで6つのアプリケーションを載せた自宅サーバーを構築した。ハードウェア代は約3万円。

ポイントは**ポート開放が一切ない**こと。

- 公開経路: Cloudflare Tunnel（外部からのアクセス）
- 管理経路: Tailscale（SSH、メンテナンス）

この2つを完全に分離した。自宅ルーターのポートフォワーディングは使わない。UFWで全ポートをブロックし、Tailscale経由のSSHだけを許可している。

```
インターネット → Cloudflare Tunnel → Docker コンテナ（公開アプリ）
管理者 → Tailscale VPN → SSH → サーバー管理
```

## なぜゼロトラスト設計にしたか

自宅サーバーの最大のリスクは「外から入られること」だ。

クラウドなら AWS のセキュリティグループや VPC でネットワーク層を守れる。自宅サーバーにはそれがない。代わりに、Cloudflare Tunnel で「ポートを開けずに公開する」、Tailscale で「VPN経由でしか管理できない」という2つの壁を作った。

ファイアウォール（UFW）の方針は極めてシンプルだ。

- 受信は全ポートをデフォルト拒否
- 送信のみ許可
- 例外として、Tailscale VPNインターフェース経由のSSHだけを許可

SSHも最小限に絞っている。

- rootログイン禁止
- パスワード認証禁止（公開鍵のみ）
- 認証試行回数を制限
- 接続猶予時間を短く設定
- 許可ユーザーを必要最小限に限定

## 2層ネットワーク設計

Docker内のネットワークも2層に分離した。

```
公開系ネットワーク
  ├── Cloudflare Tunnel
  ├── フロントエンドアプリ群（Next.js）
  ├── バックエンドAPI群
  └── モニタリングツール

DB系ネットワーク
  ├── PostgreSQL
  └── バックエンドAPI群（公開系にも所属）
```

公開アプリは公開系ネットワークに所属し、Cloudflare Tunnel経由でアクセスされる。DBはDB系ネットワークにのみ所属し、外部から直接到達できない。バックエンドアプリは両方のネットワークに所属し、フロントからのリクエストを受けてDBにアクセスする。

## コンテナセキュリティ

全コンテナに以下のセキュリティ方針を適用している。

- **ファイルシステム読み取り専用**: コンテナ内での書き込みを禁止
- **全Linux capability除去**: 必要な権限のみ明示的に付与
- **権限昇格禁止**: 実行中の権限拡大を防止
- **一時領域はメモリ上**: ディスクへの書き込みを回避

`docker.sock` をコンテナに渡すことも禁止している。これを渡すと、コンテナ内からホストの全Dockerコンテナを操作できてしまう。

## GitHub Actionsで自動デプロイ

デプロイは「サーバー上でビルドしない」方針だ。

```
開発者PC → git push → GitHub Actions
  → Docker イメージビルド → GHCR に push
  → Tailscale でサーバーに接続 → SSH でイメージ pull
  → docker compose up -d
```

GitHub Actions 上でイメージをビルドし、GHCR（GitHub Container Registry）に保存する。サーバーはイメージをpullしてコンテナを起動するだけ。サーバーにNode.jsもPythonもインストールする必要がない。

ロールバックも簡単で、前のイメージタグに戻してcompose upするだけだ。

Tailscale の GitHub Action を使い、GitHub Actions のランナーからサーバーにVPN接続している。公開ポートなしでも、CI/CDパイプラインからサーバーにアクセスできる。

## バックアップ

バックアップは systemd timer で毎日 03:15 UTC に自動実行される。

```
バックアップ対象:
  ├── configs-and-data.tgz（設定ファイル + データ）
  └── PostgreSQL ダンプ
       ├── roles.sql（ロール定義）
       └── 各DB個別ダンプ（.dump形式）

保持期間:
  ├── ローカル: 14日
  └── 外部ディスク: 30日
```

PostgreSQLのバックアップは `pg_dumpall --globals-only` でロール定義を保存し、各DBを個別に `pg_dump` する。復元スクリプトも用意してある。

## モニタリング

Uptime Kuma を導入し、各アプリケーションのヘルスチェックを行っている。Cloudflare Tunnel 経由で公開ステータスページも提供している。

当初はPrometheus + Grafanaも計画していたが、NUCBox 3のリソース（8GB RAM）を考慮して見送った。Uptime Kuma だけでも、ダウン検知と通知は十分に機能している。

## 構築プロセス

このサーバーの構築過程は、AIとの対話記録として105KBのチャットログに残っている。

| 段階 | 内容 |
|---|---|
| chat1 | 初期設計・全体構成 |
| chat2 | ブラッシュアップ・ゼロポート設計 |
| chat3 | 実運用ファイル一式（compose, scripts, systemd） |
| chat4 | Dockerfile, SSH, UFW, セットアップスクリプト |
| chat5 | healthcheck, ロールバック, バックアップ, Uptime Kuma |

AIと対話しながら設計を詰め、段階的にインフラを構築した。chat1の初期設計からchat5の運用強化まで、5段階で徐々に成熟させている。

最終的な構成ファイル数は114個。セットアップスクリプト2個、バックアップスクリプト4個、systemdユニット8個、GitHub Actionsワークフロー4個。

## 振り返り

3万円のハードウェアで、ゼロトラストの自宅サーバーが構築できた。

**ポート開放なしは正義**。Cloudflare Tunnel のおかげで、自宅のIPアドレスを一切公開せずにWebアプリを配信できる。DDoSプロテクションもCloudflare側で対応してくれる。

**管理経路の分離は必須**。公開アクセスと管理アクセスを同じ経路にしてはいけない。Tailscale でVPN越しにしかSSHできない設計は、最初は面倒に感じたが、慣れれば安心感が圧倒的に違う。

**サーバーでビルドしない**。CI/CDでイメージをビルドし、サーバーはpullするだけ。サーバーの環境を汚さず、ロールバックも簡単。リソースが限られた小型サーバーほど、この方針が効く。

**AIと一緒にインフラを設計する利点**。シェルスクリプト、Docker Compose、systemdユニット、GitHub Actionsワークフロー——インフラのコードは種類が多く、それぞれに作法がある。AIに「UFWの設定はこうしたい」「systemd timerでバックアップを毎日回したい」と伝えれば、作法に沿ったコードが出てくる。人間はアーキテクチャの判断に集中できる。
