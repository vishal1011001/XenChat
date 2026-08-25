from redis.asyncio import Redis
from src.config import Config
from src.auth.utils import decode_token
import time

token_blocklist = Redis(
    host=Config.REDIS_HOST,
    port=Config.REDIS_PORT,
    db=0
)

JTI_EXPIRY_TIME=84600

async def add_jti_to_blocklist(token_data) -> None:
    exp = token_data['exp']
    jti = token_data['jti']
    
    remaining_time = exp - int(time.time())
    if remaining_time > 0:
        await token_blocklist.set(name=jti, value="", ex=remaining_time)
         
    
async def check_token_in_blocklist(jti: str) -> bool:
    return await token_blocklist.exists(jti) == 1