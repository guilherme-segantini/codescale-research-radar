# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **SAPUI5 project skeleton** - Complete UI5 application with Component.js, manifest.json, index.html, routing, and async loading (#8)
- **RadarView 3-panel layout** - Fiori-style dashboard with Voice AI UX, Agent Orchestration, and Durable Runtime panels (#9)
- **Mock data and JSON model binding** - 6 mock trends from PRD Section 7 with per-panel filtering in controller (#10)
- **i18n translations** - All user-facing text externalized to i18n.properties (#11)
- **Formatter and CSS styling** - Signal/noise visual distinction with green/gray badges, confidence percentages, evidence lists (#12)
- **Signal vs Noise classification** - Core feature to distinguish actionable technical findings from marketing hype
- **GitHub repository** - Created `codescale-research-radar` repo at https://github.com/guilherme-segantini/codescale-research-radar
- **21 GitHub issues** - Restructured tasks for 3-developer parallel work
- **Track labels** - `track-a` (Frontend), `track-b` (Backend), `track-c` (AI/Prompts), `integration`
- **TASKS.md** - Task breakdown document with developer assignments and dependencies
- **Git worktrees** - Set up 3 isolated working directories for parallel agent development (track-a, track-b, track-c)
- `signal_evidence` and `noise_indicators` fields in Golden Contract schema
- Mock data with signal and noise examples for each focus area (6 items total)
- Historical data query support (`GET /api/radar?date=YYYY-MM-DD`)

### Changed
- **AI Provider**: Switched from Grok 4 to **SAP Generative AI Hub via LiteLLM** (see https://docs.litellm.ai/docs/providers/sap)
- **Refresh cycle**: Changed from 30-minute to **daily (1-day)** batch processing
- **Golden Contract**: Added `classification`, `signal_evidence`, `noise_indicators` fields; renamed `trend_score` to `confidence_score`
- **Success criteria**: Updated to include signal/noise classification accuracy metrics
- **Prompt template**: Redesigned for signal vs noise classification with specific criteria per focus area

### Deferred
- Grok 4 direct integration - Rationale: Using SAP Generative AI Hub for enterprise-grade AI infrastructure
- 30-minute refresh cycle - Rationale: Daily batch is sufficient for PoC scope, reduces API costs
