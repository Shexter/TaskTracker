from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID

# --- User Schemas --- #
class UserBase(BaseModel):
    email: EmailStr
    timezone: str = "UTC"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Task Schemas --- #
class TaskBase(BaseModel):
    name: str
    category: str
    period: str
    occurrence: str
    base_time_minutes: int

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: UUID
    user_id: UUID
    task_id: str
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
    
    # Nested task info for the frontend calendar view
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
