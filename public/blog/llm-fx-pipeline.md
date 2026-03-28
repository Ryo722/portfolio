---
title:
  ja: "LLMで銀行レポートを構造化する — M4FXのパイプライン設計"
  en: "Structuring bank reports with LLMs — M4FX pipeline design"
date: 2026-03-29
tags: [AI, LLM, Python, PostgreSQL, Finance]
excerpt:
  ja: "三菱UFJ・三井住友・りそなのFXレポートをLLMで構造化し、毎朝シグナルを自動生成するシステムの設計記録。6つのプロンプトと3つの時間帯パイプライン。"
  en: "Structuring FX reports from Japanese banks with LLMs to auto-generate daily signals. 6 prompts and 3 time-zone pipelines."
---

# LLMで銀行レポートを構造化する — M4FXのパイプライン設計

## 何を作ったか

邦銀（三菱UFJ・三井住友・りそな）が毎朝公開するFXレポートをLLMで構造化し、USD/JPYの売買シグナル候補を自動生成するシステム「M4FX」を開発している。60コミット、Streamlit UIで7画面。

人間がやることは朝のシグナルを確認して、トレードするかどうかを判断するだけだ。

## 3つの時間帯パイプライン

FX市場は24時間動いている。時間帯によって必要な情報が異なるため、3つのパイプラインを設計した。

| パイプライン | 時刻 | 目的 |
|---|---|---|
| 朝パイプライン | 08:45 | 銀行レポート取得→構造化→シグナル生成→通知 |
| 日中監視 | 09:00-23:00（30分毎） | ニュース監視→根拠崩れ判定 |
| マクロ分析 | 21:00-23:00 | 米国経済指標の自動分析 |

朝パイプラインが日次シグナルの中核。日中監視は「朝の判断がまだ有効か」を継続的にチェックする。マクロ分析は米国指標の発表時間帯に合わせて走る。

## LLMによるレポート構造化

銀行のFXレポートはPDFやHTML形式で、人間向けの自然言語で書かれている。これをLLMで構造化して、プログラムが扱えるJSONに変換する。

6つのプロンプトが連携して動く。

| プロンプト | 役割 |
|---|---|
| A: extract_report | 銀行レポートから方向性・レンジ・根拠を抽出 |
| B: proxy_score | 比率未記載時の代理スコアを計算 |
| C: daily_signal_brief | 複数銀行の分析を統合して日次シグナル説明を生成 |
| D: thesis_monitor | ニュースによる根拠崩れを判定 |
| E: macro_interpreter | 経済指標の市場インパクトを分析 |
| F: final_briefing | 全情報を統合した最終ブリーフィングを生成 |

プロンプトの設計にはパターンがある。YAMLフロントマター（id, version）でバージョン管理し、SystemプロンプトとUserプロンプトを分離し、`{{VARIABLE}}` 形式のテンプレート変数で動的データを注入する。出力はJSON形式を強制して、後続処理でパースしやすくしている。

## キャッシュとリトライ

LLM APIは遅いし、時々失敗する。2つの対策を入れている。

**2層キャッシュ**。インメモリキャッシュ（セッション中）とファイルキャッシュ（ディスク永続化）の2層構成。同じレポートを2回構造化する必要がない。API障害時にはファイルキャッシュからフォールバックで前回結果を返す。

**指数バックオフリトライ**。RateLimitErrorやTimeoutError時に指数バックオフで再試行する。一時的な障害で朝のシグナルが生成されない事態を防ぐ。

## 3層アーキテクチャ

システム全体は fetcher → service → repository の3層で構成している。

**Fetcher層**。銀行レポート、ニュースフィード、マーケットデータ、マクロ指標の4つのフェッチャーが外部データを取得する。

**Service層**。ビジネスロジックの核。ReportServiceがレポート取得→構造化を管理し、SignalServiceがシグナルを生成する。NewsMonitorServiceがニュース監視、MacroAnalysisServiceがマクロ分析を担当。

**Repository層**。SQLAlchemy + PostgreSQLでデータを永続化。コアモデル（Source, RawReport, StructuredReport, DailySignal）とアナリティクスモデル（MarketData, NewsEvent, MacroRelease等）で構成。

## 監視基盤

パイプラインが毎日動くシステムなので、「動いていないこと」に気づく仕組みが必要だ。

Prometheus + Grafana + AlertManagerで監視基盤を構築した。PostgreSQL Exporter でDB状態、cAdvisor でコンテナ状態、Node Exporter でホスト状態を監視している。異常時はSlackに通知が飛ぶ。

## 振り返り

**LLMは「構造化」が得意**。自然言語のレポートを JSON に変換する作業は、LLMの強みが最も活きる場面だ。正規表現やルールベースでは対応しきれない表現の揺れを、LLMが吸収してくれる。

**プロンプトのバージョン管理は必須**。プロンプトを変更するとLLMの出力が変わる。プロンプトにid とversion を付けて管理することで、「いつからシグナルの質が変わったか」を追跡できる。

**キャッシュは贅沢品ではなく必需品**。LLM APIは遅くて高い。同じ入力に対する再計算を避けるキャッシュは、コスト削減とレスポンス改善の両方に効く。
