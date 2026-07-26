from fastapi import APIRouter, WebSocket
from fastapi.responses import HTMLResponse

chat_router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.connections: list[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        

@chat_router.get('/')
async def get_response():
    return {
        "message": "Server is running OK."
    }