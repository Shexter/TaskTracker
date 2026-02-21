import argparse
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, Task, Holiday, TaskInstance
from datetime import datetime, timedelta

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_user(db: Session, email: str, password: str, timezone: str):
    user = User(email=email, hashed_password=password, timezone=timezone)
    db.add(user)
    db.commit()
    db.refresh(user)
    print(f"User created: {user.email} (ID: {user.id})")

def list_users(db: Session):
    users = db.query(User).all()
    for u in users:
        print(f"[{u.id}] {u.email} - TZ: {u.timezone}")

def create_task(db: Session, user_email: str, name: str, category: str, period: str, occurrence: str, time_spent: int):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        print(f"User {user_email} not found")
        return
    
    existing = db.query(Task).filter(Task.user_id == user.id, Task.name == name).first()
    if existing:
        print(f"Task '{name}' already exists for user")
        return

    # Simple ID generation for MVP CLI
    task_count = db.query(Task).filter(Task.user_id == user.id).count()
    task_id = f"T{task_count + 1:03d}"
    
    task = Task(
        user_id=user.id,
        task_id=task_id,
        name=name,
        category=category,
        period=period,
        occurrence=occurrence,
        base_time_minutes=time_spent
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    print(f"Task created: [{task.task_id}] {task.name} ({task.period}: {task.occurrence})")

def list_tasks(db: Session, user_email: str):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
         print(f"User {user_email} not found")
         return
    tasks = db.query(Task).filter(Task.user_id == user.id).all()
    for t in tasks:
        print(f"[{t.task_id}] {t.name} - {t.category} - {t.period}: {t.occurrence} ({t.status})")

def create_holiday(db: Session, user_email: str, name: str, date_str: str, category: str):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
         print(f"User {user_email} not found")
         return
    try:
         holiday_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
         print("Invalid date format. Use YYYY-MM-DD")
         return
    
    existing = db.query(Holiday).filter(Holiday.user_id == user.id, Holiday.holiday_date == holiday_date).first()
    if existing:
         print(f"Holiday already exists on {holiday_date}")
         return

    holiday = Holiday(user_id=user.id, name=name, holiday_date=holiday_date, category=category)
    db.add(holiday)
    db.commit()
    db.refresh(holiday)
    print(f"Holiday created: {holiday.name} on {holiday.holiday_date}")

def list_holidays(db: Session, user_email: str):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
         print(f"User {user_email} not found")
         return
    holidays = db.query(Holiday).filter(Holiday.user_id == user.id).all()
    for h in holidays:
        print(f"[{h.holiday_date}] {h.name} ({h.category})")

def expand_tasks_cmd(db: Session, user_email: str, start_date_str: str, end_date_str: str):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        print(f"User {user_email} not found")
        return
        
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    
    from logic.recurrence import RecurrenceExpander
    expander = RecurrenceExpander(db)
    
    tasks = db.query(Task).filter(Task.user_id == user.id).all()
    total_generated = 0
    for task in tasks:
        count = expander.expand_task(task, start_date, end_date)
        total_generated += count
        
    print(f"Generated {total_generated} new task instances between {start_date} and {end_date}.")

def show_week(db: Session, user_email: str, target_date_str: str):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        print(f"User {user_email} not found")
        return
        
    target_date = datetime.strptime(target_date_str, "%Y-%m-%d").date()
    # Find start of week (e.g. Monday)
    start_of_week = target_date - timedelta(days=target_date.weekday())
    
    # Query instances in this 7-day window
    instances = db.query(TaskInstance).join(Task).filter(
        TaskInstance.user_id == user.id,
        TaskInstance.occurrence_date >= start_of_week,
        TaskInstance.occurrence_date < start_of_week + timedelta(days=7)
    ).all()
    
    print(f"\n{'='*50}")
    print(f"WEEK VIEW: {start_of_week.strftime('%b %d')} - {(start_of_week + timedelta(days=6)).strftime('%b %d, %Y')}")
    print(f"{'='*50}")
    
    from collections import defaultdict
    grid = defaultdict(list)
    total_time = 0
    completed_time = 0
    total_tasks = len(instances)
    completed_tasks = 0
    
    for inst in instances:
        grid[inst.occurrence_date].append(inst)
        if inst.task.base_time_minutes:
            total_time += inst.task.base_time_minutes
            if inst.status == "Completed":
                completed_time += inst.task.base_time_minutes
        if inst.status == "Completed":
            completed_tasks += 1
            
    print("\n[ Week Summary ]")
    print(f"Total Tasks:        {total_tasks}")
    print(f"Tasks Done:         {completed_tasks}")
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks else 0
    print(f"Completion Rate:    {completion_rate:.0f}%")
    print(f"Total Time Sched:   {total_time/60:.1f} hrs")
    print("-" * 50)
    
    for i in range(7):
        current_day = start_of_week + timedelta(days=i)
        day_instances = grid[current_day]
        print(f"\n{current_day.strftime('%A, %b %d')} ({len(day_instances)} Tasks)")
        print("-" * 30)
        if not day_instances:
            print("  No tasks scheduled.")
        for inst in day_instances:
            time_str = f"{inst.task.base_time_minutes}m" if inst.task.base_time_minutes else "N/A"
            print(f"  [{'X' if inst.status == 'Completed' else ' '}] {inst.task.name} ({inst.task.category}) - {time_str}")
    print("\n")

def main():
    parser = argparse.ArgumentParser(description="TaskTracker CLI")
    subparsers = parser.add_subparsers(dest="command")

    # DB Commands
    db_init = subparsers.add_parser("init-db", help="Initialize demo database data")

    # User commands
    user_add = subparsers.add_parser("add-user", help="Add a user")
    user_add.add_argument("email")
    user_add.add_argument("--password", default="password123")
    user_add.add_argument("--tz", default="UTC")

    user_list = subparsers.add_parser("list-users", help="List all users")

    # Task commands
    task_add = subparsers.add_parser("add-task", help="Add a task")
    task_add.add_argument("email", help="User's email")
    task_add.add_argument("name", help="Task name")
    task_add.add_argument("category", help="Category (Health, Bills, etc)")
    task_add.add_argument("period", help="Weekly/Monthly/Quarterly/Yearly/OneTime")
    task_add.add_argument("occurrence", help="E.g., 'Mon,Wed,Fri' or '1' or 'Apr 30'")
    task_add.add_argument("--time", type=int, default=15, help="Base time in minutes")

    task_list = subparsers.add_parser("list-tasks", help="List tasks for user")
    task_list.add_argument("email")

    # Holiday commands
    hol_add = subparsers.add_parser("add-holiday", help="Add a holiday")
    hol_add.add_argument("email")
    hol_add.add_argument("name")
    hol_add.add_argument("date", help="YYYY-MM-DD")
    hol_add.add_argument("--cat", default="Personal")
    
    hol_list = subparsers.add_parser("list-holidays", help="List holidays for user")
    hol_list.add_argument("email")

    expand_cmd = subparsers.add_parser("expand-tasks", help="Expand tasks into instances")
    expand_cmd.add_argument("email")
    expand_cmd.add_argument("start", help="YYYY-MM-DD")
    expand_cmd.add_argument("end", help="YYYY-MM-DD")

    week_cmd = subparsers.add_parser("show-week", help="Show week view")
    week_cmd.add_argument("email")
    week_cmd.add_argument("date", help="Target date in week (YYYY-MM-DD)")

    args = parser.parse_args()

    db = next(get_db())

    try:
        if args.command == "add-user":
            create_user(db, args.email, args.password, args.tz)
        elif args.command == "list-users":
            list_users(db)
        elif args.command == "add-task":
            create_task(db, args.email, args.name, args.category, args.period, args.occurrence, args.time)
        elif args.command == "list-tasks":
            list_tasks(db, args.email)
        elif args.command == "add-holiday":
             create_holiday(db, args.email, args.name, args.date, args.cat)
        elif args.command == "list-holidays":
             list_holidays(db, args.email)
        elif args.command == "expand-tasks":
             expand_tasks_cmd(db, args.email, args.start, args.end)
        elif args.command == "show-week":
             show_week(db, args.email, args.date)
        elif args.command == "init-db": # Helper to seed the db based on the PRD
             email = "demo@example.com"
             user = db.query(User).filter(User.email == email).first()
             if not user:
                 print("Creating demo user...")
                 create_user(db, email, "demo123", "America/Vancouver")
             else:
                 print("Demo user already exists.")
             
             print("Creating demo holidays...")
             create_holiday(db, email, "New Year's Day", "2026-01-01", "Personal")
             create_holiday(db, email, "Family Day", "2026-02-17", "Personal")
             create_holiday(db, email, "Good Friday", "2026-04-18", "Personal")
             create_holiday(db, email, "Victoria Day", "2026-05-19", "Personal")

             print("Creating demo tasks...")
             create_task(db, email, "Brush Teeth", "Health", "Weekly", "Mon,Wed,Fri", 5)
             create_task(db, email, "Pay Rent", "Bills", "Monthly", "1", 15)
             create_task(db, email, "Pay Tax Installment", "Taxes", "Quarterly", "Mar 1", 30)
             create_task(db, email, "Complete Taxes", "Taxes", "Yearly", "Apr 30", 120)
             
             print("\n--- Demo Database Initialized ---")
             list_users(db)
             list_tasks(db, email)
             list_holidays(db, email)
        else:
            parser.print_help()
    finally:
        pass # db closes automatically in generator

if __name__ == "__main__":
    main()
