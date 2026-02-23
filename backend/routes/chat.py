import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta

from database import get_db
import models, schemas
from logic.recurrence import RecurrenceExpander

from google import genai
from google.genai import types

router = APIRouter(prefix="/chat", tags=["ChatAssistant"])

def get_current_user(email: str, db: Session = Depends(get_db)):
    user = db.query(models.Profile).filter(models.Profile.display_name == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=schemas.ChatResponse)
def chat_with_assistant(request: schemas.ChatRequest, email: str, db: Session = Depends(get_db)):
    user = get_current_user(email, db)

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on server")

    today = date.today()
    end_date = today + timedelta(days=7)

    expander = RecurrenceExpander(db)
    tasks = db.query(models.Task).filter(models.Task.user_id == user.id).all()
    for task in tasks:
        expander.expand_task(task, today, end_date)

    instances = db.query(models.TaskInstance).filter(
        models.TaskInstance.user_id == user.id,
        models.TaskInstance.occurrence_date >= today,
        models.TaskInstance.occurrence_date <= end_date
    ).all()

    schedule_context = f"The user's current date is {today}.\n"
    schedule_context += f"Here is the user's schedule from {today} to {end_date}:\n"
    for inst in instances:
        task_name = inst.task.name if inst.task else "Unknown"
        cat = inst.task.category if inst.task else "Unknown"
        status = inst.status
        date_str = inst.occurrence_date.strftime("%Y-%m-%d (%A)")
        schedule_context += f"- {date_str}: [{status}] {task_name} ({cat})\n"

    system_prompt = (
        "You are the TaskTracker AI Assistant. Your ONLY purpose is to help the user plan their schedule, "
        "analyze their tasks, and manage their time based on the calendar data provided to you. "
        "You must refuse to answer questions totally unrelated to scheduling, productivity, or the user's calendar. "
        "Speak concisely and directly.\n\n"
        "DATABASE CONTEXT:\n"
        f"{schedule_context}"
    )

    client = genai.Client(api_key=api_key)

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.message,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.7
            )
        )
        return schemas.ChatResponse(reply=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
