from supabase import create_client, Client
from app.core.config import settings
from typing import Optional, Dict, Any

supabase: Optional[Client] = None

def init_db():
    """Initialize database connection"""
    global supabase
    
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        print("Database not configured - running in demo mode")
        return
    
    try:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        # Test connection
        response = supabase.table('users').select('count').execute()
        print("Database connected successfully")
    except Exception as e:
        print(f"Database connection failed: {e}")
        supabase = None

def get_supabase() -> Optional[Client]:
    return supabase

async def get_current_user(token: str) -> Optional[Dict[str, Any]]:
    """Get current user from token"""
    if not supabase:
        return None
    try:
        response = supabase.auth.get_user(token)
        if response.user:
            return response.user
    except Exception:
        pass
    return None
