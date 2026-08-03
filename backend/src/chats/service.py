from src.db.models import Message
from .schemas import MessageModel
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from sqlmodel import select
from src.db.models import ConversationMember

class ChatService():
    async def register_message(self, message: MessageModel, session: AsyncSession):
        # msg_dict = message.model_dump()
        msg = Message(**message)
        session.add(msg)
        await session.commit()
        await session.refresh(msg)
        
    async def conv_members(self, conv_uid: str, session: AsyncSession) -> List:
        statement = select(ConversationMember).where(ConversationMember.conv_uid == conv_uid)
        result = await session.exec(statement)
        member_uids = []
        for member in result:
            member_uids.append(member.user_uid)
        return member_uids