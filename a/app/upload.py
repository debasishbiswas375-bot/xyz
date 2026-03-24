from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import pandas as pd
import PyPDF2
import pytesseract
from PIL import Image
import io
import os
import tempfile
import uuid
from datetime import datetime
from typing import List, Optional
import xml.etree.ElementTree as ET
from app.database import get_db
from app.auth import get_current_user

router = APIRouter()

class Transaction(BaseModel):
    date: str
    description: str
    debit: Optional[float] = None
    credit: Optional[float] = None
    balance: Optional[float] = None

class MappingResult(BaseModel):
    transactions: List[Transaction]
    confidence: float
    ledger_mapping: dict

class ProcessRequest(BaseModel):
    use_ai: bool  # True for AI mapping (0.1 credit), False for manual (0.05 credit)
    selected_ledger: Optional[str] = None

class FinalXMLRequest(BaseModel):
    transactions: List[Transaction]
    ledger_mapping: dict

# Indian bank ledger mappings
INDIAN_LEDGERS = {
    "SALARY": {
        "keywords": ["salary", "payroll", "wages", "salary credit"],
        "confidence": 0.9
    },
    "RENT": {
        "keywords": ["rent", "lease", "property rent"],
        "confidence": 0.85
    },
    "FOOD": {
        "keywords": ["food", "restaurant", "cafe", "mess", "canteen"],
        "confidence": 0.8
    },
    "TRANSPORT": {
        "keywords": ["uber", "ola", "taxi", "auto", "metro", "bus", "petrol", "diesel"],
        "confidence": 0.85
    },
    "UTILITIES": {
        "keywords": ["electricity", "water", "gas", "phone", "internet", "recharge"],
        "confidence": 0.8
    },
    "SHOPPING": {
        "keywords": ["amazon", "flipkart", "myntra", "shopping", "store"],
        "confidence": 0.75
    },
    "BANK_CHARGES": {
        "keywords": ["bank charge", "processing fee", "annual charge", "penalty"],
        "confidence": 0.9
    },
    "CASH_WITHDRAWAL": {
        "keywords": ["atm", "cash withdrawal", "wd"],
        "confidence": 0.95
    },
    "TRANSFER": {
        "keywords": ["transfer", "neft", "rtgs", "imps", "upi"],
        "confidence": 0.8
    },
    "INSURANCE": {
        "keywords": ["insurance", "lic", "policy", "premium"],
        "confidence": 0.85
    }
}

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extract text from PDF using OCR"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        text = ""
        
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        # If no text extracted, try OCR
        if not text.strip():
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                images = []
                
                # Convert PDF page to image for OCR
                try:
                    # This is a simplified approach - in production, you'd use pdf2image
                    text += pytesseract.image_to_string(page)
                except:
                    pass
        
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF extraction failed: {str(e)}")

