# Lightweight Matching Algorithm Setup

The matching algorithm has been updated to be lightweight and API-first.
It no longer requires heavy ML libraries like PyTorch or SentenceTransformers locally.

## 1. Choose Your Mode

There are two ways to run the matching engine:

### Option A: Ultra-Lightweight (Fuzzy Only - Default)

- **Uses**: Levenshtein Distance (String similarity) + Rules.
- **Pros**: Zero cost, instant setup, no API keys needed.
- **Cons**: Less accurate for synonyms (e.g., won't know "rice" ~ "basmati").
- **Configuration**: Do nothing. It runs in this mode by default.

### Option B: Semantic Search (API Based)

- **Uses**: Hugging Face Inference API or OpenAI Embeddings API.
- **Pros**: High accuracy, understands context and synonyms.
- **Cons**: Requires an API Key (Free for Hugging Face).
- **Configuration**:
  1. Get a **Hugging Face Token** (Free): [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
     - Create a "Read" token.
  2. OR get an **OpenAI API Key**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## 2. Setup

Update your `.env` file in the root directory:

```bash
# ... existing vars ...

# Select Provider (Optional - Auto-detected from keys)
# SEMANTIC_PROVIDER=huggingface

# Add your API Key
HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxx
# OR
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```

## 3. Run

Rebuild the containers to apply the lightweight changes:

```bash
docker-compose build matching-worker
docker-compose up -d
```

The installation time for `matching-worker` should now be seconds instead of minutes.

## Troubleshooting

### "API Key Not Found"

Ensure you have added your API key to the `.env` file and restarted the worker:

```bash
docker-compose restart matching-worker
```

### "No Matches Found"

- Check if the database is seeded correctly:

```bash
docker exec genysis_mysql mysql -uroot -p<YOUR_PASSWORD> genesys \
  -e "SELECT COUNT(*) AS supplies FROM org_supply; SELECT COUNT(*) AS demands FROM org_demand;"
```

- Ensure the worker is running:

```bash
docker ps | grep genysis_worker
```

- Check worker logs:

```bash
docker logs genysis_worker --tail 20
```
