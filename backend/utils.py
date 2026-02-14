import math
from typing import Tuple
import Levenshtein


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on earth (in kilometers).
    Uses the Haversine formula.
    
    Args:
        lat1: Latitude of point 1
        lon1: Longitude of point 1
        lat2: Latitude of point 2
        lon2: Longitude of point 2
    
    Returns:
        Distance in kilometers
    """
    # Convert decimal degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine formula
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    
    return c * r


def calculate_string_similarity(str1: str, str2: str) -> float:
    """
    Calculate similarity between two strings using normalized Levenshtein distance.
    This is the fuzzy/exact matching approach.
    
    Args:
        str1: First string
        str2: Second string
    
    Returns:
        Similarity score between 0 and 1 (1 = identical)
    """
    if not str1 or not str2:
        return 0.0
    
    # Normalize strings (lowercase, strip whitespace)
    str1_normalized = str1.lower().strip()
    str2_normalized = str2.lower().strip()
    
    # Exact match
    if str1_normalized == str2_normalized:
        return 1.0
    
    # Calculate Levenshtein ratio (normalized similarity)
    return Levenshtein.ratio(str1_normalized, str2_normalized)


def calculate_hybrid_similarity(
    str1: str,
    str2: str,
    use_semantic: bool = True,
    semantic_weight: float = 0.7,
    fuzzy_weight: float = 0.3
) -> float:
    """
    Calculate hybrid similarity combining semantic and fuzzy matching.
    
    Semantic matching understands meaning:
    - "rice" matches "basmati rice" (high similarity)
    - "wood chips" matches "sawdust" (medium similarity)
    
    Fuzzy matching handles typos and variations:
    - "sawdust" matches "saw dust" (high similarity)
    - "aluminum" matches "aluminium" (high similarity)
    
    Args:
        str1: First string
        str2: Second string
        use_semantic: Whether to use semantic matching (requires model)
        semantic_weight: Weight for semantic similarity (0-1)
        fuzzy_weight: Weight for fuzzy similarity (0-1)
    
    Returns:
        Combined similarity score between 0 and 1
    """
    # Always calculate fuzzy similarity
    fuzzy_sim = calculate_string_similarity(str1, str2)
    
    if not use_semantic:
        return fuzzy_sim
    
    try:
        # Try to use semantic matching
        from semantic_search import calculate_semantic_similarity
        semantic_sim = calculate_semantic_similarity(str1, str2)
        
        # Combine both scores with weights
        combined = (semantic_sim * semantic_weight) + (fuzzy_sim * fuzzy_weight)
        
        # Take the maximum of combined and fuzzy (never worse than fuzzy alone)
        return max(combined, fuzzy_sim)
        
    except Exception as e:
        # If semantic matching fails, fall back to fuzzy only
        print(f"Semantic search not available, using fuzzy only: {e}")
        return fuzzy_sim


def calculate_match_score(
    distance_km: float,
    name_similarity: float,
    price_match: bool,
    max_distance: float
) -> float:
    """
    Calculate an overall match score based on multiple factors.
    
    Args:
        distance_km: Distance between demand and supply in km
        name_similarity: String similarity score (0-1)
        price_match: Whether price is within acceptable range
        max_distance: Maximum acceptable distance in km
    
    Returns:
        Overall match score (higher is better)
    """
    # Distance score (closer is better)
    # Normalize distance: 0 km = 1.0, max_distance km = 0.0
    distance_score = max(0, 1 - (distance_km / max_distance))
    
    # Name similarity score (already 0-1)
    name_score = name_similarity
    
    # Price score (binary: 1 if acceptable, 0 if not)
    price_score = 1.0 if price_match else 0.0
    
    # Weighted combination
    # Weights: name=0.4, distance=0.4, price=0.2
    overall_score = (name_score * 0.4) + (distance_score * 0.4) + (price_score * 0.2)
    
    return overall_score


def generate_cache_key(demand_id: int) -> str:
    """
    Generate a cache key for a demand search.
    
    Args:
        demand_id: The demand ID
    
    Returns:
        Cache key string
    """
    return f"search_results:demand:{demand_id}"
