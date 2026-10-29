import uuid
import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.main import get_session
from .service import FileService
from ..service import ChatService
from .schema import FileMetadataSchema
from ..socket.ConnectionManager import manager
from typing import List

from fastapi.responses import FileResponse

file_router = APIRouter()
file_service = FileService()
chat_service = ChatService()

UPLOAD_DIR="uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@file_router.post('/send')
async def send_file(
    files: List[UploadFile] = File(),
    metadata: str = Form(),
    session: AsyncSession = Depends(get_session)
):
    file_metadata = FileMetadataSchema.model_validate_json(metadata)
    member_uids = await chat_service.conv_members(file_metadata.conv_uid, session)
    
    for file in files:
        file_uid = uuid.uuid4()
        file_location = os.path.join(UPLOAD_DIR, str(file_uid) + '.png')
        
        await file_service.save_file_path(
            file_uid=file_uid,
            file_name=file.filename,
            file_path=file_location,
            session=session
        )
        
        message={
            'content': file_metadata.caption,
            'sender_uid': str(file_metadata.sender_uid),
            'conv_uid': str(file_metadata.conv_uid),
            'message_type': 'file',
            'file_uid': str(file_uid)
        }
        
        save_response = await chat_service.register_message(
            message=message,
            session=session
        )
        
        message['req'] = 'send_msg'
        message['message_uid'] = str(save_response.message_uid)
        message['sent_at'] = str(save_response.sent_at)
        
        #saving file to disk
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
        await manager.broadcast(
            member_uids=member_uids,
            message=message
        )   
     
    return {
        'message': 'files saved successfully'
    }


@file_router.get('/get/{file_uid}')
async def get_file(
    file_uid: uuid.UUID,
    session: AsyncSession = Depends(get_session)
):
    file_path = await file_service.get_path_of_a_file(file_uid, session)
    
    return FileResponse(
        str(file_path)
    )    