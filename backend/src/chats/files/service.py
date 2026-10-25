import uuid
import os
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.models import FileMetadata
from sqlmodel import select, asc, desc
from fastapi import UploadFile


class FileService:
    async def save_file_path(self, file_name: str, file_metadata: UploadFile, file_path: str, session: AsyncSession):
        file_data_dict = file_metadata.model_dump()
        file_data_dict['file_path'] = file_path
        file_data_dict['file_name'] = file_name
        
        new_file = FileMetadata(
            **file_data_dict
        ) 
        
        session.add(new_file)
        await session.commit()
        
        return 'File Successfully saved/sent'