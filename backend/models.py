import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Date, Time, ForeignKey, UniqueConstraint, Index, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from database import Base


class Profile(Base):
    """Maps to Supabase 'profiles' table. User identity is managed by Supabase Auth."""
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    display_name = Column(String, nullable=True)
    timezone = Column(String, nullable=False, default="UTC")
    week_start_day = Column(String, nullable=False, default="sunday")
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"))

    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    task_instances = relationship("TaskInstance", back_populates="user", cascade="all, delete-orphan")
    holidays = relationship("Holiday", back_populates="user", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    task_code = Column(String, nullable=False)  # e.g. T001
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    recurrence_rule = Column(JSONB, nullable=False)
    # recurrence_rule example: {"period": "Weekly", "occurrence": "Mon,Wed,Fri"}
    base_time_minutes = Column(Integer, nullable=True)
    priority = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False, default="Active")
    parent_task_id = Column(UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"))

    __table_args__ = (UniqueConstraint('user_id', 'task_code', name='uq_user_task_code'),)

    user = relationship("Profile", back_populates="tasks")
    instances = relationship("TaskInstance", back_populates="task", cascade="all, delete-orphan")
    children = relationship("Task", backref="parent", remote_side=[id])


class TaskInstance(Base):
    __tablename__ = "task_instances"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = Column(UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    occurrence_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    status = Column(String, nullable=False, default="Pending")
    actual_time_minutes = Column(Integer, nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"))

    __table_args__ = (Index('idx_user_date', 'user_id', 'occurrence_date'),)

    task = relationship("Task", back_populates="instances")
    user = relationship("Profile", back_populates="task_instances")


class Holiday(Base):
    __tablename__ = "holidays"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    holiday_date = Column(Date, nullable=False)
    category = Column(String, nullable=False, default="Personal")
    shift = Column(String, nullable=True)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"))

    __table_args__ = (UniqueConstraint('user_id', 'holiday_date', 'name', name='uq_user_holiday'),)

    user = relationship("Profile", back_populates="holidays")
