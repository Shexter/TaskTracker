from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import date, timedelta
import calendar as cal_module

from database import get_db
import models, schemas
from logic.recurrence import RecurrenceExpander

router = APIRouter(prefix="/calendar", tags=["Calendar"])

def get_current_user(email: str, db: Session = Depends(get_db)):
    user = db.query(models.Profile).filter(models.Profile.display_name == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def _expand_and_fetch(user, db, start, end):
    """Expand recurrences and fetch instances with nested task."""
    expander = RecurrenceExpander(db)
    tasks = db.query(models.Task).filter(models.Task.user_id == user.id).all()
    for task in tasks:
        expander.expand_task(task, start, end)

    instances = (
        db.query(models.TaskInstance)
        .options(joinedload(models.TaskInstance.task))
        .filter(
            models.TaskInstance.user_id == user.id,
            models.TaskInstance.occurrence_date >= start,
            models.TaskInstance.occurrence_date <= end,
        )
        .all()
    )
    return instances

@router.get("/week/{target_date}", response_model=List[schemas.TaskInstanceResponse])
def get_week_calendar(target_date: date, email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)
    day_offset = (target_date.weekday() + 1) % 7
    start_of_week = target_date - timedelta(days=day_offset)
    end_of_week = start_of_week + timedelta(days=6)
    return _expand_and_fetch(user, db, start_of_week, end_of_week)

@router.get("/month/{target_date}", response_model=List[schemas.TaskInstanceResponse])
def get_month_calendar(target_date: date, email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)
    start = target_date.replace(day=1)
    _, last_day = cal_module.monthrange(target_date.year, target_date.month)
    end = target_date.replace(day=last_day)
    return _expand_and_fetch(user, db, start, end)
