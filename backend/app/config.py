import os
from pydantic_settings import BaseSettings

class Settings:
    PROJECT_NAME: str = "Sentient-UI"
    VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = int(os.getenv("PORT", "8001"))
    
    # Model Router Defaults
    DEFAULT_FAST_MODEL: str = os.getenv("FAST_MODEL", "gpt-4o-mini")
    DEFAULT_REASONING_MODEL: str = os.getenv("REASONING_MODEL", "claude-3-5-sonnet")
    DEFAULT_LOCAL_MODEL: str = os.getenv("LOCAL_MODEL", "llama3-8b")
    
    # Vector Memory
    MEMORY_COLLECTION: str = "sentient_agent_memory"
    EMBEDDING_DIM: int = 64

settings = Settings()
