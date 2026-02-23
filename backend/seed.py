"""
Seed script — populates the database with initial tasks and holidays from the PRD.
Idempotent: skips records that already exist.

Usage:
    cd backend
    source venv/bin/activate
    python seed.py
"""
import uuid
from datetime import datetime, date
from dotenv import load_dotenv

load_dotenv()

from database import SessionLocal
from models import Profile, Task, Holiday

TEST_DISPLAY_NAME = "user@tasktracker.dev"

def seed():
    db = SessionLocal()
    try:
        # 1. Create test profile if not exists
        user = db.query(Profile).filter(Profile.display_name == TEST_DISPLAY_NAME).first()
        if not user:
            user = Profile(
                id=uuid.uuid4(),
                display_name=TEST_DISPLAY_NAME,
                timezone="America/Vancouver",
                week_start_day="Sunday",
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"✅ Created test profile: {TEST_DISPLAY_NAME}")
        else:
            print(f"ℹ️  Profile already exists: {TEST_DISPLAY_NAME}")

        # 2. Seed tasks
        tasks_data = [
            {"task_code": "T001", "name": "Brush Teeth", "category": "Health",
             "recurrence_rule": {"period": "Weekly", "occurrence": "Mon,Wed,Fri"}, "base_time_minutes": 5},
            {"task_code": "T002", "name": "Pay Rent", "category": "Bills",
             "recurrence_rule": {"period": "Monthly", "occurrence": "1"}, "base_time_minutes": 15},
            {"task_code": "T003", "name": "Pay Tax Installment", "category": "Taxes",
             "recurrence_rule": {"period": "Quarterly", "occurrence": "Mar 1"}, "base_time_minutes": 30},
            {"task_code": "T004", "name": "Complete Taxes", "category": "Taxes",
             "recurrence_rule": {"period": "Yearly", "occurrence": "Apr 30"}, "base_time_minutes": 120},
            {"task_code": "T005", "name": "Weekly Team Standup", "category": "Work",
             "recurrence_rule": {"period": "Weekly", "occurrence": "Mon,Tue,Wed,Thu,Fri"}, "base_time_minutes": 15},
            {"task_code": "T006", "name": "Grocery Shopping", "category": "Personal",
             "recurrence_rule": {"period": "Weekly", "occurrence": "Sat"}, "base_time_minutes": 60},
            {"task_code": "T007", "name": "Gym Workout", "category": "Health",
             "recurrence_rule": {"period": "Weekly", "occurrence": "Tue,Thu,Sat"}, "base_time_minutes": 60},
        ]

        created_tasks = 0
        for t in tasks_data:
            existing = db.query(Task).filter(Task.user_id == user.id, Task.task_code == t["task_code"]).first()
            if not existing:
                db.add(Task(user_id=user.id, status="Active", priority=0, **t))
                created_tasks += 1

        db.commit()
        print(f"✅ Seeded {created_tasks} tasks (skipped {len(tasks_data) - created_tasks} existing)")

        # 3. Seed holidays
        holidays_data = [
            {"name": "New Year's Day", "holiday_date": date(2026, 1, 1), "category": "Business"},
            {"name": "Family Day", "holiday_date": date(2026, 2, 16), "category": "Business"},
            {"name": "Good Friday", "holiday_date": date(2026, 4, 3), "category": "Business"},
            {"name": "Victoria Day", "holiday_date": date(2026, 5, 18), "category": "Business"},
            {"name": "Canada Day", "holiday_date": date(2026, 7, 1), "category": "Business"},
            {"name": "B.C. Day", "holiday_date": date(2026, 8, 3), "category": "Business"},
            {"name": "Labour Day", "holiday_date": date(2026, 9, 7), "category": "Business"},
            {"name": "Thanksgiving", "holiday_date": date(2026, 10, 12), "category": "Business"},
            {"name": "Remembrance Day", "holiday_date": date(2026, 11, 11), "category": "Business"},
            {"name": "Christmas Day", "holiday_date": date(2026, 12, 25), "category": "Personal"},
        ]

        created_holidays = 0
        for h in holidays_data:
            existing = db.query(Holiday).filter(
                Holiday.user_id == user.id,
                Holiday.holiday_date == h["holiday_date"],
                Holiday.name == h["name"],
            ).first()
            if not existing:
                db.add(Holiday(user_id=user.id, **h))
                created_holidays += 1

        db.commit()
        print(f"✅ Seeded {created_holidays} holidays (skipped {len(holidays_data) - created_holidays} existing)")
        print("\n🎉 Database seeding complete!")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
