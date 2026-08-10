from .schemas import MessageModel, ConvCreateModel
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from sqlmodel import select, desc
from src.db.models import User, Conversation, ConversationMember, Message 
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
            
            FUCNTION STILL UNDER CONSTRUCTION
        '''
        statement1 = select(ConversationMember.conv_uid).where(ConversationMember.user_uid == user_uid)
        result = await session.exec(statement1)
        
        #converting sql result object instance to python iterable
        conv_uids = [row[0] if isinstance(row, tuple) else row for row in result.all()]
        
        if not conv_uids:
            return []
        
        statement2 = select(Message).where(Message.conv_uid.in_(conv_uids)).order_by(desc(Message.sent_at))
        message_result = await session.exec(statement2)
        
        statement3 = select(Conversation).where(Conversation.conv_uid.in_(conv_uids))
        conv_result = await session.exec(statement3)
        
        statement4 = select(User.username).where(User.user_uid.in_(select(ConversationMember.user_uid).where(ConversationMember.conv_uid.in_(conv_uids))));
        username_result = await session.exec(statement4)
        
        return {
            'messages': message_result.all(),
            'conversations': conv_result.all(),
            'usernames': username_result.all()
        }
    
    
    async def create_conversation(self, conv_create_data: ConvCreateModel, user_uid_of_creator: uuid.UUID, session: AsyncSession):
        '''
            Creates a new conversation - dm or group chat
        '''
        
        conv_create_dict = conv_create_data.model_dump()
        users = conv_create_dict['users']
        converstion_metadata = conv_create_dict['conversation_metadata']
        
        creator_username = users[0]['username']
        statement0 = select(User.user_uid).where(User.username == creator_username)
        res = await session.exec(statement0)
        creator_user_uid = str(res.first())
        
        if creator_user_uid != user_uid_of_creator:
            print(creator_user_uid)
            print(user_uid_of_creator)
            return {
                "message": "unauthorized"
            }
        
        conversation = Conversation(**converstion_metadata)
        session.add(conversation)
        await session.commit()
        
        conv_uid = conversation.conv_uid
        
        for user in users:
            username = user['username']
            statement1 = select(User.user_uid).where(User.username == username)
            res = await session.exec(statement1)
            user["user_uid"] = res.first()
            user["conv_uid"] = conv_uid
            
            member = ConversationMember(**user)
            session.add(member)
            
        await session.commit()
        
        return {
            "message": "success - created conversation"
        }
        
        