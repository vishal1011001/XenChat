from fastapi import APIRouter, Depends, status
from sqlmodel.ext.asyncio.session import AsyncSession
from ..db.main import get_session
from .service import AuthService
from fastapi.exceptions import HTTPException
from .schemas import UserCreateModel

auth_router = APIRouter()
auth_service = AuthService()

@auth_router.post('/signup')
async def user_signup(user_data: UserCreateModel, session: AsyncSession = Depends(get_session)):
    email = user_data.email
    username = user_data.username
    email_exists = await auth_service.check_email_exists(email, session)
    username_exists = await auth_service.check_username_exists(username, session)
    if email_exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Email already registered.")
    elif username_exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="username already in use.")
    
    new_user = await auth_service.create_user(user_data, session)
    return new_user


    