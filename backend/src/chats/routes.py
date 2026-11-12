import uuid
from fastapi import APIRouter, WebSocket, Depends, status
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi.responses import HTMLResponse
from src.auth.dependencies import AccessTokenBearer
from src.auth.service import AuthService
from src.db.main import get_session
from .service import ChatService
from .schemas import ConvCreateModel, RetrieveAllChatsResponseModel, ConversationResponseModel
from fastapi.exceptions import HTTPException
from .socket.ConnectionManager import manager
from src.exceptions import FalseIdException

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
    if response == 'unauthorized':
        raise FalseIdException()
    
    conv_uid = response['conv_uid']
    member_uids = await chat_service.conv_members(conv_uid, session)

    await manager.broadcast(member_uids, response)

    return {
        "conv_uid": conv_uid
    }
    
@chat_router.delete('/{conv_uid}')
async def delete_conversation(
    conv_uid: uuid.UUID,
    token_data: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session)
):
    member_uids = await chat_service.conv_members(conv_uid, session)
    user_uid = token_data['user']['uid']
    
    is_member = await chat_service.user_is_member_of_conv(user_uid, conversation_uid, session)
    if not is_member:
        raise FalseIdException()
    
    service_response = await chat_service.delete_conversation(user_uid, conv_uid, session)  
    
    await manager.broadcast(member_uids, service_response)
    return {
        'message': service_response
    }