from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from database import get_db
import models, schemas

router = APIRouter(prefix="/tasks", tags=["Tasks"])

def get_current_user(email: str, db: Session = Depends(get_db)):
    """Temporary: look up profile by display_name or by email pattern.
    Will be replaced with Supabase Auth JWT in a future sprint."""
    user = db.query(models.Profile).filter(models.Profile.display_name == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)

    existing = db.query(models.Task).filter(
        models.Task.user_id == user.id,
        models.Task.name == task.name
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Task with this name already exists")

    task_count = db.query(models.Task).filter(models.Task.user_id == user.id).count()
    task_code = f"T{task_count + 1:03d}"

    db_task = models.Task(
        user_id=user.id,
        task_code=task_code,
        name=task.name,
        category=task.category,
        recurrence_rule=task.recurrence_rule.model_dump(),
        base_time_minutes=task.base_time_minutes,
        priority=task.priority,
        notes=task.notes,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[schemas.TaskResponse])
def get_tasks(email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)
    return db.query(models.Task).filter(models.Task.user_id == user.id).all()

@router.delete("/{task_uuid}")
def delete_task(task_uuid: UUID, email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)
    task = db.query(models.Task).filter(
        models.Task.id == task_uuid, models.Task.user_id == user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
