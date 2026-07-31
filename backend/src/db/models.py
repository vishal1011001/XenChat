from sqlmodel import SQLModel, Field, Column
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime
from typing import Optional

class User(SQLModel, table=True):
    __tablename__="users"
    
    user_uid: uuid.UUID = Field(
        sa_column=Column(
            pg.UUID,
            nullable=False,
            primary_key=True,
            default=uuid.uuid4
        )
    )
    username: str
    email: str
    password_hash: str
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    updated_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    
    def __repr__(self):
        return f"<Username: {self.username}>" 
    
class Conversation(SQLModel, table=True):
    __tablename__ = 'conversation'
    
    conv_uid: uuid.UUID = Field(
        sa_column=Column(
            pg.UUID,
            nullable=False,
            primary_key=True,
            default=uuid.uuid4
        )
    )
    conv_type: str
    member_count: int = Field(default=0)
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    updated_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))

class ConversationMember(SQLModel, table=True):
    __tablename__='conversation_member'
    
    conv_uid: uuid.UUID = Field(
        foreign_key='conversation.conv_uid',
        primary_key=True
    )
    user_uid: uuid.UUID = Field(
        foreign_key='users.user_uid',
        primary_key=True
    )
    role: str = "member"
    joined_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    
class Message(SQLModel, table=True):
    __tablename__='messages'
    
    message_uid: str = Field(
        sa_column=Column(
            pg.UUID,
            nullable=False,
            primary_key=True,
            default=uuid.uuid4
        )
    )
    
    #manual entry of following 3 fields at backend level
    content: str
    conv_uid: uuid.UUID = Field(
        foreign_key='conversation.conv_uid'
    )
    sender_uid: uuid.UUID = Field(
        foreign_key='users.user_uid'
    )
    
    sent_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))