from typing import Dict, Any
from app.db.database import get_supabase

class CreditService:
    def __init__(self):
        self.credits_per_voucher = 0.1

    async def check_credits(self, user_id: str, voucher_count: int) -> Dict[str, Any]:
        """Check if user has sufficient credits"""
        try:
            supabase = get_supabase()
            
            # Get user credits
            response = supabase.table('users').select('credits').eq('id', user_id).execute()
            
            if not response.data:
                return {"error": "User not found"}
            
            available_credits = response.data[0]['credits']
            required_credits = voucher_count * self.credits_per_voucher
            remaining_credits = available_credits - required_credits
            can_generate = remaining_credits >= 0
            
            return {
                "available_credits": available_credits,
                "required_credits": required_credits,
                "remaining_credits": remaining_credits,
                "can_generate": can_generate,
                "voucher_count": voucher_count
            }
        except Exception as e:
            print(f"Error checking credits: {e}")
            return {"error": str(e)}

    async def deduct_credits(self, user_id: str, voucher_count: int) -> Dict[str, Any]:
        """Deduct credits from user account"""
        try:
            supabase = get_supabase()
            
            # Get current credits
            response = supabase.table('users').select('credits').eq('id', user_id).execute()
            
            if not response.data:
                return {"error": "User not found"}
            
            current_credits = response.data[0]['credits']
            credits_to_deduct = voucher_count * self.credits_per_voucher
            
            if current_credits < credits_to_deduct:
                return {"error": "Insufficient credits"}
            
            # Deduct credits
            new_credits = current_credits - credits_to_deduct
            supabase.table('users').update({'credits': new_credits}).eq('id', user_id).execute()
            
            return {
                "success": True,
                "credits_deducted": credits_to_deduct,
                "remaining_credits": new_credits
            }
        except Exception as e:
            print(f"Error deducting credits: {e}")
            return {"error": str(e)}

    async def add_credits(self, user_id: str, credits: float) -> Dict[str, Any]:
        """Add credits to user account"""
        try:
            supabase = get_supabase()
            
            # Get current credits
            response = supabase.table('users').select('credits').eq('id', user_id).execute()
            
            if not response.data:
                return {"error": "User not found"}
            
            current_credits = response.data[0]['credits']
            new_credits = current_credits + credits
            
            # Update credits
            supabase.table('users').update({'credits': new_credits}).eq('id', user_id).execute()
            
            return {
                "success": True,
                "credits_added": credits,
                "new_total": new_credits
            }
        except Exception as e:
            print(f"Error adding credits: {e}")
            return {"error": str(e)}
