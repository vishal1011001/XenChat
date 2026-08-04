from src.db.models import Message
from .schemas import MessageModel
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from sqlmodel import select, desc
from src.db.models import ConversationMember
import uuid

class ChatService():
    async def register_message(self, message: MessageModel, session: AsyncSession):
        '''
            saves a message into database
        '''
        msg = Message(**message)
        session.add(msg)
        await session.commit()
        await session.refresh(msg)
        
    async def conv_members(self, conv_uid: uuid.UUID, session: AsyncSession) -> List:
        '''
            Returns user_uid of all members of a conversation (conv_uid)
        '''
        statement = select(ConversationMember).where(ConversationMember.conv_uid == conv_uid)
        result = await session.exec(statement)
        member_uids = []
        for member in result:
            member_uids.append(member.user_uid)
        return member_uids
    
    async def get_messages_of_user(self, user_uid: uuid.UUID, session: AsyncSession):
        '''
            Get all messages that belong to a user.
            Fetched during app startup on frontend (initialize)
        '''
        statement1 = select(ConversationMember.conv_uid).where(ConversationMember.user_uid == user_uid)
        result = await session.exec(statement1)
        
        #converting sql result object instance to python iterable
        conv_uids = [row[0] if isinstance(row, tuple) else row for row in result.all()]
        
        if not conv_uids:
            return []
        
        statement2 = select(Message).where(Message.conv_uid.in_(conv_uids)).order_by(desc(Message.sent_at))
        message_result = await session.exec(statement2)
        
        return message_result.all()