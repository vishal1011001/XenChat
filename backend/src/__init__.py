from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from .chats.routes import chat_router
from contextlib import asynccontextmanager
from .db.main import init_db
from typing import List

from src.chats.service import ChatService
from src.db.main import session_factory
chat_service = ChatService()

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

@app.websocket('/ws/{client_id}')
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        # continuosly listening for data
        while True:
            data = await websocket.receive_json()
            
            async with session_factory() as session:
                new_msg = await chat_service.register_message(
                    message=data,
                    session=session
                )
            
            await manager.broadcast(f"{client_id}: {data}")
            print('MESSAGE SENT!')
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
        await manager.broadcast(f"{client_id} left the chat.")
    
    
app.include_router(chat_router, prefix=f"/api/{version}/response", tags=['response'])