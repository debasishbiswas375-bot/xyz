from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from app.services.file_converter import FileConverter
import pandas as pd
import os
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/convert")
async def convert_file(file: UploadFile = File(...), conversion_type: str = "pdf-to-excel"):
    """Enhanced file converter with multiple format support"""
    try:
        # Read file content
        file_content = await file.read()
        
        # Determine file type and conversion
        converter = FileConverter()
        
        if conversion_type == 'pdf-to-excel':
            transactions = converter.convert_file(file_content, 'pdf')
            if not transactions:
                raise HTTPException(status_code=400, detail="No tables found in PDF")
            
            # Convert to DataFrame and then to Excel
            data = []
            for t in transactions:
                data.append({
                    'Date': t.date,
                    'Description': t.narration,
                    'Amount': t.amount,
                    'Ledger': t.ledger or 'Uncategorized'
                })
            
            df = pd.DataFrame(data)
            
            # Save as Excel
            file_id = str(uuid.uuid4())
            filename = f"converted_{file_id}.xlsx"
            filepath = os.path.join("static", "temp", filename)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            df.to_excel(filepath, index=False)
            
            return FileResponse(
                filepath,
                media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                filename=f"converted_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            )
            
        elif conversion_type == 'pdf-to-csv':
            transactions = converter.convert_file(file_content, 'pdf')
            if not transactions:
                raise HTTPException(status_code=400, detail="No tables found in PDF")
            
            # Convert to CSV
            data = []
            for t in transactions:
                data.append({
                    'Date': t.date,
                    'Description': t.narration,
                    'Amount': t.amount,
                    'Ledger': t.ledger or 'Uncategorized'
                })
            
            df = pd.DataFrame(data)
            
            # Save as CSV
            file_id = str(uuid.uuid4())
            filename = f"converted_{file_id}.csv"
            filepath = os.path.join("static", "temp", filename)
            
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            df.to_csv(filepath, index=False)
            
            return FileResponse(
                filepath,
                media_type='text/csv',
                filename=f"converted_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            )
            
        elif conversion_type == 'excel-to-csv':
            transactions = converter.convert_file(file_content, 'excel')
            
            # Convert to CSV
            data = []
            for t in transactions:
                data.append({
                    'Date': t.date,
                    'Description': t.narration,
                    'Amount': t.amount,
                    'Ledger': t.ledger or 'Uncategorized'
                })
            
            df = pd.DataFrame(data)
            
            file_id = str(uuid.uuid4())
            filename = f"converted_{file_id}.csv"
            filepath = os.path.join("static", "temp", filename)
            
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            df.to_csv(filepath, index=False)
            
            return FileResponse(
                filepath,
                media_type='text/csv',
                filename=f"converted_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            )
            
        elif conversion_type == 'csv-to-excel':
            transactions = converter.convert_file(file_content, 'csv')
            
            # Convert to Excel
            data = []
            for t in transactions:
                data.append({
                    'Date': t.date,
                    'Description': t.narration,
                    'Amount': t.amount,
                    'Ledger': t.ledger or 'Uncategorized'
                })
            
            df = pd.DataFrame(data)
            
            file_id = str(uuid.uuid4())
            filename = f"converted_{file_id}.xlsx"
            filepath = os.path.join("static", "temp", filename)
            
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            df.to_excel(filepath, index=False)
            
            return FileResponse(
                filepath,
                media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                filename=f"converted_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            )
            
        else:
            raise HTTPException(status_code=400, detail="Unsupported conversion type")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
