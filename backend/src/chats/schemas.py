from pydantic import BaseModel
import uuid
from typing import List
from datetime import datetime

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
    


'''Response Models:'''

class ConversationMetadataResponseModel(ConversationMetadata):
    created_at: datetime
    updated_at: datetime

class MessageResponseModel(BaseModel):
    message_uid: uuid.UUID
    content: str
    sender_uid: uuid.UUID
    sent_at: datetime
    
class ConversationResponseModel(BaseModel):
    conv_uid: uuid.UUID
    conv_metadata: ConversationMetadataResponseModel
    member_usernames: List[str]
    messages: List[MessageResponseModel]
    
class RetrieveAllConvResponseModel(BaseModel):
    conversations: List[ConversationResponseModel]