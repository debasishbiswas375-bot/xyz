import pandas as pd
import pdfplumber
import io
import re
from typing import List, Dict, Any
from app.models.schemas import Transaction

class FileConverter:
    def __init__(self):
        self.column_mapping = {
            'date': ['date', 'transaction_date', 'voucher_date', 'entry_date'],
            'narration': ['narration', 'description', 'details', 'particulars', 'remarks'],
            'amount': ['amount', 'debit', 'credit', 'value', 'total']
        }

    def convert_file(self, file_content: bytes, file_type: str) -> List[Transaction]:
        """Convert uploaded file to normalized transactions"""
        if file_type == 'csv':
            return self._convert_csv(file_content)
        elif file_type == 'excel':
            return self._convert_excel(file_content)
        elif file_type == 'pdf':
            return self._convert_pdf(file_content)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")

    def _convert_csv(self, file_content: bytes) -> List[Transaction]:
        df = pd.read_csv(io.BytesIO(file_content))
        return self._normalize_dataframe(df)

    def _convert_excel(self, file_content: bytes) -> List[Transaction]:
        df = pd.read_excel(io.BytesIO(file_content))
        return self._normalize_dataframe(df)

    def _convert_pdf(self, file_content: bytes) -> List[Transaction]:
        all_tables = []
        
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    if table:
                        df = pd.DataFrame(table[1:], columns=table[0])
                        all_tables.append(df)
        
        if all_tables:
            combined_df = pd.concat(all_tables, ignore_index=True)
            return self._normalize_dataframe(combined_df)
        else:
            return []

    def _normalize_dataframe(self, df: pd.DataFrame) -> List[Transaction]:
        """Normalize dataframe to transaction format"""
        transactions = []
        
        # Clean column names
        df.columns = [str(col).strip().lower().replace(' ', '_') for col in df.columns]
        
        # Detect columns
        date_col = self._detect_column(df, 'date')
        narration_col = self._detect_column(df, 'narration')
        amount_col = self._detect_column(df, 'amount')
        
        # Process each row
        for idx, row in df.iterrows():
            try:
                # Skip empty rows
                if row.isna().all():
                    continue
                
                # Extract and clean data
                date_str = self._clean_date(str(row.get(date_col, '')) if date_col else '')
                narration = self._clean_narration(str(row.get(narration_col, '')) if narration_col else '')
                amount = self._clean_amount(str(row.get(amount_col, '')) if amount_col else '')
                
                if date_str and narration and amount > 0:
                    transaction = Transaction(
                        id=idx + 1,
                        date=date_str,
                        narration=narration,
                        amount=amount,
                        ledger="",
                        confidence=50,
                        status="pending"
                    )
                    transactions.append(transaction)
            except Exception as e:
                print(f"Error processing row {idx}: {e}")
                continue
        
        return transactions

    def _detect_column(self, df: pd.DataFrame, target_type: str) -> str:
        """Detect column for target type"""
        possible_columns = self.column_mapping.get(target_type, [])
        
        for col in df.columns:
            if any(keyword in col.lower() for keyword in possible_columns):
                return col
        
        # Fallback to column index
        if target_type == 'date' and len(df.columns) > 0:
            return df.columns[0]
        elif target_type == 'narration' and len(df.columns) > 1:
            return df.columns[1]
        elif target_type == 'amount' and len(df.columns) > 2:
            return df.columns[2]
        
        return None

    def _clean_date(self, date_str: str) -> str:
        """Clean and normalize date"""
        if not date_str or date_str.lower() in ['nan', 'none', '']:
            return ''
        
        # Remove special characters
        date_str = re.sub(r'[^\d\/\-\.]', '', date_str)
        
        try:
            # Try different date formats
            for fmt in ['%d/%m/%Y', '%d-%m-%Y', '%d.%m.%Y', '%Y-%m-%d', '%Y/%m/%d']:
                try:
                    date_obj = pd.to_datetime(date_str, format=fmt)
                    return date_obj.strftime('%Y-%m-%d')
                except:
                    continue
            
            # Let pandas try auto-detection
            date_obj = pd.to_datetime(date_str, errors='coerce')
            if pd.notna(date_obj):
                return date_obj.strftime('%Y-%m-%d')
        except:
            pass
        
        return ''

    def _clean_narration(self, narration: str) -> str:
        """Clean narration text"""
        if not narration or narration.lower() in ['nan', 'none', '']:
            return ''
        
        # Remove extra whitespace and special characters
        narration = re.sub(r'\s+', ' ', narration.strip())
        narration = re.sub(r'[^\w\s\-\.]', '', narration)
        
        return narration.lower()

    def _clean_amount(self, amount_str: str) -> float:
        """Clean and convert amount to float"""
        if not amount_str or amount_str.lower() in ['nan', 'none', '']:
            return 0.0
        
        # Remove currency symbols and commas
        amount_str = re.sub(r'[^\d\.\-]', '', amount_str)
        
        try:
            amount = float(amount_str)
            return abs(amount)  # Return absolute value
        except:
            return 0.0
