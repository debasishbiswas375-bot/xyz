from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from app.auth import get_admin_user

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    credits: int = 10
    role: str = "user"
    active_plan: str = "free"

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    credits: Optional[int] = None
    role: Optional[str] = None
    active_plan: Optional[str] = None

class NotificationCreate(BaseModel):
    title: str
    message: str
    user_ids: Optional[List[str]] = None  # If None, broadcast to all

class StatsResponse(BaseModel):
    total_users: int
    active_users: int
    total_conversions: int
    revenue: float

@router.get("/dashboard")
async def admin_dashboard(admin_user: dict = Depends(get_admin_user)):
    """Get admin dashboard stats"""
    db = get_db()
    
    try:
        # Get total users
        users_result = db.table("users").select("id").execute()
        total_users = len(users_result.data)
        
        # Get active users (with credits > 0)
        active_users_result = db.table("users").select("id").gt("credits", 0).execute()
        active_users = len(active_users_result.data)
        
        # Get total conversions
        history_result = db.table("history").select("id").execute()
        total_conversions = len(history_result.data)
        
        # Calculate revenue (simplified - would need payment integration)
        revenue = 0.0
        
        return {
            "total_users": total_users,
            "active_users": active_users,
            "total_conversions": total_conversions,
            "revenue": revenue
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch dashboard data")

@router.get("/users")
async def get_all_users(admin_user: dict = Depends(get_admin_user)):
    """Get all users with details"""
    db = get_db()
    
    try:
        result = db.table("users").select("*").order("created_at", desc=True).execute()
        return {"users": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch users")

@router.post("/users/create")
async def create_user(user_data: UserCreate, admin_user: dict = Depends(get_admin_user)):
    """Create new user (admin only)"""
    from app.database import get_password_hash
    
    db = get_db()
    
    try:
        # Check if user already exists
        existing_user = db.table("users").select("id").or_(f"email.eq.{user_data.email},username.eq.{user_data.username}").execute()
        if existing_user.data:
            raise HTTPException(status_code=400, detail="Email or username already exists")
        
        # Create user
        hashed_password = get_password_hash(user_data.password)
        new_user = {
            "username": user_data.username,
            "email": user_data.email,
            "password": hashed_password,
            "credits": user_data.credits,
            "role": user_data.role,
            "active_plan": user_data.active_plan
        }
        
        result = db.table("users").insert(new_user).execute()
        return {"message": "User created successfully", "user": result.data[0]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create user")

@router.put("/users/{user_id}")
async def update_user(user_id: str, user_data: UserUpdate, admin_user: dict = Depends(get_admin_user)):
    """Update user (admin only)"""
    db = get_db()
    
    # Filter out None values
    update_data = {k: v for k, v in user_data.dict().items() if v is not None}
    
    try:
        result = db.table("users").update(update_data).eq("id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User updated successfully", "user": result.data[0]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update user")

@router.delete("/users/{user_id}")
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

@router.get("/plans")
async def get_all_plans(admin_user: dict = Depends(get_admin_user)):
    """Get all plans (admin only)"""
    db = get_db()
    
    try:
        result = db.table("plans").select("*").order("created_at", desc=True).execute()
        return {"plans": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch plans")

@router.post("/notifications/send")
async def send_notification(notification_data: NotificationCreate, admin_user: dict = Depends(get_admin_user)):
    """Send notification to users"""
    db = get_db()
    
    try:
        notifications_sent = 0
        
        if notification_data.user_ids:
            # Send to specific users
            for user_id in notification_data.user_ids:
                notification = {
                    "user_id": user_id,
                    "title": notification_data.title,
                    "message": notification_data.message
                }
                db.table("notifications").insert(notification).execute()
                notifications_sent += 1
        else:
            # Broadcast to all users
            users_result = db.table("users").select("id").execute()
            for user in users_result.data:
                notification = {
                    "user_id": user["id"],
                    "title": notification_data.title,
                    "message": notification_data.message
                }
                db.table("notifications").insert(notification).execute()
                notifications_sent += 1
        
        return {"message": f"Notification sent to {notifications_sent} users"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send notification")

@router.get("/conversions")
async def get_all_conversions(admin_user: dict = Depends(get_admin_user)):
    """Get all conversion history"""
    db = get_db()
    
    try:
        result = db.table("history").select("*").order("created_at", desc=True).execute()
        return {"conversions": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch conversions")

@router.get("/system-health")
async def system_health(admin_user: dict = Depends(get_admin_user)):
    """Get system health status"""
    db = get_db()
    
    try:
        # Get various metrics
        users_count = len(db.table("users").select("id").execute().data)
        plans_count = len(db.table("plans").select("id").execute().data)
        conversions_count = len(db.table("history").select("id").execute().data)
        
        return {
            "status": "healthy",
            "metrics": {
                "users": users_count,
                "plans": plans_count,
                "conversions": conversions_count
            },
            "database": "connected",
            "api": "running"
        }
    
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }
