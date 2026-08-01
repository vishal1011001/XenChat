from pydantic import BaseModel
from sqlmodel import Field

class UserCreateModel(BaseModel):
    username: str
    email: str
    password: str = Field(min_length=8)
    