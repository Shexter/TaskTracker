from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta

from database import get_db
import models, schemas
from logic.recurrence import RecurrenceExpander

router = APIRouter(prefix="/calendar", tags=["Calendar"])

def get_current_user(email: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/week/{target_date}", response_model=List[schemas.TaskInstanceResponse])
def get_week_calendar(target_date: date, email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)
    
    start_of_week = target_date - timedelta(days=target_date.weekday())
    end_of_week = start_of_week + timedelta(days=6)
    
    # Optional: trigger expansion if instances might be missing
    expander = RecurrenceExpander(db)
    tasks = db.query(models.Task).filter(models.Task.user_id == user.id).all()
    for task in tasks:
        expander.expand_task(task, start_of_week, end_of_week)
        
    instances = db.query(models.TaskInstance).filter(
        models.TaskInstance.user_id == user.id,
        models.TaskInstance.occurrence_date >= start_of_week,
        models.TaskInstance.occurrence_date <= end_of_week
    ).all()
    
    return instances
