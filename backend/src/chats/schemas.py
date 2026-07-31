from pydantic import BaseModel
import uuid

class MessageModel(BaseModel):
    content: str
    sender_uid: uuid.UUID
    conv_uid: uuid.UUID 
    
