from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class User(BaseModel):
    id: str
    email: str
    credits: int = 0
    created_at: datetime

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Transaction(BaseModel):
    id: int
    date: str
    narration: str
    amount: float
    ledger: str = ""
    confidence: int = 50
    status: str = "pending"

class ConversionRequest(BaseModel):
    file_type: str
    user_id: str

class ConversionResponse(BaseModel):
    success: bool
    transactions: List[Transaction]
    message: Optional[str] = None

class PreviewRequest(BaseModel):
    transactions: List[Transaction]
    user_id: str

class XMLGenerationRequest(BaseModel):
    transactions: List[Transaction]
    user_id: str

class XMLGenerationResponse(BaseModel):
    success: bool
    xml_content: Optional[str] = None
    credits_used: int
    remaining_credits: int
    message: Optional[str] = None

class HistoryRecord(BaseModel):
    id: str
    user_id: str
    voucher_count: int
    credits_used: int
    xml_path: str
    timestamp: datetime

class DownloadFile(BaseModel):
    id: str
    name: str
    description: str
    file_url: str
    category: str
    created_at: datetime

class AIMemory(BaseModel):
    id: str
    user_id: str
    narration: str
    ledger: str
    confidence: int
    created_at: datetime
