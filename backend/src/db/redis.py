from redis.asyncio import from_url
from src.config import Config
import time

token_blocklist = from_url(Config.redis_url, decode_responses=True)


async def add_jti_to_blocklist(token_data) -> None:
    exp = token_data['exp']
    jti = token_data['jti']
    
    remaining_time = exp - int(time.time())
    if remaining_time > 0:
        await token_blocklist.set(name=jti, value="", ex=remaining_time)
         
    
async def check_token_in_blocklist(jti: str) -> bool:
    return await token_blocklist.exists(jti) == 1