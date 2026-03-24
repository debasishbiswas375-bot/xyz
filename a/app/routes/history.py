from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import HistoryRecord, XMLGenerationResponse
from app.services.xml_generator import XMLGenerator
from app.services.credit_service import CreditService
from app.db.database import get_supabase
from app.routes.auth import get_current_user_from_token
from typing import List, Dict, Any
import os
from datetime import datetime

router = APIRouter()

@router.post("/generate-xml", response_model=XMLGenerationResponse)
async def generate_xml(
    transactions: List[Dict[str, Any]],
    current_user: Dict[str, Any] = Depends(get_current_user_from_token)
):
    """Generate XML from transactions"""
    try:
        # Convert dict transactions to Transaction objects
        from app.models.schemas import Transaction
        transaction_objects = [Transaction(**t) for t in transactions]
        
        # Check credits
        credit_service = CreditService()
        credit_check = await credit_service.check_credits(current_user['id'], len(transaction_objects))
        
        if "error" in credit_check:
            raise HTTPException(status_code=400, detail=credit_check["error"])
        
        if not credit_check["can_generate"]:
            return XMLGenerationResponse(
                success=False,
                credits_used=0,
                remaining_credits=credit_check["available_credits"],
                message=f"Insufficient credits. Required: {credit_check['required_credits']}, Available: {credit_check['available_credits']}"
            )
        
        # Generate XML
        xml_generator = XMLGenerator()
        xml_content = xml_generator.generate_xml(transaction_objects)
        
        # Save XML file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"xml_{current_user['id']}_{timestamp}.xml"
        filepath = os.path.join("static", "xml", filename)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        # Save file
        xml_generator.save_xml(xml_content, filepath)
        
        # Deduct credits
        credit_deduction = await credit_service.deduct_credits(current_user['id'], len(transaction_objects))
        
        if "error" in credit_deduction:
            raise HTTPException(status_code=400, detail=credit_deduction["error"])
        
        # Save to history
        supabase = get_supabase()
        history_record = supabase.table('history').insert({
            'user_id': current_user['id'],
            'voucher_count': len(transaction_objects),
            'credits_used': credit_check['required_credits'],
            'xml_path': filepath,
            'timestamp': datetime.now().isoformat()
        }).execute()
        
        return XMLGenerationResponse(
            success=True,
            xml_content=xml_content,
            credits_used=credit_check['required_credits'],
            remaining_credits=credit_deduction['remaining_credits'],
            message=f"XML generated successfully with {len(transaction_objects)} vouchers"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[HistoryRecord])
async def get_history(current_user: Dict[str, Any] = Depends(get_current_user_from_token)):
    """Get user's conversion history"""
    try:
        supabase = get_supabase()
        response = supabase.table('history').select('*').eq('user_id', current_user['id']).order('timestamp', desc=True).limit(10).execute()
        
        history_records = []
        for record in response.data:
            history_records.append(HistoryRecord(**record))
        
        return history_records
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{history_id}")
async def download_xml(
    history_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user_from_token)
):
    """Download XML file from history"""
    try:
        supabase = get_supabase()
        response = supabase.table('history').select('*').eq('id', history_id).eq('user_id', current_user['id']).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="History record not found")
        
        file_path = response.data[0]['xml_path']
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="XML file not found")
        
        from fastapi.responses import FileResponse
        return FileResponse(
            file_path,
            media_type='application/xml',
            filename=f"accountesy_export_{history_id}.xml"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
