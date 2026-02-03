from sqlalchemy import (
    CheckConstraint,
    Column,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Trend(Base):
    __tablename__ = "trends"

    id = Column(Integer, primary_key=True, autoincrement=True)
    radar_date = Column(String, nullable=False)
    focus_area = Column(String, nullable=False)
    tool_name = Column(String, nullable=False)
    classification = Column(String, nullable=False)
    confidence_score = Column(Integer, nullable=False)
    technical_insight = Column(Text, nullable=False)
    signal_evidence = Column(Text)      # JSON array as TEXT
    noise_indicators = Column(Text)     # JSON array as TEXT
    architectural_verdict = Column(Integer, nullable=False)  # 0 or 1
    timestamp = Column(String, nullable=False)               # ISO 8601

    __table_args__ = (
        CheckConstraint(
            "classification IN ('signal', 'noise')",
            name="ck_classification",
        ),
        CheckConstraint(
            "confidence_score >= 1 AND confidence_score <= 100",
            name="ck_confidence_score",
        ),
        UniqueConstraint(
            "radar_date", "focus_area", "tool_name",
            name="uq_radar_focus_tool",
        ),
        Index("idx_radar_date", "radar_date"),
        Index("idx_focus_area", "focus_area"),
        Index("idx_classification", "classification"),
    )

    def __repr__(self):
        return (
            f"<Trend(id={self.id}, tool_name='{self.tool_name}', "
            f"classification='{self.classification}')>"
        )
