# models.py
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from sqlalchemy import DateTime, Float, ForeignKey, String, Text, Index
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

try:
    from sqlalchemy.dialects.postgresql import JSONB as _JSON
except Exception:
    from sqlalchemy import JSON as _JSON  # type: ignore


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid.uuid4().hex)
    status: Mapped[str] = mapped_column(String(16), index=True, default="queued", nullable=False)
    progress: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    request: Mapped[Dict[str, Any]] = mapped_column(_JSON, default=dict, nullable=False)

    pack_id: Mapped[Optional[str]] = mapped_column(String(32), ForeignKey("packs.id"), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    error_trace: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    pack: Mapped[Optional["Pack"]] = relationship("Pack", back_populates="job", foreign_keys=[pack_id], uselist=False)


class Pack(Base):
    __tablename__ = "packs"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid.uuid4().hex)

    job_id: Mapped[Optional[str]] = mapped_column(String(32), ForeignKey("jobs.id"), index=True, nullable=True)

    mode: Mapped[str] = mapped_column(String(32), default="niche", nullable=False)
    input_value: Mapped[str] = mapped_column(Text, default="", nullable=False)
    language: Mapped[str] = mapped_column(String(16), default="ar", nullable=False)
    tone: Mapped[str] = mapped_column(String(32), default="Authority", nullable=False)
    platforms: Mapped[Dict[str, Any]] = mapped_column(_JSON, default=list, nullable=False)

    genes: Mapped[Dict[str, Any]] = mapped_column(_JSON, default=dict, nullable=False)
    assets: Mapped[Dict[str, Any]] = mapped_column(_JSON, default=dict, nullable=False)
    visual: Mapped[Dict[str, Any]] = mapped_column(_JSON, default=dict, nullable=False)
    dominance: Mapped[Dict[str, Any]] = mapped_column(_JSON, default=dict, nullable=False)
    sources: Mapped[Dict[str, Any]] = mapped_column(_JSON, default=dict, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False)

    job: Mapped[Optional[Job]] = relationship("Job", back_populates="pack", foreign_keys=[job_id], uselist=False)


Index("ix_packs_job_id", Pack.job_id)


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    passwordHash: Mapped[str] = mapped_column(Text, nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    profile: Mapped[Optional["CreatorProfile"]] = relationship("CreatorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")


class CreatorProfile(Base):
    __tablename__ = "creator_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    userId: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    followerCount: Mapped[int] = mapped_column(default=0, nullable=False)
    niche: Mapped[str] = mapped_column(String(100), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False)
    language: Mapped[str] = mapped_column(String(16), nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="profile")
    videos: Mapped[list["Video"]] = relationship("Video", back_populates="creator", cascade="all, delete-orphan")
    dnaRecords: Mapped[list["CreatorDNA"]] = relationship("CreatorDNA", back_populates="creator", cascade="all, delete-orphan")


# Define composite index on (niche, country) as requested
Index("ix_creator_profile_niche_country", CreatorProfile.niche, CreatorProfile.country)


class Video(Base):
    __tablename__ = "videos"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    creatorId: Mapped[str] = mapped_column(String(36), ForeignKey("creator_profiles.id", ondelete="CASCADE"), nullable=False)
    platformVideoId: Mapped[str] = mapped_column(String(100), nullable=False)
    publishTime: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    creator: Mapped["CreatorProfile"] = relationship("CreatorProfile", back_populates="videos")
    metrics: Mapped[Optional["VideoMetrics"]] = relationship("VideoMetrics", back_populates="video", uselist=False, cascade="all, delete-orphan")


class VideoMetrics(Base):
    __tablename__ = "video_metrics"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    videoId: Mapped[str] = mapped_column(String(36), ForeignKey("videos.id", ondelete="CASCADE"), unique=True, nullable=False)
    views: Mapped[int] = mapped_column(default=0, nullable=False)
    likes: Mapped[int] = mapped_column(default=0, nullable=False)
    comments: Mapped[int] = mapped_column(default=0, nullable=False)
    shares: Mapped[int] = mapped_column(default=0, nullable=False)
    saves: Mapped[int] = mapped_column(default=0, nullable=False)
    watchTime: Mapped[float] = mapped_column(default=0.0, nullable=False)
    completionRate: Mapped[float] = mapped_column(default=0.0, nullable=False)
    retentionData: Mapped[Dict[str, Any]] = mapped_column(_JSON, default=dict, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, nullable=False)

    video: Mapped["Video"] = relationship("Video", back_populates="metrics")


class CreatorDNA(Base):
    __tablename__ = "creator_dna"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    creatorId: Mapped[str] = mapped_column(String(36), ForeignKey("creator_profiles.id", ondelete="CASCADE"), nullable=False)
    traitName: Mapped[str] = mapped_column(String(100), nullable=False)
    traitValue: Mapped[str] = mapped_column(String(255), nullable=False)
    confidenceScore: Mapped[float] = mapped_column(default=0.0, nullable=False)
    sampleSize: Mapped[int] = mapped_column(default=0, nullable=False)
    updatedAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False)

    creator: Mapped["CreatorProfile"] = relationship("CreatorProfile", back_populates="dnaRecords")


# Define composite index on (creatorId, traitName) as requested
Index("ix_creator_dna_lookup", CreatorDNA.creatorId, CreatorDNA.traitName)

