import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.main import get_session
from src.files.service import ChatService
from src.chats.socket.ConnectionManager import manager
from src.auth.dependencies import AccessTokenBearer

from .bot_service import get_bot_reply
from ..schemas import MessageModel

bot_router = APIRouter()
access_token_bearer = AccessTokenBearer()
chat_service = ChatService()

BOT_USER_UID=uuid.UUID('b57f13d1-8e93-428d-9126-32e3eb935c00')

@bot_router.post('/')
async def send_message(
    message: MessageModel,
    token_data: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session)
):
    message = message.model_dump()
    conv_uid = message['conv_uid']
    
    user_msg = await chat_service.register_message(message, session)
    user_payload = {
        "req": "send_msg",
        "message_uid": str(user_msg.message_uid),
        "content": user_msg.content,
        "conv_uid": str(user_msg.conv_uid),
        "sender_uid": str(user_msg.sender_uid),
        "sent_at": user_msg.sent_at.isoformat() if user_msg.sent_at else None
    }
    
    member_uids = await chat_service.conv_members(conv_uid, session)
    await manager.broadcast(
        member_uids=member_uids,
        message=user_payload
    )
    
    bot_reply = await get_bot_reply(conversation_uid=conv_uid, session=session)
    bot_message = {
        "content": bot_reply,
        "sender_uid": BOT_USER_UID,
        "conv_uid": conv_uid,
        "message_type": "text"
    }
    bot_msg = await chat_service.register_message(bot_message, session)
    bot_payload = {
        "req": "send_msg",
        "message_uid": str(bot_msg.message_uid),
        "content": bot_msg.content,
        "conv_uid": str(bot_msg.conv_uid),
        "sender_uid": str(bot_msg.sender_uid),
        "sent_at": bot_msg.sent_at.isoformat() if bot_msg.sent_at else None
    }
    
    await manager.broadcast(
        member_uids=member_uids,
        message=bot_payload
    )