from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.postgresql import engine, Base
from app import models  # noqa: F401
from app.routers import user, auth, feedback, api_key, team, analytics

app = FastAPI(title="Feedback System")

# Allow frontend to communicate with backend
origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Test: create tables (if they don't exist)
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "PostgreSQL connection successful!"}

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(feedback.router)
app.include_router(api_key.router)
app.include_router(team.router)
app.include_router(analytics.router)
