import asyncio
import json
import logging
import os
from datetime import datetime, timezone

import httpx
from sqlalchemy.orm import Session

from app.models import Trend

logger = logging.getLogger(__name__)

FOCUS_AREAS = ["voice_ai_ux", "agent_orchestration", "durable_runtime"]
MAX_RETRIES = 3
BASE_BACKOFF = 2  # seconds


def _load_prompt(focus_area: str) -> str | None:
    """Load prompt template from prompts/ directory."""
    prompt_path = os.path.join(
        os.path.dirname(__file__), "..", "..", "..", "prompts", f"{focus_area}_prompt.txt"
    )
    prompt_path = os.path.normpath(prompt_path)
    if os.path.exists(prompt_path):
        with open(prompt_path) as f:
            return f.read()
    return None


async def _call_grok(focus_area: str) -> list[dict]:
    """Call Grok API directly with retry logic."""
    prompt = _load_prompt(focus_area)
    if not prompt:
        prompt = (
            f"Analyze the latest trends in {focus_area.replace('_', ' ')}. "
            f"Return a JSON array of tools with classification as 'signal' or 'noise', "
            f"confidence_score (1-100), technical_insight, signal_evidence array, "
            f"noise_indicators array, and architectural_verdict (true/false)."
        )

    api_key = os.getenv("XAI_API_KEY")
    model = os.getenv("LLM_MODEL", "grok-4-latest")

    for attempt in range(MAX_RETRIES):
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    "https://api.x.ai/v1/chat/completions",
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {api_key}",
                    },
                    json={
                        "messages": [{"role": "user", "content": prompt}],
                        "model": model,
                        "stream": False,
                        "temperature": 0,
                    },
                )
                if response.status_code != 200:
                    error_body = response.text
                    logger.error(f"API error: {response.status_code} - {error_body}")
                response.raise_for_status()
                data = response.json()
                content = data["choices"][0]["message"]["content"]

            # Extract JSON from response (handle markdown code blocks)
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]

            return json.loads(content.strip())
        except Exception as e:
            logger.warning(
                "Grok API call failed for %s (attempt %d/%d): %s",
                focus_area, attempt + 1, MAX_RETRIES, e,
            )
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(BASE_BACKOFF ** (attempt + 1))
            else:
                logger.error("All retries exhausted for %s", focus_area)
                raise

    return []


def _validate_trend(item: dict) -> bool:
    """Validate a single trend item against the schema."""
    required = ["tool_name", "classification", "confidence_score", "technical_insight"]
    if not all(k in item for k in required):
        return False
    if item["classification"] not in ("signal", "noise"):
        return False
    if not (1 <= item.get("confidence_score", 0) <= 100):
        return False
    return True


def _persist_trends(db: Session, focus_area: str, radar_date: str, items: list[dict]):
    """Persist validated trends to the database within a transaction."""
    now = datetime.now(timezone.utc).isoformat()

    for item in items:
        if not _validate_trend(item):
            logger.warning("Skipping invalid trend item: %s", item.get("tool_name", "unknown"))
            continue

        trend = Trend(
            radar_date=radar_date,
            focus_area=focus_area,
            tool_name=item["tool_name"],
            classification=item["classification"],
            confidence_score=item["confidence_score"],
            technical_insight=item["technical_insight"],
            signal_evidence=json.dumps(item.get("signal_evidence", [])),
            noise_indicators=json.dumps(item.get("noise_indicators", [])),
            architectural_verdict=1 if item.get("architectural_verdict", False) else 0,
            timestamp=now,
        )
        db.merge(trend)

    db.commit()


async def run_radar_refresh(db: Session) -> dict:
    """Run a full radar refresh across all focus areas."""
    radar_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    all_trends = []
    errors = []

    for focus_area in FOCUS_AREAS:
        try:
            items = await _call_grok(focus_area)
            _persist_trends(db, focus_area, radar_date, items)
            all_trends.extend(
                {**item, "focus_area": focus_area} for item in items if _validate_trend(item)
            )
        except Exception as e:
            logger.error("Failed to refresh %s: %s", focus_area, e)
            errors.append({"focus_area": focus_area, "error": str(e)})

    return {
        "status": "completed" if not errors else "partial",
        "radar_date": radar_date,
        "trends_count": len(all_trends),
        "errors": errors,
    }
