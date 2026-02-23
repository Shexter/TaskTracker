from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta

from database import get_db
import models, schemas

router = APIRouter(prefix="/gamification", tags=["Gamification"])

LEVELS = [
    {"name": "Beginner", "xp": 0},
    {"name": "Productive", "xp": 100},
    {"name": "Achiever", "xp": 300},
    {"name": "Master", "xp": 600},
    {"name": "Legend", "xp": 1000},
]

def get_current_user(email: str, db: Session = Depends(get_db)):
    user = db.query(models.Profile).filter(models.Profile.display_name == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/", response_model=schemas.GamificationResponse)
def get_gamification(email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)

    completed_count = db.query(models.TaskInstance).filter(
        models.TaskInstance.user_id == user.id,
        models.TaskInstance.status == "Completed",
    ).count()

    xp = completed_count * 5

    level = 0
    for i in range(len(LEVELS) - 1, -1, -1):
        if xp >= LEVELS[i]["xp"]:
            level = i
            break

    current_level_xp = LEVELS[level]["xp"]
    next_level_xp = LEVELS[level + 1]["xp"] if level < len(LEVELS) - 1 else LEVELS[level]["xp"] + 500
    xp_in_current = xp - current_level_xp
    xp_for_next = next_level_xp - current_level_xp

    streak = 0
    check_date = date.today()
    while True:
        day_completions = db.query(models.TaskInstance).filter(
            models.TaskInstance.user_id == user.id,
            models.TaskInstance.occurrence_date == check_date,
            models.TaskInstance.status == "Completed",
        ).count()
        if day_completions > 0:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    return schemas.GamificationResponse(
        xp=xp,
        level=level,
        levelName=LEVELS[level]["name"],
        xpForNextLevel=xp_for_next,
        xpInCurrentLevel=xp_in_current,
        streak=streak,
    )
