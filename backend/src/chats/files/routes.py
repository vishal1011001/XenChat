import uuid
import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.main import get_session
from .service import FileService
from .schema import FileMetadataSchema

file_router = APIRouter()
file_service = FileService()

UPLOAD_DIR="uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@file_router.post('/send')
async def send_file(
    file: UploadFile = File(),
    metadata: str = Form(),
    session: AsyncSession = Depends(get_session)
):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    
    file_metadata = FileMetadataSchema.model_validate_json(metadata)
    
    #saving file to disk
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    save_path_response = await file_service.save_file_path(
        file_name=file.filename,
        file_metadata=file_metadata,
        file_path=file_location,
        session=session
    )
    
    return {
        'message': save_path_response
    }
        