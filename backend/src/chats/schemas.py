from pydantic import BaseModel
import uuid
from typing import List

class MessageModel(BaseModel):
    content: str
    sender_uid: uuid.UUID
    conv_uid: uuid.UUID     
    
class ConversationMetadata(BaseModel):
    conv_type: str
    member_count: int
    
class ConvCreateModel(BaseModel):
    conversation_metadata: ConversationMetadata
    users: list[dict]