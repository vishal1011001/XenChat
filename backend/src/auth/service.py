from sqlmodel.ext.asyncio.session import AsyncSession
from .schemas import UserCreateModel
from sqlmodel import select
from ..db.models import User

class AuthService():
    async def get_user_by_email(self, email: str, session: AsyncSession):
        statement = select(User).where(User.email == email)
        result = await session.exec(statement)
        return result.first() if result is not None else None
    
    async def get_user_by_username(self, username: str, session:AsyncSession):
        statement = select(User).where(User.username == username)
        result = await session.exec(statement)
        return result.first() if result is not None else None
    
    async def check_username_exists(self, username: str, session:AsyncSession):
        result = await self.get_user_by_username(username, session)
        return True if result is not None else False
    
    async def check_email_exists(self, email: str, session:AsyncSession):
        result = await self.get_user_by_email(email, session)
        return True if result is not None else False
        
    async def create_user(self, user_data: UserCreateModel, session: AsyncSession):
        user_data_dict = user_data.model_dump()
        new_user = User(
            **user_data_dict
        )
        
        new_user.password_hash = user_data_dict['password']
        
        session.add(new_user)
        await session.commit()
        return new_user
        