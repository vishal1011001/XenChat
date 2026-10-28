import uuid
import os
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.models import FileMetadata, Message
from sqlmodel import select, asc, desc, and_, or_
from fastapi import UploadFile
from ..service import ChatService

chat_service = ChatService()


class FileService:
    async def save_file_path(self, file_uid: uuid.UUID, file_name: str, file_path: str, session: AsyncSession):
        '''
        '''
        file_data_dict = {
            'file_uid': file_uid,
            'file_name': file_name,
            'file_path': file_path
        }
        
        new_file = FileMetadata(
            **file_data_dict
        ) 
        
        session.add(new_file)
        await session.commit()
    
    async def get_files_metadata_of_conv(self, conv_uid: uuid.UUID, session: AsyncSession):
        '''
        '''
        statement = select(FileMetadata).where(FileMetadata.file_uid.in_(select(Message.file_uid).where(and_(Message.conv_uid == conv_uid, Message.message_type == 'file'))))
        result = await session.exec(statement)
  
        return result.all()
        
        
    async def get_files_metadata_of_user(self, user_uid: uuid.UUID, session: AsyncSession):
        '''
        '''
        # Get all conv_uids that user is a part of
        conv_uids = await chat_service.get_all_conv_uids_of_user(user_uid, session)
        files_metadata = []

        for conv_uid in conv_uids:
            res = await self.get_files_metadata_of_conv(conv_uid, session)
            files_metadata.append(res)
        
        return files_metadata
    
    
    async def get_path_of_a_file(self, file_uid: uuid.UUID, session: AsyncSession):
        '''
        '''
        statement = select(FileMetadata.file_path).where(FileMetadata.file_uid == file_uid)
        result = await session.exec(statement)
        return result.first()