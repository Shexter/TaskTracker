from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta
from collections import Counter

from database import get_db
import models, schemas
from logic.recurrence import RecurrenceExpander

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

CATEGORY_COLORS = {
    "Health": "hsl(160, 84%, 39%)",
    "Bills": "hsl(217, 91%, 60%)",
    "Taxes": "hsl(38, 92%, 50%)",
    "Work": "hsl(263, 70%, 58%)",
    "Personal": "hsl(350, 89%, 60%)",
}

WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

def get_current_user(email: str, db: Session = Depends(get_db)):
    user = db.query(models.Profile).filter(models.Profile.display_name == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/metrics", response_model=schemas.DashboardMetricsResponse)
def get_dashboard_metrics(email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)

    today = date.today()
    start = today.replace(day=1)
    if start.month == 12:
        end = start.replace(year=start.year + 1, month=1, day=1) - timedelta(days=1)
    else:
        end = start.replace(month=start.month + 1, day=1) - timedelta(days=1)

    expander = RecurrenceExpander(db)
    tasks = db.query(models.Task).filter(models.Task.user_id == user.id).all()
    for task in tasks:
        expander.expand_task(task, start, end)

    instances = db.query(models.TaskInstance).filter(
        models.TaskInstance.user_id == user.id,
        models.TaskInstance.occurrence_date >= start,
        models.TaskInstance.occurrence_date <= end,
    ).all()

    total = len(instances)
    completed = sum(1 for i in instances if i.status == "Completed")
    completion_rate = round((completed / total) * 100) if total > 0 else 0

    task_map = {t.id: t for t in tasks}
    hours_scheduled = 0.0
    for inst in instances:
        t = task_map.get(inst.task_id)
        if t and t.base_time_minutes:
            hours_scheduled += t.base_time_minutes / 60.0
    hours_scheduled = round(hours_scheduled, 1)

    day_counts: Counter = Counter()
    for inst in instances:
        day_name = WEEKDAY_NAMES[inst.occurrence_date.weekday()]
        day_counts[day_name] += 1
    busiest_day = day_counts.most_common(1)[0][0] if day_counts else "N/A"

    cat_counts: Counter = Counter()
    for inst in instances:
        t = task_map.get(inst.task_id)
        if t:
            cat_counts[t.category] += 1
    tasks_by_category = [
        schemas.CategoryCount(name=name, count=count, color=CATEGORY_COLORS.get(name, "#888"))
        for name, count in cat_counts.items()
    ]

    weekly_data = []
    for day_name in WEEKDAY_NAMES:
        day_insts = [i for i in instances if WEEKDAY_NAMES[i.occurrence_date.weekday()] == day_name]
        weekly_data.append(schemas.WeekDayData(
            day=day_name,
            completed=sum(1 for i in day_insts if i.status == "Completed"),
            pending=sum(1 for i in day_insts if i.status == "Pending"),
        ))

    upcoming = db.query(models.TaskInstance).join(models.Task).filter(
        models.TaskInstance.user_id == user.id,
        models.TaskInstance.occurrence_date >= today,
        models.TaskInstance.status == "Pending",
    ).order_by(models.TaskInstance.occurrence_date).limit(5).all()

    upcoming_responses = []
    for inst in upcoming:
        task_resp = schemas.TaskResponse.model_validate(inst.task) if inst.task else None
        upcoming_responses.append(schemas.TaskInstanceResponse(
            id=inst.id,
            task_id=inst.task_id,
            user_id=inst.user_id,
            occurrence_date=inst.occurrence_date,
            status=inst.status,
            completed_at=inst.completed_at,
            created_at=inst.created_at,
            task=task_resp,
        ))

    return schemas.DashboardMetricsResponse(
        totalTasks=total,
        completionRate=completion_rate,
        hoursScheduled=hours_scheduled,
        busiestDay=busiest_day,
        tasksByCategory=tasks_by_category,
        weeklyData=weekly_data,
        upcomingTasks=upcoming_responses,
    )
