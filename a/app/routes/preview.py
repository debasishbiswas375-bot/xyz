from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import Transaction, PreviewRequest
from app.services.ai_mapper import AIMapper
from app.routes.auth import get_current_user_from_token
from typing import List, Dict, Any

router = APIRouter()

@router.post("/edit")
async def edit_transaction(
    transaction_id: int,
    new_ledger: str,
    transactions: List[Transaction],
    current_user: Dict[str, Any] = Depends(get_current_user_from_token)
):
    """Edit transaction ledger and learn from user input"""
    try:
        # Find and update the transaction
        updated_transaction = None
        for transaction in transactions:
            if transaction.id == transaction_id:
                old_ledger = transaction.ledger
                transaction.ledger = new_ledger
                transaction.confidence = 95  # User edits have highest confidence
                transaction.status = "confirmed"
                updated_transaction = transaction
                break
        
        if not updated_transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        # Learn from user edit
        ai_mapper = AIMapper()
        await ai_mapper.learn_from_user_edit(
            current_user['id'],
            updated_transaction.narration,
            new_ledger
        )
        
        return {
            "success": True,
            "transaction": updated_transaction,
            "message": f"Updated transaction {transaction_id} from '{old_ledger}' to '{new_ledger}'"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/bulk-update")
async def bulk_update_ledgers(
    transaction_ids: List[int],
    new_ledger: str,
    transactions: List[Transaction],
    current_user: Dict[str, Any] = Depends(get_current_user_from_token)
):
    """Bulk update multiple transactions"""
    try:
        updated_count = 0
        ai_mapper = AIMapper()
        
        for transaction in transactions:
            if transaction.id in transaction_ids:
                old_ledger = transaction.ledger
                transaction.ledger = new_ledger
                transaction.confidence = 95
                transaction.status = "confirmed"
                updated_count += 1
                
                # Learn from each edit
                await ai_mapper.learn_from_user_edit(
                    current_user['id'],
                    transaction.narration,
                    new_ledger
                )
        
        return {
            "success": True,
            "updated_count": updated_count,
            "message": f"Updated {updated_count} transactions to '{new_ledger}'"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/filter")
async def filter_transactions(
    filter_type: str,
    transactions: List[Transaction],
    current_user: Dict[str, Any] = Depends(get_current_user_from_token)
):
    """Filter transactions by confidence level"""
    try:
        if filter_type == "all":
            return transactions
        elif filter_type == "green":
            return [t for t in transactions if t.confidence >= 75]
        elif filter_type == "orange":
            return [t for t in transactions if 60 <= t.confidence < 75]
        elif filter_type == "red":
            return [t for t in transactions if t.confidence < 60]
        else:
            raise HTTPException(status_code=400, detail="Invalid filter type")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
