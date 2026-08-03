from fastapi import APIRouter, WebSocket, Depends
from fastapi.responses import HTMLResponse
from src.auth.dependencies import AccessTokenBearer


chat_router = APIRouter()
access_token_bearer = AccessTokenBearer()        

@chat_router.get('/')
async def get_response(token_data: dict = Depends(access_token_bearer)):
    return {
        "message": "Server is running OK."
    }