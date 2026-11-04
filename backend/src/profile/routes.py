from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from src.auth.dependencies import AccessTokenBearer
from src.db.main import get_session
from .service import ProfileService
from .schemas import UpdateAboutResponseModel

profile_router = APIRouter()
profile_service = ProfileService()
access_token_bearer = AccessTokenBearer()

@profile_router.patch('/about', response_model=UpdateAboutResponseModel)
async def set_about(
    about: str,
    token_data: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session)
):
    user_uid = token_data['user']['uid']
    res = await profile_service.update_about(about, user_uid, session)
    return {
        'about': res
    }