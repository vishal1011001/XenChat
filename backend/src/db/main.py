from src.config import Config
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession

async_engine = create_async_engine(
    url=Config.DATABASE_URL
)

async def init_db():
    async with async_engine.begin() as conn:
        from src.db.models import User
        await conn.run_sync(SQLModel.metadata.create_all) 
        
async def get_session():
    Session = sessionmaker(
        bind=async_engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    
    async with Session() as session:
        yield session