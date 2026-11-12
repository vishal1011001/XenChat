from fastapi import APIRouter, Depends, status
from sqlmodel.ext.asyncio.session import AsyncSession
from ..db.main import get_session
from ..db.redis import add_jti_to_blocklist
from .service import AuthService
from src.files.service import FileService
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from .schemas import UserCreateModel, UserLoginModel
from .utils import verify_password_hash, create_access_token
from datetime import timedelta
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .dependencies import AccessTokenBearer, RefreshTokenBearer
from src.exceptions import UserAlreadyExistsException, UsernameInUseException, EmailNotFoundException, UsernameNotFoundException, InvalidCredentialsException

auth_router = APIRouter()
auth_service = AuthService()
file_service = FileService()

ACCESS_TOKEN_EXPIRY=timedelta(minutes=10)
REFRESH_TOKEN_EXPIRY=timedelta(days=10)

@auth_router.post('/signup', status_code=status.HTTP_201_CREATED)
async def user_signup(
    user_credentials: UserCreateModel, 
    session: AsyncSession = Depends(get_session)
):
    email = user_credentials.email
    username = user_credentials.username
    email_exists = await auth_service.check_email_exists(email, session)
    username_exists = await auth_service.check_username_exists(username, session)
    if email_exists:
        raise UserAlreadyExistsException()
    elif username_exists:
        raise UsernameInUseException()
    
    new_user = await auth_service.create_user(user_credentials, session)

    return {
        "msg": "Registration success",
        "status_code": "success", 
        "user": new_user,
    }


@auth_router.post('/signin')
async def user_signin(
    user_credentials: UserLoginModel, 
    session: AsyncSession = Depends(get_session)
):
    identity = user_credentials.identity
    email = None
    username = None
    if identity[-1: -5: -1] and '@' in identity:
        email = identity   
    else:
        username = identity
        
    password = user_credentials.password
    user = None
    
    if email is not None:
        email_exists = await auth_service.check_email_exists(email, session)
        if not email_exists:
            raise EmailNotFoundException()
        user = await auth_service.get_user_by_email(email, session)
         
    elif username is not None:
        username_exits = await auth_service.check_username_exists(username, session)
        if not username_exits:
            raise UsernameNotFoundException()
        user = await auth_service.get_user_by_username(username, session)
        
    pass_correct = verify_password_hash(password, user.password_hash)
    if not pass_correct:
        raise InvalidCredentialsException()
    
    pfp_file_uid = await file_service.get_pfp_file_uid(user.user_uid, session)
    user_data = {
        "username": user.username,
        "email": user.email,
        "user_uid": str(user.user_uid),
        "pfp_file_uid": str(pfp_file_uid)
    }  
    
    access_token = await create_access_token(
        user_data={
            'username': user.username,
            'email': user.email,
            'uid': str(user.user_uid)
        },
        expiry=ACCESS_TOKEN_EXPIRY
    )
    refresh_token = await create_access_token(
        user_data={
            'username': user.username,
            'email': user.email,
            'uid': str(user.user_uid)
        },
        expiry=REFRESH_TOKEN_EXPIRY,
        refresh=True
    )
    
    return {
        'msg': 'Login success',
        'status_code': 'success',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user_data
    }
    
    
@auth_router.get('/search/user/{username}')
async def search_user(
    username: str,                  
    session: AsyncSession = Depends(get_session)
):
    user = await auth_service.get_user_by_username(username, session)
    if user: 
        return {
            "message": "found"
        }
    else :
        raise UsernameNotFoundException()
    
@auth_router.get('/refresh_token')
async def get_new_access_token(
    refresh_token_data: dict = Depends(RefreshTokenBearer())
):
    user_data = refresh_token_data['user']
    
    new_access_token = await create_access_token(
        user_data=user_data,
        expiry=ACCESS_TOKEN_EXPIRY,
        refresh=False
    )
    new_refresh_token = await create_access_token(
        user_data=user_data,
        expiry=REFRESH_TOKEN_EXPIRY,
        refresh=True
    )
    
    await add_jti_to_blocklist(refresh_token_data)
    
    return {
        'status_code': 'refresh success',
        'access_token': new_access_token,
        'refresh_token': new_refresh_token,
    }
    
@auth_router.post('/logout')
async def logout_user(
    token_data: dict = Depends(RefreshTokenBearer())
):
    await add_jti_to_blocklist(token_data)
    return {
        'message': "logged out"     
    }