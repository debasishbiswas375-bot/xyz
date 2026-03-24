import os
from supabase import create_client, Client
from datetime import datetime, timedelta
from passlib.context import CryptContext

# ❌ REMOVE dotenv (important for Render)
# from dotenv import load_dotenv
# load_dotenv()

# ✅ Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Missing Supabase ENV variables")

print("Using Supabase:", SUPABASE_URL)
print("Key starts with:", SUPABASE_KEY[:10])

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =========================
# INIT DB (NO TABLE CREATION)
# =========================
def init_db():
    try:
        create_default_admin()
        create_default_plan()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization error: {e}")


# =========================
# ADMIN CREATION
# =========================
def create_default_admin():
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    admin_username = os.getenv("ADMIN_USERNAME", "admin")

    if not admin_email or not admin_password:
        print("Admin env missing")
        return

    try:
        # Check existing
        result = supabase.table("users").select("id").eq("email", admin_email).execute()

        if not result.data:
            hashed_password = pwd_context.hash(admin_password)

            admin_data = {
                "username": admin_username,
                "email": admin_email,
                "password": hashed_password,
                "credits": 9999,
                "role": "admin",
                "active_plan": "lifetime",
                "valid_till": (datetime.now() + timedelta(days=3650)).isoformat()
            }

            supabase.table("users").insert(admin_data).execute()
            print("✅ Admin created")

        else:
            print("Admin already exists")

    except Exception as e:
        print(f"Admin creation error: {e}")


# =========================
# DEFAULT PLAN
# =========================
def create_default_plan():
    try:
        result = supabase.table("plans").select("id").eq("name", "Free Plan").execute()

        if not result.data:
            plan_data = {
                "name": "Free Plan",
                "credits": 10,
                "validity_months": 1,
                "price": 0.0,
                "is_active": True
            }

            supabase.table("plans").insert(plan_data).execute()
            print("✅ Default plan created")

        else:
            print("Default plan exists")

    except Exception as e:
        print(f"Plan creation error: {e}")


# =========================
# PASSWORD UTILS
# =========================
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# =========================
# DB GETTER
# =========================
def get_db():
    return supabase