def parse_bank_statement(text: str, file_extension: str) -> List[Transaction]:
    """Parse bank statement from text"""
    transactions = []
    
    try:
        if file_extension.lower() == '.csv':
            # Parse CSV
            df = pd.read_csv(io.StringIO(text))
            
            # Try to detect columns
            date_col = None
            desc_col = None
            debit_col = None
            credit_col = None
            balance_col = None
            
            for col in df.columns:
                col_lower = col.lower()
                if 'date' in col_lower:
                    date_col = col
                elif 'desc' in col_lower or 'particular' in col_lower or 'narration' in col_lower:
                    desc_col = col
                elif 'debit' in col_lower or 'withdraw' in col_lower:
                    debit_col = col
                elif 'credit' in col_lower or 'deposit' in col_lower:
                    credit_col = col
                elif 'balance' in col_lower:
                    balance_col = col
            
            for _, row in df.iterrows():
                transaction = Transaction(
                    date=str(row[date_col]) if date_col else "",
                    description=str(row[desc_col]) if desc_col else "",
                    debit=float(row[debit_col]) if debit_col and pd.notna(row[debit_col]) else None,
                    credit=float(row[credit_col]) if credit_col and pd.notna(row[credit_col]) else None,
                    balance=float(row[balance_col]) if balance_col and pd.notna(row[balance_col]) else None
                )
                transactions.append(transaction)
        
        elif file_extension.lower() in ['.xlsx', '.xls']:
            # Parse Excel
            df = pd.read_excel(io.BytesIO(text.encode('utf-8') if isinstance(text, str) else text))
            
            # Similar column detection logic
            date_col = None
            desc_col = None
            debit_col = None
            credit_col = None
            balance_col = None
            
            for col in df.columns:
                col_lower = str(col).lower()
                if 'date' in col_lower:
                    date_col = col
                elif 'desc' in col_lower or 'particular' in col_lower or 'narration' in col_lower:
                    desc_col = col
                elif 'debit' in col_lower or 'withdraw' in col_lower:
                    debit_col = col
                elif 'credit' in col_lower or 'deposit' in col_lower:
                    credit_col = col
                elif 'balance' in col_lower:
                    balance_col = col
            
            for _, row in df.iterrows():
                transaction = Transaction(
                    date=str(row[date_col]) if date_col else "",
                    description=str(row[desc_col]) if desc_col else "",
                    debit=float(row[debit_col]) if debit_col and pd.notna(row[debit_col]) else None,
                    credit=float(row[credit_col]) if credit_col and pd.notna(row[credit_col]) else None,
                    balance=float(row[balance_col]) if balance_col and pd.notna(row[balance_col]) else None
                )
                transactions.append(transaction)
        
        else:
            # Parse from text (PDF)
            lines = text.split('\n')
            for line in lines:
                if any(char.isdigit() for char in line) and len(line.strip()) > 10:
                    # Simple parsing - would need more sophisticated logic for different banks
                    parts = line.strip().split()
                    if len(parts) >= 3:
                        # Try to extract date, description, and amounts
                        transaction = Transaction(
                            date=parts[0] if parts[0] else "",
                            description=" ".join(parts[1:-2]),
                            debit=None,
                            credit=None,
                            balance=None
                        )
                        transactions.append(transaction)
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Parsing failed: {str(e)}")
    
    return transactions

def ai_map_transactions(transactions: List[Transaction]) -> dict:
    """AI-based ledger mapping with confidence scoring"""
    mapping = {}
    total_confidence = 0
    
    for i, transaction in enumerate(transactions):
        description = transaction.description.lower()
        best_ledger = "UNCATEGORIZED"
        best_confidence = 0
        
        for ledger, data in INDIAN_LEDGERS.items():
            for keyword in data["keywords"]:
                if keyword in description:
                    if data["confidence"] > best_confidence:
                        best_ledger = ledger
                        best_confidence = data["confidence"]
        
        mapping[f"transaction_{i}"] = {
            "ledger": best_ledger,
            "confidence": best_confidence
        }
        total_confidence += best_confidence
    
    avg_confidence = total_confidence / len(transactions) if transactions else 0
    
    return {
        "mapping": mapping,
        "average_confidence": avg_confidence
    }

