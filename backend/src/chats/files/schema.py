from pydantic import BaseModel
import uuid

class FileMetadataSchema(BaseModel):
    sender_uid: uuid.UUID
    conv_uid: uuid.UUID
    caption: str | None