from unittest.mock import MagicMock, patch

import pytest

from app.services.grok_service import _validate_trend


def test_validate_trend_valid_signal():
    item = {
        "tool_name": "TestTool",
        "classification": "signal",
        "confidence_score": 85,
        "technical_insight": "Some insight",
        "signal_evidence": ["evidence1"],
        "noise_indicators": [],
        "architectural_verdict": True,
    }
    assert _validate_trend(item) is True


def test_validate_trend_valid_noise():
    item = {
        "tool_name": "HypeTool",
        "classification": "noise",
        "confidence_score": 30,
        "technical_insight": "Vague claims",
        "signal_evidence": [],
        "noise_indicators": ["no benchmarks"],
        "architectural_verdict": False,
    }
    assert _validate_trend(item) is True


def test_validate_trend_missing_field():
    item = {
        "tool_name": "Incomplete",
        "classification": "signal",
    }
    assert _validate_trend(item) is False


def test_validate_trend_invalid_classification():
    item = {
        "tool_name": "BadClass",
        "classification": "maybe",
        "confidence_score": 50,
        "technical_insight": "Some text",
    }
    assert _validate_trend(item) is False


def test_validate_trend_score_out_of_range():
    item = {
        "tool_name": "OutOfRange",
        "classification": "signal",
        "confidence_score": 150,
        "technical_insight": "Some text",
    }
    assert _validate_trend(item) is False


def test_validate_trend_score_zero():
    item = {
        "tool_name": "ZeroScore",
        "classification": "signal",
        "confidence_score": 0,
        "technical_insight": "Some text",
    }
    assert _validate_trend(item) is False
