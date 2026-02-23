from pydantic import BaseModel
from typing import Optional, List, Literal, Any
from datetime import datetime, date
from uuid import UUID

# --- Profile Schemas --- #
class ProfileResponse(BaseModel):
    id: UUID
    display_name: Optional[str] = None
    timezone: str
    week_start_day: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Task Schemas --- #
class RecurrenceRule(BaseModel):
    period: str  # Weekly, Monthly, Quarterly, Yearly, OneTime
    occurrence: str  # Mon,Wed,Fri  or  1  or  Mar 1  etc.

class TaskBase(BaseModel):
    name: str
    category: str
    recurrence_rule: RecurrenceRule
    base_time_minutes: Optional[int] = None
    priority: int = 0
    notes: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: UUID
    user_id: UUID
    task_code: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- TaskInstance Schemas --- #
class TaskInstanceResponse(BaseModel):
    id: UUID
    task_id: UUID
    user_id: UUID
    occurrence_date: date
    status: str
    completed_at: Optional[datetime] = None
    created_at: datetime
    task: Optional[TaskResponse] = None

    class Config:
        from_attributes = True

# --- Holiday Schemas --- #
class HolidayBase(BaseModel):
    name: str
    holiday_date: date
    category: str

class HolidayCreate(HolidayBase):
    pass

class HolidayResponse(HolidayBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Chat Schemas --- #
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# --- Dashboard Schemas --- #
class CategoryCount(BaseModel):
    name: str
    count: int
    color: str

class WeekDayData(BaseModel):
    day: str
    completed: int
    pending: int

class DashboardMetricsResponse(BaseModel):
    totalTasks: int
    completionRate: int
    hoursScheduled: float
    busiestDay: str
    tasksByCategory: List[CategoryCount]
    weeklyData: List[WeekDayData]
    upcomingTasks: List[TaskInstanceResponse]

# --- Gamification Schemas --- #
class GamificationResponse(BaseModel):
    xp: int
    level: int
    levelName: str
    xpForNextLevel: int
    xpInCurrentLevel: int
    streak: int

# --- Task Instance Update --- #
class TaskInstanceStatusUpdate(BaseModel):
    status: Literal['Pending', 'Completed', 'Skipped', 'Cancelled']
