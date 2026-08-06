from fastapi import APIRouter, WebSocket, Depends
from fastapi.responses import HTMLResponse
from src.auth.dependencies import AccessTokenBearer
from src.auth.service import AuthService
from src.db.main import get_session
from .service import ChatService

auth_service = AuthService()
chat_service = ChatService()

chat_router = APIRouter()
access_token_bearer = AccessTokenBearer()        
    
@chat_router.get('/')
async def get_chats_of_user(
    token_data: dict = Depends(access_token_bearer),
    session: dict = Depends(get_session)
):
    email = token_data['user']['email']
    user = await auth_service.get_user_by_email(email, session)
    user_uid = user.user_uid
    
    messages = await chat_service.get_messages_of_user(user_uid, session)
    return messages