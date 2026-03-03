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
      "price": 100.0
    },
    {
      "org_name": "Eco Supplies Co",
      "item_name": "Recycled Plastic",
      "distance_km": 25.0,
      "price": 200.0
    }
  ]
}
```

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

## Development

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

## Performance

- **First search:** 200-500ms (database query + AI inference)
- **Cached search:** 10-20ms (Redis retrieval)
- **Model loading:** 2-5 seconds (first time only, then cached)
- **Throughput:** 1000+ requests/minute

## Troubleshooting

### "Database Connection Error"

Ensure MySQL is running and accessible:

```bash
docker ps | grep genysis_mysql
```

Check logs for errors:

```bash
docker logs genysis_mysql --tail 20
```

### "Redis Connection Refused"

Restart Redis:

```bash
docker-compose restart redis
```

Check Redis logs:

```bash
docker logs genysis_redis --tail 20
```


