from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from uuid import UUID

from database import get_db
import models, schemas

router = APIRouter(prefix="/task-instances", tags=["TaskInstances"])

def get_current_user(email: str, db: Session = Depends(get_db)):
    user = db.query(models.Profile).filter(models.Profile.display_name == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{instance_id}", response_model=schemas.TaskInstanceResponse)
def update_instance_status(
    instance_id: UUID,
    update: schemas.TaskInstanceStatusUpdate,
    email: str,
    db: Session = Depends(get_db),
):
    user = get_current_user(email, db)
    instance = db.query(models.TaskInstance).filter(
        models.TaskInstance.id == instance_id,
        models.TaskInstance.user_id == user.id,
    ).first()

    if not instance:
        raise HTTPException(status_code=404, detail="Task instance not found")

    instance.status = update.status
    if update.status == "Completed":
        instance.completed_at = datetime.utcnow()
    else:
        instance.completed_at = None

    db.commit()
    db.refresh(instance)

    task_resp = schemas.TaskResponse.model_validate(instance.task) if instance.task else None
    return schemas.TaskInstanceResponse(
        id=instance.id,
        task_id=instance.task_id,
        user_id=instance.user_id,
        occurrence_date=instance.occurrence_date,
        status=instance.status,
        completed_at=instance.completed_at,
        created_at=instance.created_at,
        task=task_resp,
    )
