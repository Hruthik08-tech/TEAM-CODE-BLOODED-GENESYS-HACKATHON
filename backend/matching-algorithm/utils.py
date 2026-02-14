# Used for calculation of the score 

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
    # Safe clamp to avoid domain error due to floating point precision
    a = max(0.0, min(1.0, a))
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


def normalize_quantity(qty: float, unit: str) -> float:
    """
    Normalize quantity to a base unit (kg for mass, l for volume).
    Returns None if unit is unknown or incompatible.
    """
    if qty is None or not unit:
        return qty
        
    u = unit.lower().strip().rstrip('s') # remove plural s
    
    # Mass (Base: kg)
    if u in ['kg', 'kilogram']: return qty
    if u in ['g', 'gram']: return qty / 1000.0
    if u in ['tonne', 'ton', 'metric ton']: return qty * 1000.0
    if u in ['mg', 'milligram']: return qty / 1000000.0
    
    # Volume (Base: l)
    if u in ['l', 'litre', 'liter']: return qty
    if u in ['ml', 'milliliter']: return qty / 1000.0
    
    # Count/Other (return raw)
    # bag, box, piece, unit, etc. - assume they are comparable if units match
    return qty


def calculate_match_score(
    distance_km: float,
    similarity_score: float,
    supply_price: float,
    demand_max_price: float,
    max_distance: float,
    supply_qty: float = None,
    supply_unit: str = None,
    demand_qty: float = None,
    demand_unit: str = None,
    price_tolerance: float = 0.25
) -> float:
    """
    Calculate an overall match score based on multiple factors with flexibility.
    Now includes Quantity optimization.
    """
    # 1. Distance Score (Linear decay)
    if max_distance <= 0:
        dist_score = 0.0
    else:
        dist_score = max(0.0, 1.0 - (distance_km / max_distance))
    
    # 2. Similarity Score (Passed 0-1)
    sim_score = similarity_score
    
    # 3. Price Score (Flexible)
    # Increased flexibility: even if slightly overpriced, it's not a dealbreaker
    price_score = 0.0
    if demand_max_price is None or demand_max_price <= 0:
        price_score = 1.0
    elif supply_price is None or supply_price <= 0:
        price_score = 0.9 # Assume negotiable
    else:
        if supply_price <= demand_max_price:
            price_score = 1.0
            # Bonus for significantly cheaper? (e.g. < 80% of max)
            if supply_price < (0.8 * demand_max_price):
                 price_score = 1.0 # Cap at 1.0, but ensures it stays high
        else:
            limit_with_tolerance = demand_max_price * (1 + price_tolerance)
            if supply_price <= limit_with_tolerance:
                overage = supply_price - demand_max_price
                max_overage = limit_with_tolerance - demand_max_price
                # Smooth decay: 1.0 -> 0.5 at tolerance limit
                ratio = overage / max_overage
                price_score = 1.0 - (0.5 * ratio)
            else:
                price_score = 0.1 # Very low score, but not 0 to allow visibility

    # 4. Quantity Score
    # Prefer suppliers who can meet the demand (or reasonable partial)
    qty_score = 0.5 # Default neutral
    
    s_norm = normalize_quantity(supply_qty, supply_unit)
    d_norm = normalize_quantity(demand_qty, demand_unit)
    
    # Only compare if we successfully normalized both or units are identical string match
    comparable = False
    if s_norm is not None and d_norm is not None and d_norm > 0:
        # Check if they look like they are in the same 'group' (mass vs volume)
        # normalize_quantity returns raw for distinct things like 'bag'.
        # We assume if normalize_quantity returned values, they are in base units.
        # But 'bag' vs 'kg' is hard. We check unit string equality for non-standard units.
        s_u_clean = (supply_unit or "").lower().strip().rstrip('s')
        d_u_clean = (demand_unit or "").lower().strip().rstrip('s')
        
        # If units match textually OR we converted them to base units (and units weren't 'bag' etc)
        known_bases = ['kg', 'l', 'g', 'tonne', 'ton', 'ml'] # rough check
        # Actually normalize_quantity handles conversion.
        # If unit strings match, we compare raw. If they don't match, we rely on s_norm/d_norm IF they were converted.
        
        if s_u_clean == d_u_clean:
             comparable = True
        elif s_u_clean in ['kg', 'g', 'tonne', 'ton', 'mg'] and d_u_clean in ['kg', 'g', 'tonne', 'ton', 'mg']:
             comparable = True
        elif s_u_clean in ['l', 'ml'] and d_u_clean in ['l', 'ml']:
             comparable = True
            
    if comparable and d_norm > 0:
        fulfillment_ratio = s_norm / d_norm
        if fulfillment_ratio >= 1.0:
            qty_score = 1.0 # Full fulfillment
        elif fulfillment_ratio >= 0.8:
            qty_score = 0.9 # Good partial
        elif fulfillment_ratio >= 0.5:
            qty_score = 0.7 # Decent partial
        else:
            qty_score = 0.4 # Low fulfillment, but still useful
    
    # Weighted combination
    # Sim: 0.40, Dist: 0.25, Price: 0.25, Qty: 0.10
    overall_score = (sim_score * 0.40) + (dist_score * 0.25) + (price_score * 0.25) + (qty_score * 0.10)
    
    return min(1.0, max(0.0, overall_score))


def generate_cache_key(demand_id: int) -> str:
    """
    Generate a cache key for a demand search.
    
    Args:
        demand_id: The demand ID
    
    Returns:
        Cache key string
    """
    return f"search_results:demand:{demand_id}"
