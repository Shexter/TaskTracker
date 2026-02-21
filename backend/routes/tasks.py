from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from database import get_db
import models, schemas

router = APIRouter(prefix="/tasks", tags=["Tasks"])

# Helper function to simulate authenticated user for MVP
def get_current_user(email: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)
    
    # Check if task already exists
    existing = db.query(models.Task).filter(
        models.Task.user_id == user.id, 
        models.Task.name == task.name
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Task with this name already exists")
        
    task_count = db.query(models.Task).filter(models.Task.user_id == user.id).count()
    task_id = f"T{task_count + 1:03d}"
    
    db_task = models.Task(
        user_id=user.id,
        task_id=task_id,
        **task.model_dump()
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[schemas.TaskResponse])
def get_tasks(email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)
    return db.query(models.Task).filter(models.Task.user_id == user.id).all()

@router.delete("/{task_num_id}")
def delete_task(task_num_id: UUID, email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)
    task = db.query(models.Task).filter(models.Task.id == task_num_id, models.Task.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
