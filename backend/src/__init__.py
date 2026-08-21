from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from contextlib import asynccontextmanager
from .db.main import init_db
from typing import List
from src.auth.routes import auth_router
from src.chats.routes import chat_router
from src.chats.socket.SocketRoutes import router as ws_router
from .middleware import register_middleware
from .chats.socket.ConnectionManager import ConnectionManager
import uuid


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
    
register_middleware(app)

app.include_router(auth_router, prefix=f"/api/{version}/auth", tags=["auth"])
app.include_router(chat_router, prefix=f"/api/{version}/chats", tags=["chats"])
app.include_router(ws_router)