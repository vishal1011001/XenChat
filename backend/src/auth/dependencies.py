from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from fastapi.requests import Request
from .utils import decode_token
from src.db.redis import check_token_in_blocklist

from fastapi import Depends 
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.main import get_session
from .service import AuthService

from fastapi.exceptions import HTTPException
from fastapi import status


class TokenBearer(HTTPBearer):
    def __init__(self,auto_error = True):
        super().auto_error = auto_error
        
    async def __call__(self, request: Request) -> HTTPAuthorizationCredentials | None:
        creds = await super().__call__(request)
        
        token = creds.credentials
        token_data = decode_token(token)
        
        if not token_data:
            raise HTTPExceptions(status_code=status.HTTP_401_UNAUTHORIZED,
                                 detail='invalid token')
        
        if await check_token_in_blocklist(token_data['jti']):
            raise HTTPExceptions(status_code=status.HTTP_401_UNAUTHORIZED,
                                 detail='expired token')
        
        self.verify_token_type(token_data)
        
        return token_data
    
    def verify_token_type(self, token_data):
        raise NotImplementedError('Override this function in child classes.')
    

class AccessTokenBearer(TokenBearer):
    def verify_token_type(self, token_data: dict):
        if token_data and token_data['refresh']:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='provide access token'
            )

class RefreshTokenBearer(TokenBearer):
    def verify_token_type(self, token_data: dict):
        if token_data and not token_data['refresh']:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='provide refresh token'
            )
    
