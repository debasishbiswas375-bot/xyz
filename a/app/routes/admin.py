from fastapi import APIRouter, HTTPException, Depends
from app.routes.auth import get_current_user_from_token
from app.db.database import get_supabase
from app.services.credit_service import CreditService
from typing import List, Dict, Any
import os

router = APIRouter()

async def get_admin_user(current_user: Dict[str, Any] = Depends(get_current_user_from_token)):
    """Check if user is admin"""
    # For demo, consider first user as admin
    # In production, check user role in database
    if current_user['id'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/users")
async def get_all_users(admin_user: Dict[str, Any] = Depends(get_admin_user)):
    """Get all users"""
    try:
        supabase = get_supabase()
        response = supabase.table('users').select('*').order('created_at', desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/users/{user_id}/add-credits")
async def add_user_credits(
    user_id: str,
    credits: float,
    admin_user: Dict[str, Any] = Depends(get_admin_user)
):
    """Add credits to user"""
    try:
        credit_service = CreditService()
        result = await credit_service.add_credits(user_id, credits)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ai-memory")
async def get_ai_memory(admin_user: Dict[str, Any] = Depends(get_admin_user)):
    """Get all AI memory"""
    try:
        supabase = get_supabase()
        response = supabase.table('ai_memory').select('*').order('created_at', desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/ai-memory/{memory_id}")
async def delete_ai_memory(
    memory_id: str,
    admin_user: Dict[str, Any] = Depends(get_admin_user)
):
    """Delete AI memory entry"""
    try:
        supabase = get_supabase()
        supabase.table('ai_memory').delete().eq('id', memory_id).execute()
        return {"message": "AI memory entry deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/logs")
async def get_logs(admin_user: Dict[str, Any] = Depends(get_admin_user)):
    """Get system logs"""
    try:
        supabase = get_supabase()
        response = supabase.table('history').select('*').order('timestamp', desc=True).limit(100).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_stats(admin_user: Dict[str, Any] = Depends(get_admin_user)):
    """Get system statistics"""
    try:
        supabase = get_supabase()
        
        # User stats
        users_response = supabase.table('users').select('id, credits, created_at').execute()
        total_users = len(users_response.data)
        total_credits = sum(user['credits'] for user in users_response.data)
        
        # Conversion stats
        history_response = supabase.table('history').select('voucher_count, credits_used, timestamp').execute()
        total_conversions = len(history_response.data)
        total_vouchers = sum(h['voucher_count'] for h in history_response.data)
        total_credits_used = sum(h['credits_used'] for h in history_response.data)
        
        # AI memory stats
        memory_response = supabase.table('ai_memory').select('id').execute()
        total_ai_memory = len(memory_response.data)
        
        return {
            "users": {
                "total": total_users,
                "total_credits": total_credits
            },
            "conversions": {
                "total": total_conversions,
                "total_vouchers": total_vouchers,
                "total_credits_used": total_credits_used
            },
            "ai_memory": {
                "total_entries": total_ai_memory
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
