from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from app.models.schemas import DownloadFile
from app.routes.auth import get_current_user_from_token
from app.db.database import get_supabase
from typing import List, Dict, Any
import os
import uuid
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[DownloadFile])
async def get_downloads(current_user: Dict[str, Any] = Depends(get_current_user_from_token)):
    """Get all downloadable files"""
    try:
        supabase = get_supabase()
        response = supabase.table('downloads').select('*').order('created_at', desc=True).execute()
        
        download_files = []
        for file_data in response.data:
            download_files.append(DownloadFile(**file_data))
        
        return download_files
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/upload")
async def upload_download_file(
    name: str,
    description: str,
    category: str,
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(get_current_user_from_token)
):
    """Upload new downloadable file (admin only)"""
    try:
        # Check if user is admin (simplified)
        if current_user['id'] != 'admin':
            raise HTTPException(status_code=403, detail="Admin access required")
        
        # Save file
        file_id = str(uuid.uuid4())
        file_extension = file.filename.split('.')[-1].lower()
        filename = f"{file_id}.{file_extension}"
        filepath = os.path.join("static", "downloads", filename)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        # Save file
        with open(filepath, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Save to database
        supabase = get_supabase()
        supabase.table('downloads').insert({
            'id': file_id,
            'name': name,
            'description': description,
            'file_url': f"/static/downloads/{filename}",
            'category': category,
            'created_at': datetime.now().isoformat()
        }).execute()
        
        return {"message": "File uploaded successfully", "file_id": file_id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{file_id}")
async def download_file(
    file_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user_from_token)
):
    """Download file"""
    try:
        supabase = get_supabase()
        response = supabase.table('downloads').select('*').eq('id', file_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="File not found")
        
        file_data = response.data[0]
        file_path = file_data['file_url'].replace('/static/', 'static/')
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found on disk")
        
        from fastapi.responses import FileResponse
        return FileResponse(
            file_path,
            filename=file_data['name']
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/admin/{file_id}")
async def delete_download_file(
    file_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user_from_token)
):
    """Delete downloadable file (admin only)"""
    try:
        if current_user['id'] != 'admin':
            raise HTTPException(status_code=403, detail="Admin access required")
        
        supabase = get_supabase()
        
        # Get file info
        response = supabase.table('downloads').select('*').eq('id', file_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="File not found")
        
        file_data = response.data[0]
        file_path = file_data['file_url'].replace('/static/', 'static/')
        
        # Delete file from disk
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Delete from database
        supabase.table('downloads').delete().eq('id', file_id).execute()
        
        return {"message": "File deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
