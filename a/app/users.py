from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.database import get_db
from app.auth import get_current_user, get_admin_user

router = APIRouter()

class UserProfile(BaseModel):
    username: str
    email: str

class UserCreditsUpdate(BaseModel):
    credits: int

class UserPlanUpdate(BaseModel):
    active_plan: str
    valid_till: str

@router.get("/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """Get user profile"""
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "email": current_user["email"],
        "credits": current_user["credits"],
        "role": current_user["role"],
        "active_plan": current_user["active_plan"],
        "valid_till": current_user["valid_till"],
        "created_at": current_user["created_at"]
    }

@router.get("/history")
async def get_user_history(current_user: dict = Depends(get_current_user)):
    """Get user's conversion history (last 3 XML)"""
    db = get_db()
    
    try:
        result = db.table("history").select("*").eq("user_id", current_user["id"]).order("created_at", desc=True).limit(3).execute()
        return {"history": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch history")

@router.post("/deduct-credits")
async def deduct_credits(amount: int, current_user: dict = Depends(get_current_user)):
    """Deduct credits from user account"""
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    db = get_db()
    
    try:
        # Check current credits
        result = db.table("users").select("credits").eq("id", current_user["id"]).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        current_credits = result.data[0]["credits"]
        
        if current_credits < amount:
            raise HTTPException(status_code=400, detail="Insufficient credits")
        
        # Update credits
        new_credits = current_credits - amount
        db.table("users").update({"credits": new_credits}).eq("id", current_user["id"]).execute()
        
        return {"message": "Credits deducted successfully", "remaining_credits": new_credits}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update credits")

# Admin endpoints
@router.get("/admin/all")
async def get_all_users(admin_user: dict = Depends(get_admin_user)):
    """Get all users (admin only)"""
    db = get_db()
    
    try:
        result = db.table("users").select("*").order("created_at", desc=True).execute()
        return {"users": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch users")

@router.post("/admin/{user_id}/credits")
async def update_user_credits(user_id: str, credits_data: UserCreditsUpdate, admin_user: dict = Depends(get_admin_user)):
    """Update user credits (admin only)"""
    db = get_db()
    
    try:
        result = db.table("users").update({"credits": credits_data.credits}).eq("id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "Credits updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update credits")

@router.post("/admin/{user_id}/plan")
async def update_user_plan(user_id: str, plan_data: UserPlanUpdate, admin_user: dict = Depends(get_admin_user)):
    """Update user plan (admin only)"""
    db = get_db()
    
    try:
        result = db.table("users").update({
            "active_plan": plan_data.active_plan,
            "valid_till": plan_data.valid_till
        }).eq("id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "Plan updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update plan")

@router.delete("/admin/{user_id}")
async def delete_user(user_id: str, admin_user: dict = Depends(get_admin_user)):
    """Delete user (admin only)"""
    db = get_db()
    
    try:
        result = db.table("users").delete().eq("id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete user")
