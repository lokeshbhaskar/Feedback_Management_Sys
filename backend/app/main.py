from fastapi import FastAPI
from app.database.postgresql import engine, Base
from app.routers import user , auth

app = FastAPI(title="Feedback System")

# Test: create tables (if they don't exist)
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "PostgreSQL connection successful!"}

app.include_router(auth.router)
app.include_router(user.router)