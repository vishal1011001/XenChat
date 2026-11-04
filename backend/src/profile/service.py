import uuid
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.models import UserProfile
from sqlmodel import select, asc, desc, and_, or_

class ProfileService():
    async def update_about(self, about: str, user_uid: uuid.UUID, session:AsyncSession):
        '''
            Save/Update the "about" of the user 
        '''
        statement = select(UserProfile).where(UserProfile.user_uid == user_uid)
        result = await session.exec(statement)
        profile_to_update = result.first()
        
        if not profile_to_update:
            return 'profile_DNE'
        
        profile_to_update.about = about
        await session.commit()
        return about