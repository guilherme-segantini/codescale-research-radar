# Prompt Engineering - CodeScale Research Radar

## Overview

These prompts instruct an LLM (via SAP Generative AI Hub / LiteLLM) to **discover** and **classify** technology trends as **Signal** or **Noise** across three focus areas.

Each prompt follows a two-step pattern:
1. **DISCOVER** - Find tools/technologies discussed in the past 7 days
2. **CLASSIFY** - Evaluate each tool against specific signal/noise criteria

## Prompt Files

| File | Focus Area | Key Signal Criteria |
|------|-----------|-------------------|
| `voice_ai_prompt.txt` | Voice AI UX | Latency benchmarks, VAD specs, WebRTC architecture |
| `agent_orchestration_prompt.txt` | Agent Orchestration | BKG integration, state persistence, coordination protocols |
| `durable_runtime_prompt.txt` | Durable Runtime | SLA guarantees, cold-start benchmarks, replay mechanisms |

## Output Format

All prompts produce JSON conforming to the **Golden Contract** schema (see `PRD.md` Section 2):

```json
[
  {
    "tool_name": "string",
    "classification": "signal | noise",
    "confidence_score": 1-100,
    "technical_insight": "string",
    "signal_evidence": ["string"],
    "noise_indicators": ["string"],
    "architectural_verdict": true | false
  }
]
```

The backend wraps these results with `radar_date`, `focus_area`, and `timestamp` before persisting to SQLite.

## Design Principles

1. **Evidence over opinion** - Prompts demand concrete evidence (benchmarks, case studies, SLAs) rather than subjective assessments
2. **Structured output** - JSON-only responses with no prose preamble or postamble
3. **Binary classification** - Every tool is either Signal or Noise; no "maybe" category
4. **Confidence scoring** - 1-100 scale reflecting strength of available evidence
5. **Domain-specific criteria** - Each focus area has its own signal/noise indicators drawn from PRD Section 5

## Usage with LiteLLM

```python
import litellm

# Read the prompt template
with open("prompts/voice_ai_prompt.txt") as f:
    prompt = f.read()

# Call via SAP Generative AI Hub
# See: https://docs.litellm.ai/docs/providers/sap
response = litellm.completion(
    model="your-model-id",
    messages=[{"role": "user", "content": prompt}]
)
```

## Iteration Log

### v1 (2026-02-02)
- Initial prompt templates for all three focus areas
- Two-step DISCOVER + CLASSIFY pattern based on PRD Section 3
- Domain-specific signal/noise criteria from PRD Section 5
- JSON-only output constraint with Golden Contract schema
- System message framing as "senior technology analyst"
