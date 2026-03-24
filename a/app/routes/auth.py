from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.schemas import User, UserCreate, UserLogin
from app.db.database import get_supabase, get_current_user
from app.core.config import settings
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

router = APIRouter()
security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user_from_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await get_current_user(credentials.credentials)
    if user is None:
        raise credentials_exception
    return user

@router.post("/register")
async def register(user: UserCreate):
    """Register new user"""
    try:
        supabase = get_supabase()
        if not supabase:
            raise HTTPException(status_code=503, detail="Database not available")
        
        # Create user in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        
        if auth_response.user:
            # Create user profile in database
            supabase.table('users').insert({
                'id': auth_response.user.id,
                'email': user.email,
                'credits': 10  # Free credits for new users
            }).execute()
            
            return {"message": "User registered successfully", "user_id": auth_response.user.id}
        else:
            raise HTTPException(status_code=400, detail="Registration failed")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(user: UserLogin):
    """Login user"""
    try:
        supabase = get_supabase()
        if not supabase:
            raise HTTPException(status_code=503, detail="Database not available")
        
        # Authenticate user
        auth_response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        
        if auth_response.user and auth_response.session:
            # Create JWT token
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": auth_response.user.id}, expires_delta=access_token_expires
            )
            
            # Get user credits
            user_data = supabase.table('users').select('credits').eq('id', auth_response.user.id).execute()
            credits = user_data.data[0]['credits'] if user_data.data else 0
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": auth_response.user.id,
                    "email": auth_response.user.email,
                    "credits": credits
                }
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/logout")
async def logout(current_user: Dict[str, Any] = Depends(get_current_user_from_token)):
    """Logout user"""
    try:
        supabase = get_supabase()
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user_from_token)):
    """Get current user info"""
    try:
        supabase = get_supabase()
        user_data = supabase.table('users').select('*').eq('id', current_user['id']).execute()
        
        if user_data.data:
            return user_data.data[0]
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
