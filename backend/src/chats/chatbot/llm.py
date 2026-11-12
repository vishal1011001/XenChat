import os
from openai import AsyncOpenAI
from src.config import Config

client = AsyncOpenAI(
    api_key=Config.LLM_API_KEY,
    base_url='https://api.groq.com/openai/v1'
)

MODEL = Config.LLM_MODEL