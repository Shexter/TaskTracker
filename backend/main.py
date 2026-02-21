from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, get_db

app = FastAPI(title="TaskTracker API")

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    # Simple check to see if database is reachable
    try:
        db.execute("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"disconnected ({e})"
    return {"status": "ok", "database": db_status}
