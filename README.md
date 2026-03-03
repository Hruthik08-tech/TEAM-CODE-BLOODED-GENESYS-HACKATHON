# GENYSIS

A full-stack supply chain management platform built with React, Express, MySQL, and Redis.

## Overview

GENYSIS is a platform designed to connect suppliers and seekers in the supply chain ecosystem. It leverages modern technologies to provide efficient matching, real-time updates, and a seamless user experience.

## Tech Stack

| Layer              | Technology                                      |
| ------------------ | ----------------------------------------------- |
| **Frontend**       | React 19 · Vite · React Router · Leaflet (maps) |
| **Backend**        | Node.js · Express 5 · MySQL2 · Redis            |
| **Infrastructure** | Docker · Docker Compose · NGINX                 |

## Project Structure

```
GENYSIS/
├── .env                          # Environment variables (git-ignored)
├── .env.example                  # Template for .env
├── docker-compose.yml            # All 6 services orchestration
├── RUN_GUIDE.md                  # Comprehensive run guide
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

## Getting Started

Follow these steps to set up and run the application using Docker.

### Prerequisites

Ensure you have the following installed on your system:

- [Docker](https://www.docker.com/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/) (v2.x)
- [Git](https://git-scm.com/)

### Setup and Run

1. **Clone the repository**

   ```bash
   git clone https://github.com/Hruthik08-tech/TEAM-CODE-BLOODED-GENYSYS-HACKATHON.git
   cd TEAM-CODE-BLOODED-GENYSYS-HACKATHON
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with your desired passwords and API keys
   ```

3. **Start all services**

   ```bash
   docker-compose up --build
   ```

   This starts the following services:

   - **MySQL** on port `3307`
   - **Redis** on port `6379`
   - **Backend API** on port `3000`
   - **Frontend** on port `80`

4. **Verify services**

   Check that all containers are running:

   ```bash
   docker ps
   ```

5. **Access the application**

   - Frontend: [http://localhost](http://localhost)
   - Backend API Health Check: [http://localhost:3000/api/health](http://localhost:3000/api/health)

## Troubleshooting

### Common Issues

1. **Docker containers not starting**

   Ensure Docker is running and retry:

   ```bash
   docker-compose up --build
   ```

2. **Database connection errors**

   Verify MySQL credentials in `.env` and ensure the MySQL container is running:

   ```bash
   docker ps | grep mysql
   ```

3. **Redis connection errors**

   Restart the Redis container:

   ```bash
   docker-compose restart redis
   ```

## License

This project is licensed under the ISC License.
