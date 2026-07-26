from fastapi import APIRouter

chat_router = APIRouter()

@chat_router.get('/')
async def get_response():
    return {
        "message": "Server is running OK."
    }