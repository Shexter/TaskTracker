import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Date, ForeignKey, UniqueConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    timezone = Column(String(50), default="UTC")
    created_at = Column(DateTime, default=datetime.utcnow)

    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    task_instances = relationship("TaskInstance", back_populates="user", cascade="all, delete-orphan")
    holidays = relationship("Holiday", back_populates="user", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    task_id = Column(String(50), nullable=False) # e.g. T001
    name = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)
    period = Column(String(50), nullable=False)
    occurrence = Column(String(255), nullable=False)
    base_time_minutes = Column(Integer)
    status = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint('user_id', 'task_id', name='uq_user_task'),)

    user = relationship("User", back_populates="tasks")
    instances = relationship("TaskInstance", back_populates="task", cascade="all, delete-orphan")


class TaskInstance(Base):
    __tablename__ = "task_instances"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = Column(UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    occurrence_date = Column(Date, nullable=False)
    status = Column(String(50), default="Pending")
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (Index('idx_user_date', 'user_id', 'occurrence_date'),)

    task = relationship("Task", back_populates="instances")
    user = relationship("User", back_populates="task_instances")


class Holiday(Base):
    __tablename__ = "holidays"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    holiday_date = Column(Date, nullable=False)
    category = Column(String(50), nullable=False, default="Personal") 
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint('user_id', 'holiday_date', name='uq_user_holiday_date'),)

    user = relationship("User", back_populates="holidays")
