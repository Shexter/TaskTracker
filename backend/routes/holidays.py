from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from database import get_db
import models, schemas

router = APIRouter(prefix="/holidays", tags=["Holidays"])

def get_current_user(email: str, db: Session = Depends(get_db)):
    user = db.query(models.Profile).filter(models.Profile.display_name == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=schemas.HolidayResponse)
def create_holiday(holiday: schemas.HolidayCreate, email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)

    existing = db.query(models.Holiday).filter(
        models.Holiday.user_id == user.id,
        models.Holiday.holiday_date == holiday.holiday_date,
        models.Holiday.name == holiday.name,
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Holiday already exists on this date")

    db_holiday = models.Holiday(
        user_id=user.id,
        **holiday.model_dump()
    )
    db.add(db_holiday)
    db.commit()
    db.refresh(db_holiday)
    return db_holiday

@router.get("/", response_model=List[schemas.HolidayResponse])
def get_holidays(email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)
    return db.query(models.Holiday).filter(models.Holiday.user_id == user.id).all()

@router.delete("/{holiday_id}")
def delete_holiday(holiday_id: UUID, email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)
    holiday = db.query(models.Holiday).filter(
        models.Holiday.id == holiday_id, models.Holiday.user_id == user.id
    ).first()
    if not holiday:
        raise HTTPException(status_code=404, detail="Holiday not found")

    db.delete(holiday)
    db.commit()
    return {"message": "Holiday deleted successfully"}
