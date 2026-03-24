from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from app.models.schemas import ConversionResponse, Transaction
from app.services.file_converter import FileConverter
from app.services.ai_mapper import AIMapper
from app.routes.auth import get_current_user_from_token
from typing import List, Dict, Any

router = APIRouter()

@router.post("/upload", response_model=ConversionResponse)
async def upload_and_convert(
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(get_current_user_from_token)
):
    """Upload and convert file to transactions"""
    try:
        # Validate file type
        allowed_types = ['csv', 'xlsx', 'pdf']
        file_extension = file.filename.split('.')[-1].lower()
        
        if file_extension not in allowed_types:
            raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed: {allowed_types}")
        
        # Read file content
        file_content = await file.read()
        
        # Convert file
        converter = FileConverter()
        
        if file_extension == 'csv':
            transactions = converter.convert_file(file_content, 'csv')
        elif file_extension == 'xlsx':
            transactions = converter.convert_file(file_content, 'excel')
        elif file_extension == 'pdf':
            transactions = converter.convert_file(file_content, 'pdf')
        
        # Map transactions using AI
        ai_mapper = AIMapper()
        mapped_transactions = await ai_mapper.map_transactions(transactions, current_user['id'])
        
        return ConversionResponse(
            success=True,
            transactions=mapped_transactions,
            message=f"Successfully converted {len(mapped_transactions)} transactions"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/preview", response_model=List[Transaction])
async def preview_transactions(
    transactions: List[Transaction],
    current_user: Dict[str, Any] = Depends(get_current_user_from_token)
):
    """Preview transactions with AI mapping"""
    try:
        ai_mapper = AIMapper()
        mapped_transactions = await ai_mapper.map_transactions(transactions, current_user['id'])
        return mapped_transactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
