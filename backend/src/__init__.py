from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from contextlib import asynccontextmanager
from .db.main import init_db
from typing import List
from src.auth.routes import auth_router
from src.chats.routes import chat_router
from .middleware import register_middleware
import uuid


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

class SocketConnection:
    def __init__(self, client_id: uuid.UUID, websocket: WebSocket):
        self.client_id = client_id
        self.websocket = websocket
        

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[SocketConnection] = []
        
    async def find_connection(self, member_uid):
        for connection in self.active_connections:
            if connection.client_id == member_uid:
                return connection
        
    async def connect(self, websocket: WebSocket, client_id: uuid.UUID):
        await websocket.accept()
        new_conn = SocketConnection(client_id, websocket)
        self.active_connections.append(new_conn)
        
    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        
    async def send_personal_message(self, message:str, websocket: WebSocket):
        await websocket.send_text(str(message))
        
    async def broadcast(self, member_uids: List, message: str):
        receivers = []
        for member_uid in member_uids:
            receiver = await self.find_connection(member_uid)
            if receiver:
                receivers.append(receiver.websocket)
        
        for connection in receivers:
            await self.send_personal_message(message, connection)
            
manager = ConnectionManager()

@app.websocket('/ws/{client_id}')
async def websocket_endpoint(websocket: WebSocket, client_id):
    await manager.connect(websocket, uuid.UUID(client_id))
    try:
        # continuosly listening for data
        while True:
            data = await websocket.receive_json()
            
            #saving message in database
            async with session_factory() as session:
                new_msg = await chat_service.register_message(
                    message=data,
                    session=session
                )
            
            #broadcasting message to all conversation members - that are online
            conv_uid = data['conv_uid']
            message = data['content']
            member_uids = await chat_service.conv_members(conv_uid, session)

            await manager.broadcast(member_uids, message)
            
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
        await manager.broadcast(f"{client_id} left the chat.")
    

app.include_router(auth_router, prefix=f"/api/{version}/auth", tags=["auth"])
app.include_router(chat_router, prefix=f"/api/{version}/chats", tags=["chats"])

register_middleware(app)