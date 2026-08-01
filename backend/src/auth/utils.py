from passlib.context import CryptContext
from datetime import datetime, timedelta
import uuid
import jwt
from src.config import Config
import logging

passwd_context = CryptContext(
    schemes=['bcrypt']
)

ACCESS_TOKEN_EXPIRY=24

def generate_password_hash(password: str) -> str:
    hash = passwd_context.hash(password)
    return hash

def verify_password_hash(password: str, hashed: str):
    return password_hash.verify(password, hashed)

async def create_access_token(user_data: dict, expiry: timedetla = None, refresh: bool=False):
    payload = {}
    
    payload['user'] = user_data
    payload['exp'] = datetime.now() + (expiry if expiry is not None else timedelta(hours=ACCESS_TOKEN_EXPIRY))
    payload['jti'] = str(uuid.uuid4())
    payload['refresh'] = refresh
    
    token = jwt.encode(
        payload=payload,
        key=Config.JWT_SECRET,
        algorithm=Config.JWT_ALGORITHM
    )
    
    return token

async def decode_token(token: str) -> dict:
    try:
        token_data = jwt.decode(
            jwt=token,
            key=Config.JWT_SECRET,
            algorithms=[Config.JWT_ALGORITHM]
        )
        return token_data
    
    except jwt.PyJWTError as e:
        logging.exception(e)
        return None