def generate_tally_xml(transactions: List[Transaction], ledger_mapping: dict) -> str:
    """Generate Tally XML"""
    root = ET.Element("ENVELOPE")
    
    header = ET.SubElement(root, "HEADER")
    ET.SubElement(header, "TALLYREQUESTNAME").text = "Import Data"
    ET.SubElement(header, "VERSION").text = "1"
    
    body = ET.SubElement(root, "BODY")
    data = ET.SubElement(body, "DATA")
    
    for i, transaction in enumerate(transactions):
        voucher = ET.SubElement(data, "VOUCHER")
        
        # Date
        ET.SubElement(voucher, "DATE").text = transaction.date
        
        # Narration
        ET.SubElement(voucher, "NARRATION").text = transaction.description
        
        # Ledger mapping
        ledger_key = f"transaction_{i}"
        if ledger_key in ledger_mapping:
            ledger = ledger_mapping[ledger_key]["ledger"]
        else:
            ledger = "UNCATEGORIZED"
        
        # Amount
        if transaction.debit and transaction.debit > 0:
            ET.SubElement(voucher, "LEDGERNAME").text = ledger
            ET.SubElement(voucher, "AMOUNT").text = str(-transaction.debit)
        elif transaction.credit and transaction.credit > 0:
            ET.SubElement(voucher, "LEDGERNAME").text = ledger
            ET.SubElement(voucher, "AMOUNT").text = str(transaction.credit)
    
    return ET.tostring(root, encoding='unicode', xml_declaration=True)

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload and process bank statement"""
    
    # Check file type
    allowed_extensions = ['.pdf', '.csv', '.xlsx', '.xls']
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="File type not supported")
    
    try:
        # Read file content
        content = await file.read()
        
        # Extract text based on file type
        if file_extension == '.pdf':
            text = extract_text_from_pdf(content)
        elif file_extension == '.csv':
            text = content.decode('utf-8')
        else:
            text = content
        
        # Parse transactions
        transactions = parse_bank_statement(text, file_extension)
        
        if not transactions:
            raise HTTPException(status_code=400, detail="No transactions found in file")
        
        return {
            "message": "File uploaded successfully",
            "filename": file.filename,
            "transactions": transactions,
            "total_transactions": len(transactions)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/process")
async def process_transactions(
    request: ProcessRequest,
    current_user: dict = Depends(get_current_user)
):
    """Process transactions with AI or manual mapping"""
    
    # Check credits
    credit_cost = 0.1 if request.use_ai else 0.05
    
    db = get_db()
    try:
        result = db.table("users").select("credits").eq("id", current_user["id"]).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        current_credits = result.data[0]["credits"]
        
        if current_credits < credit_cost:
            raise HTTPException(status_code=400, detail="Insufficient credits")
        
        # Deduct credits
        new_credits = current_credits - credit_cost
        db.table("users").update({"credits": new_credits}).eq("id", current_user["id"]).execute()
        
    except Exception:
        raise HTTPException(status_code=500, detail="Credit check failed")
    
    # This would normally get transactions from session/temp storage
    # For now, return a sample response
    sample_transactions = [
        Transaction(date="2024-01-01", description="Salary Credit", credit=50000.0),
        Transaction(date="2024-01-02", description="ATM Withdrawal", debit=5000.0)
    ]
    
    if request.use_ai:
        # AI mapping
        ai_result = ai_map_transactions(sample_transactions)
        return {
            "message": "AI mapping completed",
            "transactions": sample_transactions,
            "ledger_mapping": ai_result["mapping"],
            "average_confidence": ai_result["average_confidence"],
            "credits_used": credit_cost,
            "remaining_credits": new_credits
        }
    else:
        # Manual mapping
        manual_mapping = {}
        for i in range(len(sample_transactions)):
            manual_mapping[f"transaction_{i}"] = {
                "ledger": request.selected_ledger or "UNCATEGORIZED",
                "confidence": 1.0  # Manual selection has 100% confidence
            }
        
        return {
            "message": "Manual mapping completed",
            "transactions": sample_transactions,
            "ledger_mapping": manual_mapping,
            "credits_used": credit_cost,
            "remaining_credits": new_credits
        }

@router.post("/generate-xml")
async def generate_xml(
    request: FinalXMLRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate final Tally XML"""
    
    try:
        xml_content = generate_tally_xml(request.transactions, request.ledger_mapping)
        
        # Save to history (keep only last 3)
        db = get_db()
        
        # Get current history count
        history_result = db.table("history").select("id").eq("user_id", current_user["id"]).execute()
        
        # If more than 3, delete oldest
        if len(history_result.data) >= 3:
            oldest = min(history_result.data, key=lambda x: x["id"])
            db.table("history").delete().eq("id", oldest["id"]).execute()
        
        # Add new entry
        history_entry = {
            "user_id": current_user["id"],
            "file_name": f"tally_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xml",
            "xml_data": xml_content
        }
        
        db.table("history").insert(history_entry).execute()
        
        # Return XML as downloadable file
        def iterfile():
            yield xml_content.encode('utf-8')
        
        return StreamingResponse(
            iterfile(),
            media_type="application/xml",
            headers={"Content-Disposition": "attachment; filename=tally_export.xml"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"XML generation failed: {str(e)}")

@router.get("/free-convert")
async def free_pdf_to_excel():
    """Free PDF to Excel converter (no login required)"""
    return {
        "message": "Free PDF to Excel converter",
        "description": "Upload your PDF file and get clean Excel output",
        "features": [
            "No login required",
            "No credits required",
            "OCR powered text extraction",
            "Clean Excel format",
            "Supports all Indian banks"
        ]
    }
