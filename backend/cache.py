import redis
import json
from typing import Optional, Any
from config import get_settings

settings = get_settings()


class RedisCache:
    """Redis cache manager for storing search results"""
    
    def __init__(self):
        self.client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            password=settings.REDIS_PASSWORD if settings.REDIS_PASSWORD else None,
            db=settings.REDIS_DB,
            decode_responses=True
        )
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            value = self.client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"Redis GET error: {e}")
            return None
    
    def set(self, key: str, value: Any, ttl: int = None) -> bool:
        """Set value in cache with optional TTL (seconds)"""
        try:
            if ttl is None:
                ttl = settings.CACHE_TTL_SECONDS
            
            serialized_value = json.dumps(value)
            self.client.setex(key, ttl, serialized_value)
            return True
        except Exception as e:
            print(f"Redis SET error: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            self.client.delete(key)
            return True
        except Exception as e:
            print(f"Redis DELETE error: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        try:
            return bool(self.client.exists(key))
        except Exception as e:
            print(f"Redis EXISTS error: {e}")
            return False
    
    def get_ttl(self, key: str) -> int:
        """Get remaining TTL for a key in seconds"""
        try:
            return self.client.ttl(key)
        except Exception as e:
            print(f"Redis TTL error: {e}")
            return -1
    
    def ping(self) -> bool:
        """Check if Redis connection is alive"""
        try:
            return self.client.ping()
        except Exception as e:
            print(f"Redis PING error: {e}")
            return False


# Global cache instance
cache = RedisCache()
