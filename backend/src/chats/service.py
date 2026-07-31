from src.db.models import Message
from .schemas import MessageModel
from sqlmodel.ext.asyncio.session import AsyncSession

class ChatService():
    async def register_message(self, message: MessageModel, session: AsyncSession):
        # msg_dict = message.model_dump()
        msg = Message(**message)
        session.add(msg)
        await session.commit()
        await session.refresh(msg)
        
        