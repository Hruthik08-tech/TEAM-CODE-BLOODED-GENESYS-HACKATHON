"""
Test script for the Waste Exchange Matching API

This script demonstrates how to use the API endpoints.
Make sure the API server is running before executing this script.
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:8000"


def test_health_check():
    """Test the health check endpoint"""
    print("\n=== Testing Health Check ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_search_post(demand_id: int, force_refresh: bool = False):
    """Test the POST search endpoint"""
    print(f"\n=== Testing POST Search (demand_id={demand_id}) ===")
    
    payload = {
        "demand_id": demand_id,
        "force_refresh": force_refresh
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/search",
        json=payload
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Total Results: {data['total_results']}")
        print(f"Cached: {data['cached']}")
        print(f"Search Radius: {data['search_radius_km']} km")
        
        if data['results']:
            print(f"\nTop Match:")
            top_match = data['results'][0]
            print(f"  - Organization: {top_match['org_name']}")
            print(f"  - Item: {top_match['item_name']}")
            print(f"  - Distance: {top_match['distance_km']} km")
            print(f"  - Match Score: {top_match['match_score']}")
            print(f"  - Name Similarity: {top_match['name_similarity']}")
    else:
        print(f"Error: {response.json()}")
    
    return response


def test_search_get(demand_id: int, force_refresh: bool = False):
    """Test the GET search endpoint"""
    print(f"\n=== Testing GET Search (demand_id={demand_id}) ===")
    
    params = {"force_refresh": force_refresh}
    
    response = requests.get(
        f"{BASE_URL}/api/v1/search/{demand_id}",
        params=params
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Total Results: {data['total_results']}")
        print(f"Cached: {data['cached']}")
        
        if data['cached']:
            print(f"Cache Expires In: {data['cache_expires_in_seconds']} seconds")
    else:
        print(f"Error: {response.json()}")
    
    return response


def test_invalidate_cache(demand_id: int):
    """Test cache invalidation endpoint"""
    print(f"\n=== Testing Cache Invalidation (demand_id={demand_id}) ===")
    
    response = requests.delete(f"{BASE_URL}/api/v1/cache/{demand_id}")
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response


def main():
    """Run all tests"""
    print("=" * 60)
    print("Waste Exchange Matching API - Test Script")
    print("=" * 60)
    
    # Test 1: Health Check
    health_ok = test_health_check()
    if not health_ok:
        print("\n⚠️  Health check failed! Make sure the server is running.")
        return
    
    # Test 2: Search for matches (POST)
    demand_id = 1  # Change this to an actual demand_id in your database
    test_search_post(demand_id, force_refresh=False)
    
    # Test 3: Search again (should return cached results)
    test_search_post(demand_id, force_refresh=False)
    
    # Test 4: Search with GET endpoint
    test_search_get(demand_id, force_refresh=False)
    
    # Test 5: Invalidate cache
    test_invalidate_cache(demand_id)
    
    # Test 6: Search again (should be fresh results after cache invalidation)
    test_search_post(demand_id, force_refresh=False)
    
    print("\n" + "=" * 60)
    print("All tests completed!")
    print("=" * 60)


if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to the API server.")
        print("Make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"\n❌ Error: {e}")
