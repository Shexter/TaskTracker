import calendar
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Session
from models import Task, TaskInstance

class RecurrenceExpander:
    def __init__(self, db: Session):
        self.db = db

    def expand_task(self, task: Task, start_date: date, end_date: date):
        """Generates TaskInstances for the given task between start and end date (inclusive)"""
        instances = []
        if task.period == "Weekly":
            instances = self._expand_weekly(task, start_date, end_date)
        elif task.period == "Monthly":
            instances = self._expand_monthly(task, start_date, end_date)
        elif task.period == "Quarterly":
            instances = self._expand_quarterly(task, start_date, end_date)
        elif task.period == "Yearly":
            instances = self._expand_yearly(task, start_date, end_date)
        elif task.period == "OneTime":
            instances = self._expand_onetime(task, start_date, end_date)
            
        generated_count = 0
        for inst_date in instances:
            existing = self.db.query(TaskInstance).filter(
                TaskInstance.task_id == task.id, 
                TaskInstance.occurrence_date == inst_date
            ).first()
            if not existing:
                new_inst = TaskInstance(
                    task_id=task.id,
                    user_id=task.user_id,
                    occurrence_date=inst_date,
                    status="Pending"
                )
                self.db.add(new_inst)
                generated_count += 1
        self.db.commit()
        return generated_count

    def _expand_weekly(self, task: Task, start_date: date, end_date: date):
        # occurrence e.g. "Mon,Wed,Fri"
        days_map = {"Mon": 0, "Tue": 1, "Wed": 2, "Thu": 3, "Fri": 4, "Sat": 5, "Sun": 6}
        target_days = [days_map[d.strip()] for d in task.occurrence.split(",") if d.strip() in days_map]
        
        instances = []
        current_date = start_date
        while current_date <= end_date:
            if current_date.weekday() in target_days:
                instances.append(current_date)
            current_date += timedelta(days=1)
        return instances

    def _expand_monthly(self, task: Task, start_date: date, end_date: date):
        # occurrence e.g. "1" or "31"
        try:
            target_day = int(task.occurrence)
        except ValueError:
            return [] # Invalid for MVP
            
        instances = []
        current_date = start_date.replace(day=1)
        while current_date <= end_date:
            _, last_day = calendar.monthrange(current_date.year, current_date.month)
            day_to_use = min(target_day, last_day)
            
            inst_date = current_date.replace(day=day_to_use)
            if start_date <= inst_date <= end_date:
                instances.append(inst_date)
            
            current_date += relativedelta(months=1)
        return instances

    def _expand_quarterly(self, task: Task, start_date: date, end_date: date):
        # occurrence e.g. "Mar 1"
        try:
            month_str, day_str = task.occurrence.split(" ")
            target_day = int(day_str)
            month_map = {"Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6, "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12}
            target_month = month_map[month_str[:3]]
        except Exception:
            return []

        instances = []
        # Find a starting date that matches the month/day before the start_date year.
        current_date = date(start_date.year - 1, target_month, 1) # day handles end-of-month below
        
        # apply bounds logic for target_day based on the month
        _, last_day = calendar.monthrange(current_date.year, current_date.month)
        day_to_use = min(target_day, last_day)
        current_date = current_date.replace(day=day_to_use)

        while current_date <= end_date:
            if start_date <= current_date <= end_date:
                instances.append(current_date)
            current_date += relativedelta(months=3)
            _, last_day = calendar.monthrange(current_date.year, current_date.month)
            day_to_use = min(target_day, last_day)
            current_date = current_date.replace(day=day_to_use)
            
        return instances

    def _expand_yearly(self, task: Task, start_date: date, end_date: date):
        # occurrence e.g. "Apr 30"
        try:
            month_str, day_str = task.occurrence.split(" ")
            target_day = int(day_str)
            month_map = {"Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6, "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12}
            target_month = month_map[month_str[:3]]
        except Exception:
            return []

        instances = []
        current_date = date(start_date.year - 1, target_month, 1)
        _, last_day = calendar.monthrange(current_date.year, current_date.month)
        day_to_use = min(target_day, last_day)
        current_date = current_date.replace(day=day_to_use)

        while current_date <= end_date:
            if start_date <= current_date <= end_date:
                instances.append(current_date)
            current_date += relativedelta(years=1)
            _, last_day = calendar.monthrange(current_date.year, current_date.month)
            day_to_use = min(target_day, last_day)
            current_date = current_date.replace(day=day_to_use)
            
        return instances

    def _expand_onetime(self, task: Task, start_date: date, end_date: date):
        # occurrence e.g. "2026-04-15"
        try:
            inst_date = date.fromisoformat(task.occurrence)
            if start_date <= inst_date <= end_date:
                return [inst_date]
        except ValueError:
            pass
        return []
