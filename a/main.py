from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load env FIRST
load_dotenv()

from app.routes import auth, convert, preview, history, admin, downloads, free_tool
from app.db.database import init_db

app = FastAPI(title="Accountesy", description="Accounting SaaS Platform")

# ✅ CORS (IMPORTANT for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Ensure static exists
if not os.path.exists("static"):
    os.makedirs("static")

# ✅ Mount static (React build goes here)
app.mount("/static", StaticFiles(directory="static"), name="static")

# ================= ROUTES =================

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(convert.router, prefix="/api/convert", tags=["convert"])
app.include_router(preview.router, prefix="/api/preview", tags=["preview"])
app.include_router(history.router, prefix="/api/history", tags=["history"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(downloads.router, prefix="/api/downloads", tags=["downloads"])
app.include_router(free_tool.router, prefix="/api/free", tags=["free"])

# ================= STARTUP =================

@app.on_event("startup")
async def startup_event():
    init_db()

# ================= STATIC FILE FIX =================

# ✅ Fix favicon 500 error
@app.get("/favicon.ico")
async def favicon():
    return FileResponse("static/assets/logo.png")

# ================= FRONTEND SERVE =================

# ✅ Serve React app
@app.get("/")
async def serve_root():
    return FileResponse("static/index.html")

# ✅ Catch-all (VERY IMPORTANT for React routing)
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    if full_path.startswith("api") or full_path.startswith("static"):
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse("static/index.html")

# ================= LOCAL RUN =================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
