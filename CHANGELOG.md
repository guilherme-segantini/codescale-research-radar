# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **SAPUI5 project skeleton** - Complete UI5 application with Component.js, manifest.json, index.html, routing, and async loading (#8)
- **RadarView 3-panel layout** - Fiori-style dashboard with Voice AI UX, Agent Orchestration, and Durable Runtime panels (#9)
- **Mock data and JSON model binding** - 6 mock trends from PRD Section 7 with per-panel filtering in controller (#10)
- **i18n translations** - All user-facing text externalized to i18n.properties (#11)
- **Formatter and CSS styling** - Signal/noise visual distinction with green/gray badges, confidence percentages, evidence lists (#12)
- **Backend scaffold** - Complete FastAPI application structure (`backend/`) with all endpoints, models, services, and tests
- **SQLite database** - Trend model with CHECK constraints (classification, confidence_score), UNIQUE constraint, and performance indexes
- **GET /api/radar** - Returns latest radar data with optional `?date=YYYY-MM-DD` for historical queries
- **POST /api/radar/refresh** - Triggers Grok analysis via direct xAI API calls with retry logic (3 attempts, exponential backoff)
- **Grok service** - Direct httpx integration with xAI API, JSON validation, prompt loading from `/prompts/`, and transaction-safe persistence
- **13 passing tests** - API endpoint tests (7) and service validation tests (6)
- **SETUP.md** - Environment setup guide covering backend, frontend, xAI API key, and troubleshooting
- **PRD.md Section 3** - Database schema, API endpoint docs, CORS config, and error handling requirements
- **Signal vs Noise classification** - Core feature to distinguish actionable technical findings from marketing hype
- **GitHub repository** - Created `codescale-research-radar` repo at https://github.com/guilherme-segantini/codescale-research-radar
- **21 GitHub issues** - Restructured tasks for 3-developer parallel work
- **Track labels** - `track-a` (Frontend), `track-b` (Backend), `track-c` (AI/Prompts), `integration`
- **TASKS.md** - Task breakdown document with developer assignments and dependencies
- **Git worktrees** - Set up 3 isolated working directories for parallel agent development (track-a, track-b, track-c)
- `signal_evidence` and `noise_indicators` fields in Golden Contract schema
- Mock data with signal and noise examples for each focus area (6 items total)
- Historical data query support (`GET /api/radar?date=YYYY-MM-DD`)
- **Prompt templates** (Track C) - Three discovery+classification prompts for all focus areas:
  - `prompts/voice_ai_prompt.txt` - Voice AI UX signal/noise classification
  - `prompts/agent_orchestration_prompt.txt` - Agent Orchestration signal/noise classification
  - `prompts/durable_runtime_prompt.txt` - Durable Runtime signal/noise classification
  - `prompts/README.md` - Prompt engineering guidelines, usage examples, and iteration log
- **Prompt design principles** - Evidence-over-opinion, structured JSON output, binary classification, domain-specific criteria
- **LiteLLM proxy configuration** - `litellm_config.yaml` with xAI/Grok integration for local testing on port 4004

### Changed
- **AI Provider**: Switched from Grok 4 to **SAP Generative AI Hub via LiteLLM** (see https://docs.litellm.ai/docs/providers/sap)
- **Refresh cycle**: Changed from 30-minute to **daily (1-day)** batch processing
- **Golden Contract**: Added `classification`, `signal_evidence`, `noise_indicators` fields; renamed `trend_score` to `confidence_score`
- **Success criteria**: Updated to include signal/noise classification accuracy metrics
- **Prompt template**: Redesigned for signal vs noise classification with specific criteria per focus area

### Deferred
- Grok 4 direct integration - Rationale: Using SAP Generative AI Hub for enterprise-grade AI infrastructure
- 30-minute refresh cycle - Rationale: Daily batch is sufficient for PoC scope, reduces API costs
