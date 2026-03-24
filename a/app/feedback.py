from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.auth import get_admin_user

router = APIRouter()

class FeedbackCreate(BaseModel):
    full_name: str
    username: Optional[str] = None
    email: Optional[str] = None
    contact_number: Optional[str] = None
    message: str

class FeedbackResponse(BaseModel):
    id: str
    full_name: str
    username: Optional[str]
    email: Optional[str]
    contact_number: Optional[str]
    message: str
    created_at: str

@router.post("/feedback")
async def create_feedback(feedback_data: FeedbackCreate):
    """Create new feedback entry"""
    db = get_db()
    
    # Validate message length
    if len(feedback_data.message.strip()) < 30:
        raise HTTPException(
            status_code=400, 
            detail="Message must be at least 30 characters long"
        )
    
    # Validate full name
    if not feedback_data.full_name.strip():
        raise HTTPException(
            status_code=400, 
            detail="Full name is required"
        )
    
    try:
        # Create feedback table if not exists
        create_feedback_table_sql = """
        CREATE TABLE IF NOT EXISTS feedback (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            full_name VARCHAR(255) NOT NULL,
            username VARCHAR(100),
            email VARCHAR(255),
            contact_number VARCHAR(20),
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        db.rpc('exec_sql', {'sql': create_feedback_table_sql}).execute()
        
        # Insert feedback
        feedback_entry = {
            "full_name": feedback_data.full_name.strip(),
            "username": feedback_data.username.strip() if feedback_data.username else None,
            "email": feedback_data.email.strip() if feedback_data.email else None,
            "contact_number": feedback_data.contact_number.strip() if feedback_data.contact_number else None,
            "message": feedback_data.message.strip()
        }
        
        result = db.table("feedback").insert(feedback_entry).execute()
        
        return {
            "message": "Feedback submitted successfully! Thank you for your valuable input.",
            "id": result.data[0]["id"]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail="Failed to submit feedback. Please try again."
        )

@router.get("/admin/feedback")
async def get_all_feedback(admin_user: dict = Depends(get_admin_user)):
    """Get all feedback entries (admin only)"""
    db = get_db()
    
    try:
        result = db.table("feedback").select("*").order("created_at", desc=True).execute()
        return {"feedback": result.data}
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail="Failed to fetch feedback"
        )
