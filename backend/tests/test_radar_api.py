import json

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import get_db
from app.main import app
from app.models import Base, Trend

TEST_DB_URL = "sqlite:///./test_radar.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def seed_trends():
    db = TestingSessionLocal()
    trends = [
        Trend(
            radar_date="2026-02-01",
            focus_area="voice_ai_ux",
            tool_name="LiveKit Agents",
            classification="signal",
            confidence_score=92,
            technical_insight="Sub-200ms voice-to-voice latency with WebRTC.",
            signal_evidence=json.dumps(["Published benchmarks", "Production usage"]),
            noise_indicators=json.dumps([]),
            architectural_verdict=1,
            timestamp="2026-02-01T08:00:00Z",
        ),
        Trend(
            radar_date="2026-02-01",
            focus_area="voice_ai_ux",
            tool_name="VoiceHype AI",
            classification="noise",
            confidence_score=85,
            technical_insight="No latency benchmarks. Demo video only.",
            signal_evidence=json.dumps([]),
            noise_indicators=json.dumps(["No benchmarks", "Marketing language"]),
            architectural_verdict=0,
            timestamp="2026-02-01T08:00:00Z",
        ),
    ]
    db.add_all(trends)
    db.commit()
    db.close()


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_get_radar_empty():
    response = client.get("/api/radar")
    assert response.status_code == 200
    data = response.json()
    assert data["radar_date"] is None
    assert data["trends"] == []


def test_get_radar_with_data(seed_trends):
    response = client.get("/api/radar")
    assert response.status_code == 200
    data = response.json()
    assert data["radar_date"] == "2026-02-01"
    assert len(data["trends"]) == 2


def test_get_radar_by_date(seed_trends):
    response = client.get("/api/radar?date=2026-02-01")
    assert response.status_code == 200
    data = response.json()
    assert data["radar_date"] == "2026-02-01"
    assert len(data["trends"]) == 2


def test_get_radar_by_date_no_data(seed_trends):
    response = client.get("/api/radar?date=2099-01-01")
    assert response.status_code == 200
    data = response.json()
    assert data["trends"] == []


def test_get_radar_golden_contract_format(seed_trends):
    response = client.get("/api/radar")
    data = response.json()
    trend = data["trends"][0]
    assert "focus_area" in trend
    assert "tool_name" in trend
    assert "classification" in trend
    assert "confidence_score" in trend
    assert "technical_insight" in trend
    assert "signal_evidence" in trend
    assert "noise_indicators" in trend
    assert "architectural_verdict" in trend
    assert "timestamp" in trend
    assert isinstance(trend["signal_evidence"], list)
    assert isinstance(trend["noise_indicators"], list)
    assert isinstance(trend["architectural_verdict"], bool)


def test_get_radar_ordered_by_confidence(seed_trends):
    response = client.get("/api/radar")
    data = response.json()
    scores = [t["confidence_score"] for t in data["trends"]]
    assert scores == sorted(scores, reverse=True)
