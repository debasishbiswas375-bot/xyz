from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
import os
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()

# Import app modules
from app.database import init_db
from app.auth import router as auth_router
from app.users import router as users_router
from app.plans import router as plans_router
from app.upload import router as upload_router
from app.admin import router as admin_router
from app.notifications import router as notifications_router
from app.feedback import router as feedback_router

# Initialize FastAPI app
app = FastAPI(
    title="Accountesy",
    description="Smart Accounting for Modern Business",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(plans_router, prefix="/api/plans", tags=["plans"])
app.include_router(upload_router, prefix="/api/upload", tags=["upload"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(notifications_router, prefix="/api/notifications", tags=["notifications"])
app.include_router(feedback_router, prefix="/api", tags=["feedback"])

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def root(request: Request):
    return FileResponse("static/index.html")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Accountesy API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
