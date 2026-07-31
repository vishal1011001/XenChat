from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from .chats.routes import chat_router
from contextlib import asynccontextmanager
from .db.main import init_db
from typing import List

@asynccontextmanager
async def life_span(app: FastAPI):
    print('server is running...')
    await init_db()
    yield
    print('server has stopped.')
    
version = 'v1'

app = FastAPI(
    title="XenChat",
    description="Real time socket based chat application.",
    version=version,
    lifespan=life_span
)


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        
    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        
    async def send_personal_message(self, message:str, websocket: WebSocket):
        await websocket.send_text(message)
        
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message) 
            
manager = ConnectionManager()


    

app.include_router(chat_router, prefix=f"/api/{version}/response", tags=['response'])