from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from models import Organization, OrganizationSupply, OrganizationDemand
from schemas import SupplyMatchResult, SearchResponse
from utils import (
    calculate_distance,
    calculate_hybrid_similarity,
    calculate_match_score,
    generate_cache_key
)
from cache import cache
from config import get_settings

settings = get_settings()


class MatchingService:
    """Service for matching demands with supplies using hybrid semantic + fuzzy matching"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def search_matches(
        self,
        demand_id: int,
        force_refresh: bool = False
    ) -> SearchResponse:
        """
        Search for matching supplies for a given demand.
        Uses cached results if available and not expired.
        
        NOW WITH SEMANTIC SEARCH:
        - "rice" will match "basmati rice", "jasmine rice", "brown rice"
        - "wood chips" will match "sawdust", "wood waste"
        - "organic waste" will match "food waste", "compost material"
        
        Args:
            demand_id: ID of the demand to search for
            force_refresh: Force a new search even if cache exists
        
        Returns:
            SearchResponse with matched supplies
        """
        # Generate cache key
        cache_key = generate_cache_key(demand_id)
        
        # Check cache first (unless force_refresh)
        if not force_refresh:
            cached_results = cache.get(cache_key)
            if cached_results:
                # Add cache metadata
                cached_results['cached'] = True
                cached_results['cache_expires_in_seconds'] = cache.get_ttl(cache_key)
                return SearchResponse(**cached_results)
        
        # Fetch demand from database
        demand = self.db.query(OrganizationDemand).filter(
            OrganizationDemand.demand_id == demand_id,
            OrganizationDemand.is_active == True
        ).first()
        
        if not demand:
            raise ValueError(f"Demand {demand_id} not found or inactive")
        
        # Update search_time
        demand.search_time = datetime.utcnow()
        self.db.commit()
        
        # Perform the matching
        matches = self._find_matches(demand)
        
        # Prepare response
        response_data = {
            'demand_id': demand_id,
            'total_results': len(matches),
            'search_radius_km': demand.search_radius,
            'cached': False,
            'cache_expires_in_seconds': None,
            'results': matches,
            'searched_at': datetime.utcnow()
        }
        
        # Cache the results
        cache.set(cache_key, response_data)
        
        return SearchResponse(**response_data)
    
    def _find_matches(self, demand: OrganizationDemand) -> List[SupplyMatchResult]:
        """
        Core matching algorithm with SEMANTIC SEARCH.
        
        Matching criteria:
        1. Same category_id (exact match)
        2. Within search_radius (geographic constraint)
        3. Item name similarity - NOW WITH SEMANTIC UNDERSTANDING
        4. Price within acceptable range (if specified)
        5. Organization is verified and supply is active
        
        Args:
            demand: OrganizationDemand object
        
        Returns:
            List of SupplyMatchResult sorted by match score
        """
        # Query all active supplies in the same category
        supplies = self.db.query(OrganizationSupply, Organization).join(
            Organization,
            OrganizationSupply.org_id == Organization.org_id
        ).filter(
            OrganizationSupply.category_id == demand.category_id,
            OrganizationSupply.is_active == True,
            Organization.is_verified == True,
            # Exclude the demanding organization itself
            Organization.org_id != demand.org_id
        ).all()
        
        matches = []
        
        for supply, org in supplies:
            # Calculate distance
            distance_km = calculate_distance(
                demand.latitude,
                demand.longitude,
                org.latitude,
                org.longitude
            )
            
            # Filter by search radius
            if distance_km > demand.search_radius:
                continue
            
            # Calculate name similarity using HYBRID approach (semantic + fuzzy)
            name_similarity = calculate_hybrid_similarity(
                demand.item_name,
                supply.item_name,
                use_semantic=settings.USE_SEMANTIC_SEARCH,
                semantic_weight=settings.SEMANTIC_WEIGHT,
                fuzzy_weight=settings.FUZZY_WEIGHT
            )
            
            # Filter by similarity threshold
            if name_similarity < settings.SIMILARITY_THRESHOLD:
                continue
            
            # Check price match (if both are specified)
            price_match = True
            if demand.max_price_per_unit and supply.price_per_unit:
                price_match = supply.price_per_unit <= demand.max_price_per_unit
            
            # Calculate overall match score
            match_score = calculate_match_score(
                distance_km=distance_km,
                name_similarity=name_similarity,
                price_match=price_match,
                max_distance=demand.search_radius
            )
            
            # Create match result
            match = SupplyMatchResult(
                supply_id=supply.supply_id,
                org_id=org.org_id,
                org_name=org.org_name,
                category_id=supply.category_id,
                item_name=supply.item_name,
                item_description=supply.item_description,
                price_per_unit=supply.price_per_unit,
                unit=supply.unit,
                distance_km=round(distance_km, 2),
                name_similarity=round(name_similarity, 2),
                match_score=round(match_score, 2),
                organization_email=org.email,
                organization_phone=org.phone_number,
                organization_address=org.address,
                organization_latitude=org.latitude,
                organization_longitude=org.longitude
            )
            
            matches.append(match)
        
        # Sort by match score (descending) and limit results
        matches.sort(key=lambda x: x.match_score, reverse=True)
        matches = matches[:settings.MAX_RESULTS]
        
        return matches
    
    def invalidate_cache(self, demand_id: int) -> bool:
        """
        Invalidate cached search results for a demand.
        
        Args:
            demand_id: ID of the demand
        
        Returns:
            True if cache was deleted, False otherwise
        """
        cache_key = generate_cache_key(demand_id)
        return cache.delete(cache_key)
