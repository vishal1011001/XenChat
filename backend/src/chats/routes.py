from fastapi import APIRouter, WebSocket, Depends, status
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi.responses import HTMLResponse
from src.auth.dependencies import AccessTokenBearer
from src.auth.service import AuthService
from src.db.main import get_session
from .service import ChatService
from .schemas import ConvCreateModel, RetrieveAllChatsResponseModel
from fastapi.exceptions import HTTPException

auth_service = AuthService()
chat_service = ChatService()

chat_router = APIRouter()
access_token_bearer = AccessTokenBearer()        
    
@chat_router.get('/', response_model=RetrieveAllChatsResponseModel)
async def get_chats_of_user(
    token_data: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session)
):
    email = token_data['user']['email']
    user = await auth_service.get_user_by_email(email, session)
    user_uid = user.user_uid
    
    result = await chat_service.get_all_chats_of_user(user_uid, session)
    return result 

@chat_router.post('/create/conversation')
async def create_conversation(
    conv_create_data: ConvCreateModel,
    token_data: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session)
):  
    user_uid_of_creator = token_data['user']['uid']
    response = await chat_service.create_conversation(conv_create_data, user_uid_of_creator, session)
    if response['message'] == 'unauthorized':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="You are not authorized to create conversation with false id")
    
    return response