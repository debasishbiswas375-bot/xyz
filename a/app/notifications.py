from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from app.database import get_db
from app.auth import get_current_user

router = APIRouter()

class Notification(BaseModel):
    id: str
    title: str
    message: str
    created_at: str
    read: bool

class NotificationUpdate(BaseModel):
    read: bool

@router.get("/")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    """Get user notifications"""
    db = get_db()
    
    try:
        result = db.table("notifications").select("*").eq("user_id", current_user["id"]).order("created_at", desc=True).execute()
        return {"notifications": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch notifications")

@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    notification_data: NotificationUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Mark notification as read/unread"""
    db = get_db()
    
    try:
        result = db.table("notifications").update({"read": notification_data.read}).eq("id", notification_id).eq("user_id", current_user["id"]).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {"message": "Notification updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update notification")

@router.delete("/{notification_id}")
async def delete_notification(notification_id: str, current_user: dict = Depends(get_current_user)):
    """Delete notification"""
    db = get_db()
    
    try:
        result = db.table("notifications").delete().eq("id", notification_id).eq("user_id", current_user["id"]).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {"message": "Notification deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete notification")

@router.post("/mark-all-read")
async def mark_all_notifications_read(current_user: dict = Depends(get_current_user)):
    """Mark all notifications as read"""
    db = get_db()
    
    try:
        db.table("notifications").update({"read": True}).eq("user_id", current_user["id"]).execute()
        return {"message": "All notifications marked as read"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update notifications")

@router.get("/unread-count")
async def get_unread_count(current_user: dict = Depends(get_current_user)):
    """Get count of unread notifications"""
    db = get_db()
    
    try:
        result = db.table("notifications").select("id").eq("user_id", current_user["id"]).eq("read", False).execute()
        return {"unread_count": len(result.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch unread count")
