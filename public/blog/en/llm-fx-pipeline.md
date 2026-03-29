---
title: "Structuring Bank Reports with LLMs -- M4FX Pipeline Design"
date: 2026-03-29
tags: [AI, LLM, Python, PostgreSQL, Finance]
excerpt: "Structuring FX reports from major Japanese banks with LLMs to auto-generate daily trading signals. 6 prompts and 3 time-zone pipelines."
---

# Structuring Bank Reports with LLMs -- M4FX Pipeline Design

## What I Built

I've been developing M4FX, a system that structures FX reports published each morning by major Japanese banks (MUFG, SMBC, and Resona) using LLMs, and auto-generates USD/JPY trade signal candidates. 60 commits so far, with a Streamlit UI spanning 7 screens.

All the human needs to do is check the morning signals and decide whether to trade.

## Three Time-Zone Pipelines

The FX market runs 24 hours. Different time zones require different information, so I designed three pipelines.

| Pipeline | Time | Purpose |
|---|---|---|
| Morning pipeline | 08:45 JST | Fetch bank reports -> structure -> generate signals -> notify |
| Intraday monitor | 09:00-23:00 (every 30 min) | Monitor news -> detect thesis invalidation |
| Macro analysis | 21:00-23:00 | Automated analysis of U.S. economic indicators |

The morning pipeline is the core of daily signal generation. The intraday monitor continuously checks whether the morning thesis still holds. Macro analysis runs during U.S. indicator release windows.

## Structuring Reports with LLMs

Bank FX reports come in PDF or HTML, written in natural language for human readers. LLMs convert these into structured JSON that programs can consume.

Six prompts work in concert.

| Prompt | Role |
|---|---|
| A: extract_report | Extract direction, range, and rationale from bank reports |
| B: proxy_score | Calculate proxy scores when explicit ratios are absent |
| C: daily_signal_brief | Synthesize multi-bank analyses into a daily signal narrative |
| D: thesis_monitor | Detect thesis invalidation from news events |
| E: macro_interpreter | Analyze market impact of economic indicators |
| F: final_briefing | Generate a final briefing integrating all information |

There's a consistent pattern in the prompt design: version control via YAML frontmatter (id, version), separation of system and user prompts, `{{VARIABLE}}` template variables for dynamic data injection, and enforced JSON output for easy downstream parsing.

## Caching and Retries

LLM APIs are slow and occasionally fail. Two countermeasures are in place.

**Two-layer cache.** An in-memory cache (per session) and a file cache (persisted to disk). No need to structure the same report twice. When the API is down, the file cache provides a fallback with previous results.

**Exponential backoff retries.** On RateLimitError or TimeoutError, requests retry with exponential backoff. This prevents the morning signals from going missing due to transient failures.

## Three-Layer Architecture

The overall system follows a fetcher -> service -> repository structure.

**Fetcher layer.** Four fetchers retrieve external data: bank reports, news feeds, market data, and macro indicators.

**Service layer.** The business logic core. ReportService manages report fetching and structuring. SignalService generates signals. NewsMonitorService handles news surveillance, and MacroAnalysisService covers macro analysis.

**Repository layer.** SQLAlchemy + PostgreSQL for data persistence. Core models (Source, RawReport, StructuredReport, DailySignal) and analytics models (MarketData, NewsEvent, MacroRelease, etc.).

## Monitoring Infrastructure

Since this is a pipeline that runs daily, you need a mechanism to notice when it *isn't* running.

I built monitoring with Prometheus + Grafana + AlertManager. PostgreSQL Exporter monitors DB state, cAdvisor tracks container health, and Node Exporter watches host metrics. Anomalies trigger Slack notifications.

## Reflections

**LLMs excel at structuring.** Converting natural-language reports to JSON is where LLMs shine most. They absorb the variation in expressions that regex or rule-based approaches can't fully handle.

**Prompt version control is essential.** Changing a prompt changes LLM output. By attaching id and version to each prompt, you can trace exactly when signal quality shifted.

**Caching is a necessity, not a luxury.** LLM APIs are slow and expensive. Caching to avoid redundant computation for identical inputs delivers both cost savings and improved response times.
