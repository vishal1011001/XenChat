from redis.asyncio import Redis
from src.config import Config
from src.auth.utils import decode_token

token_blocklist = Redis(
    host=Config.REDIS_HOST,
    port=Config.REDIS_PORT,
    db=0
)

JTI_EXPIRY_TIME=84600

async def add_jti_to_blocklist(token) -> None:
    token_data = decode_token(token)
    exp = token_data['exp']
    jti = token_data['jti']
    remaining_time = JTI_EXPIRY_TIME - exp 
    await token_blocklist.set(name=jti, value="", ex=remaining_time)
    
async def check_token_in_blocklist(jti: str) -> bool:
    return token_blocklist.exists(jti) == 1