import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    # Database configuration
    DATABASE_URL = os.getenv("DATABASE_URL")
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
    SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
    
    # JWT configuration
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Frontend configuration
    VITE_SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
    VITE_SUPABASE_ANON_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
    
    # Admin configuration
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
    
    # Version configuration
    PYTHON_VERSION = os.getenv("PYTHON_VERSION", "3.9")
    NODE_VERSION = os.getenv("NODE_VERSION", "18")

settings = Settings()
