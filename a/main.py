from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import uvicorn

# ❌ REMOVE dotenv in production (Render already provides env)
# from dotenv import load_dotenv
# load_dotenv()

# Import app modules
from app.database import init_db
from app.auth import router as auth_router
from app.users import router as users_router
from app.plans import router as plans_router
from app.upload import router as upload_router
from app.admin import router as admin_router
from app.notifications import router as notifications_router
from app.feedback import router as feedback_router

# Initialize app
app = FastAPI(
    title="Accountesy",
    description="Smart Accounting for Modern Business",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Static files (IMPORTANT)
app.mount("/static", StaticFiles(directory="static"), name="static")

# ✅ API routes
app.include_router(auth_router, prefix="/api/auth")
app.include_router(users_router, prefix="/api/users")
app.include_router(plans_router, prefix="/api/plans")
app.include_router(upload_router, prefix="/api/upload")
app.include_router(admin_router, prefix="/api/admin")
app.include_router(notifications_router, prefix="/api/notifications")
app.include_router(feedback_router, prefix="/api")

# ✅ Startup (FIXED - no await)
@app.on_event("startup")
async def startup_event():
    init_db()

# ✅ Root (React entry)
@app.get("/")
async def root():
    return FileResponse("static/index.html")

# ✅ SPA fallback (VERY IMPORTANT)
@app.get("/{full_path:path}")
async def spa_fallback(full_path: str):
    file_path = os.path.join("static", full_path)

    # Serve file if exists
    if os.path.exists(file_path):
        return FileResponse(file_path)

    # Otherwise serve React app
    return FileResponse("static/index.html")

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Run
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
