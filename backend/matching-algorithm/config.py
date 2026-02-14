from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Worker settings loaded from environment variables"""

    # API (worker service)
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_DEBUG: bool = False

    # Matching Algorithm
    DEFAULT_SEARCH_RADIUS_KM: float = 50.0
    MAX_RESULTS: int = 20
    
    # Lowered threshold for more flexibility
    SIMILARITY_THRESHOLD: float = 0.25 
    
    # Price flexibility (allow 15% over max price)
    PRICE_TOLERANCE_PERCENT: float = 0.15

    # Semantic Search
    USE_SEMANTIC_SEARCH: bool = True
    SEMANTIC_WEIGHT: float = 0.8  # Increased weight for meaning
    FUZZY_WEIGHT: float = 0.2  # Decreased weight for exact spelling
    SEMANTIC_MODEL: str = "all-MiniLM-L6-v2"  # Fast and accurate model

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
