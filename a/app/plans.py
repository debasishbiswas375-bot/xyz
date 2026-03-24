from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from app.auth import get_current_user, get_admin_user

router = APIRouter()

class Plan(BaseModel):
    name: str
    credits: int
    validity_months: int
    price: float
    is_active: bool = True

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    credits: Optional[int] = None
    validity_months: Optional[int] = None
    price: Optional[float] = None
    is_active: Optional[bool] = None

@router.get("/", response_model=List[dict])
async def get_plans():
    """Get all active plans"""
    db = get_db()
    
    try:
        result = db.table("plans").select("*").eq("is_active", True).order("price").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch plans")

@router.get("/{plan_id}")
async def get_plan(plan_id: str):
    """Get specific plan"""
    db = get_db()
    
    try:
        result = db.table("plans").select("*").eq("id", plan_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Plan not found")
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch plan")

# Admin endpoints
@router.post("/admin/create", response_model=dict)
async def create_plan(plan: Plan, admin_user: dict = Depends(get_admin_user)):
    """Create new plan (admin only)"""
    db = get_db()
    
    try:
        result = db.table("plans").insert(plan.dict()).execute()
        return {"message": "Plan created successfully", "plan": result.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create plan")

@router.put("/admin/{plan_id}")
async def update_plan(plan_id: str, plan_data: PlanUpdate, admin_user: dict = Depends(get_admin_user)):
    """Update plan (admin only)"""
    db = get_db()
    
    # Filter out None values
    update_data = {k: v for k, v in plan_data.dict().items() if v is not None}
    
    try:
        result = db.table("plans").update(update_data).eq("id", plan_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        return {"message": "Plan updated successfully", "plan": result.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update plan")

@router.delete("/admin/{plan_id}")
async def delete_plan(plan_id: str, admin_user: dict = Depends(get_admin_user)):
    """Delete plan (admin only)"""
    db = get_db()
    
    try:
        result = db.table("plans").delete().eq("id", plan_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        return {"message": "Plan deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete plan")

@router.get("/admin/all")
async def get_all_plans(admin_user: dict = Depends(get_admin_user)):
    """Get all plans including inactive (admin only)"""
    db = get_db()
    
    try:
        result = db.table("plans").select("*").order("created_at", desc=True).execute()
        return {"plans": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch plans")
