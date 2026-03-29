---
title: "Building a Semi-Automated Journal: ChatGPT Voice to Notion"
date: 2026-03-29
tags: [Automation, Shell Script, Notion API, Productivity]
excerpt: "Voice input organized by ChatGPT, auto-appended to Notion via shell scripts. 3-layer script design for maintainability."
---

# Building a Semi-Automated Journal: ChatGPT Voice to Notion

## What I Built

I keep a Daily Journal in Notion, but sitting down at a PC to type it out was tedious.

So I built a workflow: speak into the ChatGPT app on my phone, get organized Markdown back, and auto-append it to Notion via the clipboard.

```
Voice input on phone (ChatGPT)
  |
Organized into Markdown
  |
Copied to clipboard
  |
One terminal command
  |
Appended to Notion Daily Journal
```

This is deliberately "semi-automated" rather than fully automated. ChatGPT handles organizing the voice input, but a human runs the command to push it to Notion. I want to review the content before it gets appended.

## Three-Layer Script Design

The shell scripts are separated into three layers.

| Layer | File | Responsibility |
|---|---|---|
| Presentation | journal_push_clipboard.sh | Retrieve text from clipboard |
| Logic | journal_push.sh | Add time headings, resolve date |
| Adapter | notion_journal_adapter.sh | Notion API (ncli) operations |

**Presentation layer.** Grabs clipboard contents with `pbpaste` and passes them to the logic layer. 21 lines.

**Logic layer.** If the text doesn't start with a `## HH:MM` heading, it auto-prepends one with the current time. Resolves the date and calls the adapter layer. 132 lines.

**Adapter layer.** Abstracts Notion CLI (ncli) operations. Page search, creation, content retrieval and update are all wrapped in functions. 197 lines.

This separation means that switching to a different input source (instead of clipboard) or a different Notion client (instead of ncli) only requires modifying a single layer.

## Notion API Operations via ncli

Rather than hitting the Notion API directly, I use ncli (Notion CLI). It pairs well with shell scripts, and JSON parsing is handled by jq.

The adapter layer's main operations are as follows.

**Page search.** Check whether today's page exists. Create one if it doesn't. Search results for the current day are cached to reduce API calls.

**Append mechanism.** The Notion API has no "append to end" endpoint. Instead, the script fetches existing content, concatenates the new text, and replaces the whole thing. A workaround, but it works.

**Cache strategy.** Page IDs are cached under `~/.cache/journal/`. From the second lookup onward on the same day, the search is skipped. Since the Notion API has a 3 req/sec rate limit, reducing calls through caching matters in practice.

## Day-to-Day Usage

The morning routine looks like this:

1. Open the ChatGPT app on my phone
2. Voice input: "Organize what I need to do today"
3. ChatGPT returns bullet-point Markdown
4. Copy the full text
5. Run `journal_push_clipboard.sh` in the Mac terminal
6. Appended to Notion

Evening reflection works the same way: talk through what I did today, ChatGPT organizes it, one command pushes it to Notion.

## Reflections

The whole thing is 350 lines of shell scripts that automate journaling.

**"Semi-automated" was the right call.** Full automation risks unintended content landing in Notion. Keeping the human-triggered command step preserves content review and timing control.

**Design matters even in shell scripts.** Thanks to the three-layer separation, when an ncli update changed API behavior, I only had to fix the adapter layer. Layer separation is a design pattern that works in any language.

**Voice input x LLM is powerful.** A journal entry that takes 5 minutes to type takes 1 minute to speak. The LLM structures it from there. Lowering the input barrier dramatically improves consistency.
