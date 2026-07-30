from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://vishal:vishal0191@localhost:5432/xen_chat"
    
    model_config=SettingsConfigDict(
        env_file='.env',
        extra='ignore'
    )
    
Config = Settings()