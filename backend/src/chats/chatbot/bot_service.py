import uuid
from sqlmodel import select
from .llm import client, MODEL
from src.db.models import Message
from typing import List
from sqlmodel.ext.asyncio.session import AsyncSession

BOT_USER_UID=uuid.UUID('b57f13d1-8e93-428d-9126-32e3eb935c00')
MAX_HISTORY=20
SYSTEM_PROMPT = (
    "You are XenBot, a friendly assistant chatbot inside XenChat app."
    "Be concise and helpful."
    "Answer in simple plain-text. Not tabular form."
)

async def build_context(conversation_uid: uuid.UUID, session: AsyncSession) -> List[dict]:
    statement = select(Message).where(Message.conv_uid == conversation_uid).order_by(Message.sent_at.desc()).limit(MAX_HISTORY)
    result = await session.exec(statement)
    rows = list(reversed(result.all()))
    
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for m in rows:
        role = "assistant" if m.sender_uid == BOT_USER_UID else "user"
        messages.append({
            "role": role,
            "content": m.content[:2000]
        })
    return messages

async def get_bot_reply(conversation_uid: uuid.UUID, session: AsyncSession) -> str:
    context = await build_context(conversation_uid, session)
    response = await client.chat.completions.create(
        messages=context,
        model=MODEL,
        temperature=0.7,
        max_tokens=500
    )
    
    return response.choices[0].message.content


 
