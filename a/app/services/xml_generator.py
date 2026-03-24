from typing import List
from app.models.schemas import Transaction
import xml.etree.ElementTree as ET
from xml.dom import minidom

class XMLGenerator:
    def __init__(self):
        pass

    def generate_xml(self, transactions: List[Transaction]) -> str:
        """Generate XML from transactions"""
        root = ET.Element("VOUCHERS")
        
        for transaction in transactions:
            voucher = ET.SubElement(root, "VOUCHER")
            
            # Date
            date_elem = ET.SubElement(voucher, "DATE")
            date_elem.text = self._format_date(transaction.date)
            
            # Narration
            narration_elem = ET.SubElement(voucher, "NARRATION")
            narration_elem.text = transaction.narration
            
            # Ledger Name
            ledger_elem = ET.SubElement(voucher, "LEDGERNAME")
            ledger_elem.text = transaction.ledger
            
            # Amount
            amount_elem = ET.SubElement(voucher, "AMOUNT")
            amount_elem.text = str(transaction.amount)
        
        # Pretty print XML
        rough_string = ET.tostring(root, 'utf-8')
        reparsed = minidom.parseString(rough_string)
        
        return reparsed.toprettyxml(indent="  ")

    def _format_date(self, date_str: str) -> str:
        """Convert YYYY-MM-DD to YYYYMMDD"""
        try:
            return date_str.replace('-', '')
        except:
            return date_str

    def save_xml(self, xml_content: str, file_path: str) -> bool:
        """Save XML to file"""
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(xml_content)
            return True
        except Exception as e:
            print(f"Error saving XML: {e}")
            return False
