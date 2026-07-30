from fastapi import FastAPI
from .chats.routes import chat_router
from contextlib import asynccontextmanager
from .db.main import init_db

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
    

app.include_router(chat_router, prefix=f"/api/{version}/response", tags=['response'])