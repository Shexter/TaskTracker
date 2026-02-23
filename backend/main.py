from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from dotenv import load_dotenv

load_dotenv() # Load env vars from .env file

from routes import tasks, holidays, calendar, chat, dashboard, gamification, task_instances

app = FastAPI(title="TaskTracker API")

# Configure CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router, prefix="/api")
app.include_router(holidays.router, prefix="/api")
app.include_router(calendar.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(gamification.router, prefix="/api")
app.include_router(task_instances.router, prefix="/api")

from sqlalchemy import text

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    # Simple check to see if database is reachable
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"disconnected ({e})"
    return {"status": "ok", "database": db_status}
