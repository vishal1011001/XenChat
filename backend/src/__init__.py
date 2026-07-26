from fastapi import FastAPI
from .chats.routes import chat_router

app = FastAPI()

version = 'v1'

app.include_router(chat_router, prefix=f"/api/{version}/response", tags=['response'])