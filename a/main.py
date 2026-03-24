from fastapi import FastAPI, Request, HTTPException, UploadFile, File, Form, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables FIRST
load_dotenv()

from app.core.config import settings
from app.routes import auth, convert, preview, history, admin, downloads, free_tool
from app.db.database import init_db

app = FastAPI(title="Accountesy", description="Accounting SaaS Platform")

# Mount static files
try:
    app.mount("/static", StaticFiles(directory="static"), name="static")
except Exception as e:
    print(f"Static files mount error: {e}")
    # Create static directory if it doesn't exist
    os.makedirs("static", exist_ok=True)
    app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(convert.router, prefix="/api/convert", tags=["convert"])
app.include_router(preview.router, prefix="/api/preview", tags=["preview"])
app.include_router(history.router, prefix="/api/history", tags=["history"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(downloads.router, prefix="/api/downloads", tags=["downloads"])
app.include_router(free_tool.router, prefix="/api/free", tags=["free_tool"])

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("static/assets/logo.png", media_type="image/png")

@app.get("/favicon.png")
async def favicon_png():
    return FileResponse("static/assets/logo.png", media_type="image/png")

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/{full_path:path}", response_class=HTMLResponse)
async def catch_all(request: Request, full_path: str):
    # Serve React app for all non-API routes
    if not full_path.startswith("api/") and not full_path.startswith("static/"):
        return templates.TemplateResponse("index.html", {"request": request})
    raise HTTPException(status_code=404, detail="Not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
