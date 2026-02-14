# Not Requierd 

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


class DemandSearchRequest(BaseModel):
    """Request schema for demand search"""
    demand_id: int = Field(..., description="ID of the demand to search for")
    force_refresh: bool = Field(
        default=False,
        description="Force refresh even if cached results exist"
    )


class SupplyMatchResult(BaseModel):
    """Schema for a single supply match result"""
    supply_id: int
    org_id: int
    org_name: str
    category_id: int
    item_name: str
    item_description: Optional[str] = None
    price_per_unit: Optional[float] = None
    unit: Optional[str] = None
    distance_km: float
    name_similarity: float
    match_score: float
    organization_email: str
    organization_phone: Optional[str] = None
    organization_address: Optional[str] = None
    organization_latitude: float
    organization_longitude: float
    
    model_config = ConfigDict(from_attributes=True)


class SearchResponse(BaseModel):
    """Response schema for search results"""
    demand_id: int
    total_results: int
    search_radius_km: float
    cached: bool
    cache_expires_in_seconds: Optional[int] = None
    results: List[SupplyMatchResult]
    searched_at: datetime


class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    database: bool
    redis: bool
    timestamp: datetime


class ErrorResponse(BaseModel):
    """Error response schema"""
    error: str
    detail: Optional[str] = None
