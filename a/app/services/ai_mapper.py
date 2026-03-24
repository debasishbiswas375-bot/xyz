from typing import List, Dict, Any, Optional
from app.models.schemas import Transaction, AIMemory
from app.db.database import get_supabase
import re

class AIMapper:
    def __init__(self):
        self.default_ledgers = [
            "Bank Charges", "Cash", "Bank Account", "Sales", "Purchases",
            "Rent Expense", "Salary Expense", "Office Expenses", "Utilities",
            "Tax Expense", "Interest Expense", "Uncategorized"
        ]

    async def map_transactions(self, transactions: List[Transaction], user_id: str) -> List[Transaction]:
        """Map transactions to ledgers using AI and rules"""
        mapped_transactions = []
        
        # Get AI memory for user
        ai_memory = await self._get_ai_memory(user_id)
        
        for transaction in transactions:
            mapped_transaction = await self._map_single_transaction(
                transaction, ai_memory
            )
            mapped_transactions.append(mapped_transaction)
        
        return mapped_transactions

    async def _map_single_transaction(self, transaction: Transaction, ai_memory: List[AIMemory]) -> Transaction:
        """Map single transaction to ledger"""
        narration = transaction.narration.lower()
        
        # 1. Check AI memory (highest priority)
        for memory in ai_memory:
            if self._is_match(narration, memory.narration):
                confidence = self._calculate_confidence(narration, memory.narration)
                transaction.ledger = memory.ledger
                transaction.confidence = confidence
                transaction.status = self._get_status_from_confidence(confidence)
                return transaction
        
        # 2. Rule engine
        ledger, confidence = self._apply_rules(narration)
        transaction.ledger = ledger
        transaction.confidence = confidence
        transaction.status = self._get_status_from_confidence(confidence)
        
        return transaction

    async def _get_ai_memory(self, user_id: str) -> List[AIMemory]:
        """Get AI memory for user"""
        try:
            supabase = get_supabase()
            response = supabase.table('ai_memory').select('*').eq('user_id', user_id).execute()
            
            memories = []
            for item in response.data:
                memories.append(AIMemory(**item))
            
            return memories
        except Exception as e:
            print(f"Error getting AI memory: {e}")
            return []

    def _is_match(self, narration: str, memory_narration: str) -> bool:
        """Check if narration matches memory"""
        # Case insensitive partial match
        return memory_narration.lower() in narration or narration in memory_narration.lower()

    def _calculate_confidence(self, narration: str, memory_narration: str) -> int:
        """Calculate confidence score"""
        if narration.lower() == memory_narration.lower():
            return 95  # Exact match
        elif memory_narration.lower() in narration or narration in memory_narration.lower():
            return 80  # Partial match
        else:
            return 50  # Unknown

    def _apply_rules(self, narration: str) -> tuple[str, int]:
        """Apply rule engine for mapping"""
        rules = {
            # Bank related
            'bank': ('Bank Account', 85),
            'atm': ('Bank Account', 85),
            'cash': ('Cash', 85),
            'withdraw': ('Cash', 80),
            'deposit': ('Bank Account', 80),
            
            # Sales
            'sale': ('Sales', 85),
            'invoice': ('Sales', 80),
            'revenue': ('Sales', 85),
            'income': ('Sales', 80),
            
            # Purchases
            'purchase': ('Purchases', 85),
            'buy': ('Purchases', 80),
            'vendor': ('Purchases', 75),
            'supplier': ('Purchases', 75),
            
            # Expenses
            'rent': ('Rent Expense', 90),
            'salary': ('Salary Expense', 90),
            'wage': ('Salary Expense', 85),
            'office': ('Office Expenses', 75),
            'utility': ('Utilities', 80),
            'electric': ('Utilities', 85),
            'water': ('Utilities', 85),
            'phone': ('Utilities', 75),
            'internet': ('Utilities', 75),
            
            # Taxes
            'tax': ('Tax Expense', 85),
            'gst': ('Tax Expense', 85),
            'vat': ('Tax Expense', 85),
            
            # Interest
            'interest': ('Interest Expense', 85),
            
            # Charges
            'charge': ('Bank Charges', 80),
            'fee': ('Bank Charges', 75),
            'commission': ('Bank Charges', 75),
        }
        
        # Check rules
        for keyword, (ledger, confidence) in rules.items():
            if keyword in narration:
                return ledger, confidence
        
        # Default
        return "Uncategorized", 50

    def _get_status_from_confidence(self, confidence: int) -> str:
        """Get status based on confidence"""
        if confidence >= 75:
            return "confirmed"
        elif confidence >= 60:
            return "review"
        else:
            return "pending"

    async def learn_from_user_edit(self, user_id: str, narration: str, ledger: str):
        """Learn from user edits"""
        try:
            supabase = get_supabase()
            
            # Check if this mapping already exists
            existing = supabase.table('ai_memory').select('*').eq('user_id', user_id).eq('narration', narration.lower()).execute()
            
            if existing.data:
                # Update existing memory with higher confidence
                new_confidence = min(existing.data[0]['confidence'] + 10, 95)
                supabase.table('ai_memory').update({
                    'ledger': ledger,
                    'confidence': new_confidence
                }).eq('id', existing.data[0]['id']).execute()
            else:
                # Create new memory
                supabase.table('ai_memory').insert({
                    'user_id': user_id,
                    'narration': narration.lower(),
                    'ledger': ledger,
                    'confidence': 90
                }).execute()
            
            print(f"Learned: {narration} -> {ledger}")
        except Exception as e:
            print(f"Error learning from user edit: {e}")

    def get_confidence_color(self, confidence: int) -> str:
        """Get color based on confidence"""
        if confidence >= 75:
            return "green"
        elif confidence >= 60:
            return "orange"
        else:
            return "red"
