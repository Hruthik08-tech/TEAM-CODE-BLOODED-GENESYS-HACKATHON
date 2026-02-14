from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "waste_exchange"
    DB_USER: str = "root"
    DB_PASSWORD: str = ""

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str = ""
    REDIS_DB: int = 0

    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_DEBUG: bool = False

    # Cache
    CACHE_TTL_SECONDS: int = 3600  # 1 hour

    # Matching Algorithm
    DEFAULT_SEARCH_RADIUS_KM: float = 50.0
    MAX_RESULTS: int = 20
    SIMILARITY_THRESHOLD: float = 0.6

    # Semantic Search
    USE_SEMANTIC_SEARCH: bool = True
    SEMANTIC_WEIGHT: float = 0.7  # Weight for semantic similarity
    FUZZY_WEIGHT: float = 0.3  # Weight for fuzzy similarity
    SEMANTIC_MODEL: str = "all-MiniLM-L6-v2"  # Fast and accurate model

    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def database_url(self) -> str:
        """Generate SQLAlchemy database URL"""
        return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance"""
    return Settings()
