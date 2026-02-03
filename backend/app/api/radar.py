import json
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Trend
from app.services.grok_service import run_radar_refresh

router = APIRouter()


def _trend_to_dict(trend: Trend) -> dict:
    return {
        "focus_area": trend.focus_area,
        "tool_name": trend.tool_name,
        "classification": trend.classification,
        "confidence_score": trend.confidence_score,
        "technical_insight": trend.technical_insight,
        "signal_evidence": json.loads(trend.signal_evidence) if trend.signal_evidence else [],
        "noise_indicators": json.loads(trend.noise_indicators) if trend.noise_indicators else [],
        "architectural_verdict": bool(trend.architectural_verdict),
        "timestamp": trend.timestamp,
    }


@router.get("/radar")
def get_radar(
    date: str | None = Query(None, description="Filter by date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    if date:
        trends = (
            db.query(Trend)
            .filter(Trend.radar_date == date)
            .order_by(desc(Trend.confidence_score))
            .all()
        )
    else:
        # Get the latest radar_date
        latest = db.query(Trend.radar_date).order_by(desc(Trend.radar_date)).first()
        if not latest:
            return {"radar_date": None, "trends": []}
        trends = (
            db.query(Trend)
            .filter(Trend.radar_date == latest[0])
            .order_by(desc(Trend.confidence_score))
            .all()
        )

    if not trends:
        return {"radar_date": date, "trends": []}

    return {
        "radar_date": trends[0].radar_date,
        "trends": [_trend_to_dict(t) for t in trends],
    }


@router.post("/radar/refresh")
async def refresh_radar(db: Session = Depends(get_db)):
    try:
        result = await run_radar_refresh(db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
