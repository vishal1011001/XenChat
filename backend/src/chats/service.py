from .schemas import MessageModel, ConvCreateModel
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from sqlmodel import select, desc, asc
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
        return msg
        
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
    
    
    async def get_all_conv_uids_of_user(self, user_uid: uuid.UUID, session: AsyncSession):
        '''
            Returns conv_uids of all conversations that user is a part of.
            Relation in use: ConversationMember
        '''
        statement_conv_uids = select(ConversationMember.conv_uid).where(ConversationMember.user_uid == user_uid)
        result = await session.exec(statement_conv_uids)
        
        #converting sql result object instance to python iterable
        conv_uids = [row[0] if isinstance(row, tuple) else row for row in result.all()]

        return conv_uids if conv_uids else []
    
    
    async def get_all_chats_of_user(self, user_uid: uuid.UUID, session: AsyncSession):
        '''
            Get all messages that belong to a user.
            Fetched during app startup on frontend (initialize)
        '''
        conv_uids = await self.get_all_conv_uids_of_user(user_uid, session)

        curr_user_name = await session.exec(select(User.username).where(User.user_uid == user_uid))
        curr_user_name = curr_user_name.first()
        all_conversations = []
        for conv_uid in conv_uids:
            statement_usernames = select(User.username).where(User.user_uid.in_(select(ConversationMember.user_uid).where(ConversationMember.conv_uid == conv_uid)));
            usernames_result = await session.exec(statement_usernames)
            usernames_result = usernames_result.all()
            usernames_result.remove(curr_user_name)
            
            statement_conv_metadata = select(Conversation).where(Conversation.conv_uid == conv_uid)
            conv_metadata_result = await session.exec(statement_conv_metadata)
            
            all_conversations.append({
                "conv_uid": conv_uid,
                "conv_metadata": conv_metadata_result.first(),
                "member_usernames": usernames_result
            })


        messages = await self.get_messages_of_user(conv_uids, session)
        
        return {
            "conversations": all_conversations,
            "messages": messages
        }
    
    
    async def get_messages_of_user(self, conv_uids: List[uuid.UUID], session: AsyncSession):
        '''
            Get all messages that belong to a user (as sender or receiver both)
        '''
        statement_messages = select(Message).where(Message.conv_uid.in_(conv_uids)).order_by(asc(Message.sent_at))
        message_result = await session.exec(statement_messages)
        
        return message_result.all()
        
    
    async def get_messages_of_conv(self, conv_uid: uuid.UUID, session: AsyncSession):
        '''
            Get all messages that belongs to a conversation
        '''
        statement_messages = select(Message).where(Message.conv_uid == conv_uid).order_by(asc(Message.sent_at))
        message_result = await session.exec(statement_messages)
        
        return message_result.all()
        
    
    
    async def create_conversation(self, conv_create_data: ConvCreateModel, user_uid_of_creator: uuid.UUID, session: AsyncSession):
        '''
            Creates a new conversation - dm or group chat
        '''
        
        # extracting data
        conv_create_dict = conv_create_data.model_dump()
        users = conv_create_dict['users']
        converstion_metadata = conv_create_dict['conversation_metadata']
        
        # fasle id conv creation check
        creator_username = users[0]['username']
        false_id = await self.fasle_id_creator_check(creator_username, user_uid_of_creator, session)
        if false_id:
            return "unauthorized"
        
        # creating conversation
        conversation = Conversation(**converstion_metadata)
        session.add(conversation)
        await session.commit()

        # creating entries in conversation_member table
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
        
        # returning response after conversation creation
        member_usernames = []
        for user in users:
            if user['username'] != creator_username:
                member_usernames.append(user['username'])
        
        conversation_response = {
            "conv_uid": conv_uid,
            "conv_metadata": {
                "conv_type": conversation.conv_type,
                "member_count": conversation.member_count,
                "created_at": conversation.created_at,
                "updated_at": conversation.updated_at
            },
            "member_usernames": member_usernames
        }
        
        return conversation_response
    
        
    async def fasle_id_creator_check(self, creator_username: uuid.UUID, user_uid_of_creator: uuid.UUID, session: AsyncSession):
        '''
            Checks if a user is trying to create a conversation between 2 users w/o himself being involved
        '''
        statement0 = select(User.user_uid).where(User.username == creator_username)
        res = await session.exec(statement0)
        creator_user_uid = str(res.first())
        
        return True if (creator_user_uid != user_uid_of_creator) else False;