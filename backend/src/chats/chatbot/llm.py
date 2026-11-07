import os
from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key=os.getenv('LLM_API_KEY'),
    base_url=os.getenv('LLM_BASE_URL', 'https://')
)

MODEL = os.getenv('LLM_MODEL', '')