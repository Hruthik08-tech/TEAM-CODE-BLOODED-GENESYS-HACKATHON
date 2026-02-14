# Backend - Waste Exchange Matching Algorithm

Intelligent matching system for connecting industrial waste suppliers with seekers using AI-powered semantic search.

## Features

- **Semantic Search** - AI understands meaning: "rice" matches "basmati rice", "jasmine rice"
- **Geographic Matching** - Haversine formula for accurate GPS-based distance calculations
- **Smart Scoring** - Multi-factor ranking: name similarity (40%) + distance (40%) + price (20%)
- **Redis Caching** - 1-hour cache for instant repeat searches (10-20ms vs 200-500ms)
- **Price Filtering** - Budget-based supplier filtering

## Quick Start

### Prerequisites
- Docker Desktop
- 4GB RAM minimum

### Run the API

```bash
# Start all services (API, MySQL, Redis)
docker-compose up -d

# Check health
curl http://localhost:8000/health

# View API documentation
http://localhost:8000/docs
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | System health check |
| POST | `/api/v1/search` | Search for matching suppliers |
| GET | `/api/v1/search/{demand_id}` | Get search results |
| DELETE | `/api/v1/cache/{demand_id}` | Invalidate cache |

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"demand_id": 1, "force_refresh": false}'
```

### Example Response

```json
{
  "demand_id": 1,
  "total_results": 2,
  "search_radius_km": 50.0,
  "cached": false,
  "results": [
    {
      "org_name": "Green Industries Ltd",
      "item_name": "Wood Sawdust",
      "distance_km": 12.5,
      "match_score": 0.88,
      "name_similarity": 0.95,
      "price_per_unit": 50.0,
      "organization_email": "contact@greenindustries.com"
    }
  ]
}
```

## How Matching Works

### 1. Category Filter
Only matches within same category (wood ↔ wood, food ↔ food)

### 2. Geographic Filter
```
distance(demand_location, supplier_location) <= search_radius
```

### 3. Semantic Similarity
Uses AI model to understand meaning:
- "rice" → "basmati rice" (85% match)
- "wood waste" → "sawdust" (78% match)
- "organic waste" → "food waste" (82% match)

### 4. Price Filter
```
supplier_price <= max_price_budget
```

### 5. Match Scoring
```
score = (name_similarity × 0.4) + (distance_score × 0.4) + (price_match × 0.2)
```

##  Tech Stack

- **FastAPI** - Modern Python web framework
- **MySQL** - Primary database
- **Redis** - Caching layer
- **Sentence Transformers** - AI semantic search (all-MiniLM-L6-v2)
- **SQLAlchemy** - ORM
- **Docker** - Containerization

## Project Structure

```
backend/
├── main.py                  # FastAPI application & endpoints
├── matching_service.py      # Core matching algorithm
├── semantic_search.py       # AI semantic matching
├── utils.py                 # Distance & similarity calculations
├── models.py                # Database models (SQLAlchemy)
├── schemas.py               # Request/response validation (Pydantic)
├── database.py              # Database connection
├── cache.py                 # Redis cache manager
├── config.py                # Configuration settings
├── requirements.txt         # Python dependencies
├── docker-compose.yml       # Docker orchestration
├── Dockerfile               # Container configuration
├── test_api.py              # To test APIs
├── .env.example             # Environment template
└── README.md                #This file
```

## Configuration

Copy `.env.example` to `.env` and configure:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=waste_exchange

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Matching Algorithm
SIMILARITY_THRESHOLD=0.6
USE_SEMANTIC_SEARCH=True
SEMANTIC_WEIGHT=0.7
FUZZY_WEIGHT=0.3
```

##  Database Requirements

### Required Tables

1. **organization** - Companies registered on platform
2. **organization_supply** - Materials being offered
3. **organization_demand** - Materials being sought

### Critical Fields

**organization:**
- `org_id`, `org_name`, `email`
- `latitude`, `longitude` (for distance calculations)
- `is_verified`

**organization_supply:**
- `supply_id`, `org_id`, `category_id`
- `item_name` (used for semantic matching)
- `price_per_unit`, `unit`
- `is_active`

**organization_demand:**
- `demand_id`, `org_id`, `category_id`
- `item_name` (search query)
- `latitude`, `longitude` (search location)
- `search_radius` (in kilometers)
- `max_price_per_unit`
- `is_active`

##  Performance

- **First search:** 200-500ms (database query + AI inference)
- **Cached search:** 10-20ms (Redis retrieval)
- **Model loading:** 2-5 seconds (first time only, then cached)
- **Throughput:** 1000+ requests/minute

## Testing

### Test with curl
```bash
# Health check
curl http://localhost:8000/health

# Search
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"demand_id": 1}'
```

### Interactive Testing
Visit: `http://localhost:8000/docs` (Swagger UI)

##  Development

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Locally (without Docker)
```bash
# Start MySQL and Redis first, then:
uvicorn main:app --reload
```

### Run with Docker
```bash
docker-compose up -d
```

##  API Documentation

Full interactive API documentation available at:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

##  Integration

### For Frontend Team

Use these endpoints to integrate:

1. **Search for suppliers:**
```javascript
const response = await fetch('http://localhost:8000/api/v1/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    demand_id: demandId,
    force_refresh: false
  })
});
const data = await response.json();
```

2. **Display results:**
Results are pre-sorted by match score (best first). Show:
- Organization name
- Item name
- Distance (km)
- Match score (0-1)
- Price
- Contact info

3. **Handle caching:**
Check `cached` field in response. If `true`, results are from cache.

##  Troubleshooting

### "Empty reply from server"
Rebuild containers: `docker-compose build --no-cache && docker-compose up -d`

### "Database connection failed"
Check if MySQL container is running: `docker-compose ps`

### "Redis connection refused"
Ensure Redis is running and accessible at configured host/port

### Slow first search
Normal - AI model loads on first request (2-5 seconds). Subsequent searches are fast.


---


