# GENYSIS — Supply-Demand Matching Platform

## Comprehensive Run Guide (v2.0)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Docker)](#quick-start)
3. [Project Architecture](#project-architecture)
4. [Environment Variables](#environment-variables)
5. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites <a name="prerequisites"></a>

| Tool           | Minimum Version | Notes                          |
| -------------- | --------------- | ------------------------------ |
| Docker         | 20+             | Docker Desktop recommended     |
| Docker Compose | 2.x             | Usually bundled with Docker    |
| Git            | 2.x+            | For version control            |

---

## 2. Quick Start (Docker) <a name="quick-start"></a>

### Step 1: Clone & Navigate

```bash
git clone <REPO_URL>
cd GENYSIS
```

### Step 2: Configure Environment

```bash
cp .env.example .env
# Edit .env and set:
#   - MYSQL_ROOT_PASSWORD (your MySQL root password)
#   - MYSQL_DATABASE (default: genesys)
#   - JWT_SECRET (any secure string)
#   - OPENAI_API_KEY (required for AI matching)
```

### Step 3: Build & Launch

```bash
docker compose up --build -d
```

This starts all 6 services:

| Service         | Container Name   | Port(s)              |
| --------------- | ---------------- | -------------------- |
| Nginx (Gateway) | genysis_nginx    | **80** (main entry)  |
| Backend API     | genysis_backend  | 3000 (internal)      |
| Frontend        | genysis_frontend | 8080 (direct access) |
| Matching Worker | genysis_worker   | 8000 (internal)      |
| MySQL 8.0       | genysis_mysql    | 3307→3306            |
| Redis 7         | genysis_redis    | 6379                 |

### Step 4: Wait for Auto-Initialization (~30–60 seconds)

> **No manual database setup required!** The MySQL container automatically
> executes the SQL init scripts from `docker/init/` on first start:
>
> 1. `00_schema.sql` — Creates all 18 tables, indexes, and foreign keys
> 2. `01_seed_organisations.sql` — Seeds 20 test organisations
> 3. `02_seed_test_data.sql` — Seeds 24 categories, 38 supplies, 38 demands, and history records
>
> This happens only once when the MySQL data volume is empty. Subsequent
> `docker compose up` commands reuse the existing data.

Verify everything is ready:

```bash
# Check all containers are running
docker ps --format "table {{.Names}}\t{{.Status}}"

# Verify database was seeded
docker exec genysis_mysql mysql -uroot -p<YOUR_PASSWORD> genesys \
  -e "SELECT COUNT(*) AS orgs FROM organisation; SELECT COUNT(*) AS cats FROM item_category; SELECT COUNT(*) AS supplies FROM org_supply; SELECT COUNT(*) AS demands FROM org_demand;"

# Expected output: orgs=20, cats=24, supplies=38, demands=38
```

### Step 5: Access the Application

| Access Method       | URL                              |
| ------------------- | -------------------------------- |
| **Via Nginx**       | http://localhost (port 80)       |
| **Frontend Direct** | http://localhost:8080            |
| **API Health**      | http://localhost:3000/api/health |
| **Worker Health**   | http://localhost:8000/health     |

---

## 3. Project Architecture <a name="project-architecture"></a>

```
GENYSIS/
├── .env                          # Environment variables (git-ignored)
├── .env.example                  # Template for .env
├── docker-compose.yml            # All 6 services orchestration
├── RUN_GUIDE.md                  # ← This file
├── README.md                     # Project overview
│
├── docker/
│   └── init/                     # MySQL auto-init scripts
│       ├── 00_schema.sql         # Full schema (18 tables)
│       ├── 01_seed_organisations.sql  # 20 test organisations
│       └── 02_seed_test_data.sql      # Categories + supplies + demands
│
├── nginx/
│   └── nginx.conf                # Reverse proxy config
│
├── backend/
│   ├── connections/              # MySQL & Redis connection setup
│   ├── routes/                   # API route handlers
│   ├── middleware/               # Express middleware
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page-level components
│   │   └── utils/                # Utility functions
│   └── ...
└── planning/                     # Requirements & planning docs
```

---

## 4. Environment Variables <a name="environment-variables"></a>

| Variable              | Required | Default        | Description                |
| --------------------- | -------- | -------------- | -------------------------- |
| `MYSQL_ROOT_PASSWORD` | Yes      | rootpassword   | MySQL root password        |
| `MYSQL_DATABASE`      | Yes      | genesys        | Database name              |
| `JWT_SECRET`          | Yes      | (set your own) | Secret for JWT signing     |
| `OPENAI_API_KEY`      | Yes*     | (none)         | OpenAI key for AI matching |
| `DB_HOST`             | Auto     | mysql          | Set by Docker Compose      |
| `DB_PORT`             | Auto     | 3306           | Set by Docker Compose      |
| `REDIS_HOST`          | Auto     | redis          | Set by Docker Compose      |
| `REDIS_PORT`          | Auto     | 6379           | Set by Docker Compose      |

---

## 5. Troubleshooting <a name="troubleshooting"></a>

### "CORS errors in browser"

- Nginx handles CORS. Ensure you're accessing via `http://localhost` (port 80)
- If accessing frontend on port 8080, API calls go to `/api/...` relative path

### "Redis connection refused"

```bash
docker logs genysis_redis --tail 10
docker compose restart redis
```

### Full Reset (Nuclear Option)

```bash
# 1. Stop and remove everything including volumes
docker compose down -v

# 2. Rebuild and start fresh
docker compose up --build -d

# 3. Wait ~60s for MySQL init + seeding
# 4. Verify
docker exec genysis_mysql mysql -uroot -p<YOUR_PASSWORD> genesys \
  -e "SELECT COUNT(*) AS orgs FROM organisation;"
# Expected: 20
```

---

## Key Design Decisions

1. **Auto-Init Pipeline**: All schema and seed data lives in `docker/init/` and is applied automatically on first start via MySQL's `docker-entrypoint-initdb.d` mechanism. No manual database setup required.
2. **Compatibility Schema**: The `org_demand` table includes both `required_by` (backend) and `required_by_date` (planning) columns; `business_room` includes both `org_id_1`/`org_id_2` and `supply_org_id`/`demand_org_id` — ensuring full compatibility between the planning schema and backend code.
3. **Soft Deletes**: Supply/Demand listings use `deleted_at` field (never hard-deleted).
4. **Name Snapshots**: Requests, rooms, and deals store supply/demand names at creation time — prevents confusion if items are renamed later.
5. **Cryptographic QR Tokens**: Each deal's QR code contains a 256-bit random token (`crypto.randomBytes(32)`) ensuring uniqueness.
6. **Cache Invalidation**: Supply/demand updates and deletes automatically invalidate their cached search results.
7. **Public Verification**: The `/api/deals/verify/:token` endpoint requires no authentication — anyone scanning the QR can verify.
8. **Auto Room Creation**: Accepting a request automatically creates a business room for the two parties.
9. **20 Pre-Seeded Orgs**: The seed data includes 20 diverse organisations across industries (agriculture, pharma, electronics, textiles, etc.) with 38 supplies and 38 demands designed to produce meaningful AI matching results.

---

## File Structure Overview

```
GENYSIS/
├── .env                          # Environment variables (git-ignored)
├── .env.example                  # Template for .env
├── docker-compose.yml            # All 6 services orchestration
├── RUN_GUIDE.md                  # ← This file
├── README.md                     # Project overview
│
├── docker/
│   └── init/                     # MySQL auto-init scripts
│       ├── 00_schema.sql         # Full schema (18 tables)
│       ├── 01_seed_organisations.sql  # 20 test organisations
│       └── 02_seed_test_data.sql      # Categories + supplies + demands
│
├── nginx/
│   └── nginx.conf                # Reverse proxy config
│
├── backend/
│   ├── connections/              # MySQL & Redis connection setup
│   ├── routes/                   # API route handlers
│   ├── middleware/               # Express middleware
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page-level components
│   │   └── utils/                # Utility functions
│   └── ...
└── planning/                     # Requirements & planning docs
```

---

_Generated by GENYSIS Agent — Feb 2026 (v2.0)_
