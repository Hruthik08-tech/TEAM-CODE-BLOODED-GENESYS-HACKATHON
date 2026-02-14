from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
from typing import List

from database import get_db, engine
from models import Base
from schemas import (
    DemandSearchRequest,
    SearchResponse,
    HealthCheckResponse,
    ErrorResponse,
)
from matching_service import MatchingService
from cache import cache
from config import get_settings

settings = get_settings()

# Create database tables (in production, use migrations like Alembic)
# Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Waste Exchange Matching API",
    description="API for matching industrial waste suppliers with seekers",
    version="1.0.0",
)

# CORS middleware (configure based on your frontend domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Waste Exchange Matching API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", response_model=HealthCheckResponse, tags=["Health"])
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint.
    Checks database and Redis connectivity.
    """
    db_healthy = False
    redis_healthy = False

    # Check database
    try:
        db.execute(text("SELECT 1"))
        db_healthy = True
    except Exception as e:
        print(f"Database health check failed: {e}")

    # Check Redis
    try:
        redis_healthy = cache.ping()
    except Exception as e:
        print(f"Redis health check failed: {e}")

    status_ok = db_healthy and redis_healthy

    return HealthCheckResponse(
        status="healthy" if status_ok else "unhealthy",
        database=db_healthy,
        redis=redis_healthy,
        timestamp=datetime.utcnow(),
    )


@app.post("/api/v1/search", response_model=SearchResponse, tags=["Matching"])
async def search_matches(request: DemandSearchRequest, db: Session = Depends(get_db)):
    """
    Search for matching supplies for a given demand.

    - **demand_id**: ID of the demand to search for
    - **force_refresh**: Set to true to bypass cache and get fresh results

    Results are cached for 1 hour. Subsequent searches within the hour
    will return cached results unless force_refresh is true.
    """
    try:
        matching_service = MatchingService(db)
        results = matching_service.search_matches(
            demand_id=request.demand_id, force_refresh=request.force_refresh
        )
        return results

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        print(f"Search error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during search: {str(e)}",
        )


@app.delete("/api/v1/cache/{demand_id}", tags=["Cache"])
async def invalidate_cache(demand_id: int, db: Session = Depends(get_db)):
    """
    Invalidate cached search results for a specific demand.

    Use this endpoint when:
    - Demand parameters have changed
    - New supplies have been added that might match
    - You want to force a fresh search
    """
    try:
        matching_service = MatchingService(db)
        deleted = matching_service.invalidate_cache(demand_id)

        return {
            "message": "Cache invalidated" if deleted else "No cache found",
            "demand_id": demand_id,
            "deleted": deleted,
        }

    except Exception as e:
        print(f"Cache invalidation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during cache invalidation: {str(e)}",
        )


@app.get("/api/v1/search/{demand_id}", response_model=SearchResponse, tags=["Matching"])
async def get_search_results(
    demand_id: int, force_refresh: bool = False, db: Session = Depends(get_db)
):
    """
    Alternative GET endpoint for searching matches.
    Useful for simple frontend implementations.

    - **demand_id**: ID of the demand to search for
    - **force_refresh**: Query parameter to bypass cache
    """
    try:
        matching_service = MatchingService(db)
        results = matching_service.search_matches(
            demand_id=demand_id, force_refresh=force_refresh
        )
        return results

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        print(f"Search error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during search: {str(e)}",
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_DEBUG,
    )
