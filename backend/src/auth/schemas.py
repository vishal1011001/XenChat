from pydantic import BaseModel
from sqlmodel import Field
from typing import Optional

class UserCreateModel(BaseModel):
    username: str
    email: str
    password: str = Field(min_length=8)

class UserLoginModel(BaseModel):
    username: Optional[str]
    email: Optional[str]
    password: str = Field(min_length=8)