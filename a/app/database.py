import os
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext
import bcrypt

load_dotenv()

# Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def init_db():
    """Initialize database tables and default data"""
    try:
        # Create tables if they don't exist
        await create_tables()
        
        # Create default admin user
        await create_default_admin()
        
        # Create default plan
        await create_default_plan()
        
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization error: {e}")

async def create_tables():
    """Create database tables"""
    # Users table
    users_sql = """
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        credits INTEGER DEFAULT 0,
        role VARCHAR(20) DEFAULT 'user',
        active_plan TEXT DEFAULT 'free',
        valid_till TIMESTAMP DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    
    # Plans table
    plans_sql = """
    CREATE TABLE IF NOT EXISTS plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        credits INTEGER NOT NULL,
        validity_months INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    
    # History table
    history_sql = """
    CREATE TABLE IF NOT EXISTS history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        xml_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    
    # Notifications table
    notifications_sql = """
    CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        read BOOLEAN DEFAULT false
    );
    """
    
    # Disable RLS for simplicity (or create proper policies)
    disable_rls_sql = """
    ALTER TABLE users DISABLE ROW LEVEL SECURITY;
    ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
    ALTER TABLE history DISABLE ROW LEVEL SECURITY;
    ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
    """
    
    try:
        supabase.rpc('exec_sql', {'sql': users_sql}).execute()
        supabase.rpc('exec_sql', {'sql': plans_sql}).execute()
        supabase.rpc('exec_sql', {'sql': history_sql}).execute()
        supabase.rpc('exec_sql', {'sql': notifications_sql}).execute()
        supabase.rpc('exec_sql', {'sql': disable_rls_sql}).execute()
    except Exception as e:
        print(f"Table creation error: {e}")

async def create_default_admin():
    """Create default admin user"""
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    
    if not admin_email or not admin_password:
        return
    
    try:
        # Check if admin already exists
        result = supabase.table("users").select("id").eq("email", admin_email).execute()
        
        if not result.data:
            # Create admin user
            hashed_password = pwd_context.hash(admin_password)
            admin_data = {
                "username": "admin",
                "email": admin_email,
                "password": hashed_password,
                "credits": 1000,
                "role": "admin",
                "active_plan": "premium",
                "valid_till": (datetime.now() + timedelta(days=365)).isoformat()
            }
            
            supabase.table("users").insert(admin_data).execute()
            print("Default admin user created")
    except Exception as e:
        print(f"Admin creation error: {e}")

async def create_default_plan():
    """Create default plan"""
    try:
        # Check if default plan exists
        result = supabase.table("plans").select("id").eq("name", "Free Plan").execute()
        
        if not result.data:
            # Create default plan
            plan_data = {
                "name": "Free Plan",
                "credits": 10,
                "validity_months": 1,
                "price": 0.00,
                "is_active": True
            }
            
            supabase.table("plans").insert(plan_data).execute()
            print("Default plan created")
    except Exception as e:
        print(f"Default plan creation error: {e}")

def get_password_hash(password: str) -> str:
    """Hash password"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_db():
    """Get database client"""
    return supabase
