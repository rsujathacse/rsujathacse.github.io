---
title: Designing and Documenting a Secure Security Event Ingestion API
sidebar_position: 1
description: Build and document a production-ready security event ingestion API with authentication, rate limiting, idempotency, and PostgreSQL storage.
---

# Designing and Documenting a Secure Security Event Ingestion API

Security teams need a reliable way to collect events from applications, services, and infrastructure. Then query those events for investigations, alerting, and audit trails.

A **security event ingestion API** accepts structured event payloads over HTTP, validates them, stores them durably, and makes them easy to troubleshoot when things go wrong.

This guide walks through building a production-minded ingestion API with:

- Strict schema validation
- Authentication using API keys
- Rate limiting
- Idempotency support
- PostgreSQL storage
- CLI-based testing (`curl`, `jq`)
- OpenAPI-ready documentation

---

## Prerequisites

### Skills

- Basic REST API concepts (methods, status codes, JSON)
- Comfortable using the command line

### Tools

- Docker + Docker Compose
- Python 3.11+
- Git
- curl
- jq (optional but recommended)

### What you will build?
By the end of this guide, you will have implemented the following API endpoints:

| Endpoint | Purpose |
|-----------|----------|
| `POST /v1/events` | Ingest a single security event |
| `POST /v1/events:batch` | Ingest multiple events |
| `GET /v1/events/{event_id}` | Retrieve a stored event |
| `GET /healthz` | Health check |

---

## Project structure

The following directory layout keeps API logic modular and production-ready:

```bash
siem-event-api/
├── docker-compose.yml
└── app/
    ├── main.py
    ├── schemas.py
    ├── db.py
    ├── auth.py
    └── rate_limit.py
```
---

# Implementation

## Step 1: Define the event schema

Create `app/schemas.py`:

```python
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, Literal
from datetime import datetime
import uuid

class SecurityEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime
    source: str
    environment: Literal["dev", "staging", "prod"] = "prod"
    severity: Literal["low", "medium", "high", "critical"] = "medium"
    category: str
    action: str
    actor: Dict[str, Any]
    target: Optional[Dict[str, Any]] = None
    ip: Optional[str] = None
    user_agent: Optional[str] = None
    metadata: Dict[str, Any] = {}
   ``` 
## Step 2: Docker compose setup


Create `docker-compose.yml`:
```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: siem
      POSTGRES_PASSWORD: siem_pass
      POSTGRES_DB: siem_events
    ports:
      - "5432:5432"

  api:
    image: python:3.11-slim
    working_dir: /app
    volumes:
      - ./app:/app
    command: bash -lc "pip install fastapi uvicorn psycopg[binary] pydantic && uvicorn main:app --host 0.0.0.0 --port 8000"
    environment:
      DATABASE_URL: postgresql://siem:siem_pass@db:5432/siem_events
      INGEST_API_KEY: "change-me"
    ports:
      - "8000:8000"
    depends_on:
      - db
```
Run
```bash
docker compose up -d
docker compose ps
```
![Docker services running](/img/seim/docker.png)

## Step 3: Database initialization

Create `app/db.py`:
```python
import os
import psycopg

DATABASE_URL = os.environ["DATABASE_URL"]

def get_conn():
    return psycopg.connect(DATABASE_URL)

def init_db():
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
            CREATE TABLE IF NOT EXISTS events (
              event_id TEXT PRIMARY KEY,
              timestamp TIMESTAMPTZ NOT NULL,
              source TEXT NOT NULL,
              environment TEXT NOT NULL,
              severity TEXT NOT NULL,
              category TEXT NOT NULL,
              action TEXT NOT NULL,
              actor JSONB NOT NULL,
              target JSONB,
              ip TEXT,
              user_agent TEXT,
              metadata JSONB NOT NULL,
              received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
              request_id TEXT,
              idempotency_key TEXT
            );
            """)
```
## Step 4: API key authentication

Create `app/auth.py`:
```python
import os
from fastapi import Header, HTTPException

API_KEY = os.environ.get("INGEST_API_KEY")

def require_api_key(x_api_key: str = Header(default="")):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key.")
```
## Step 5: Rate limiting

Create `app/rate_limit.py`:
```python
import time
from fastapi import HTTPException

WINDOW_SEC = 60
MAX_REQ = 60
_hits = {}

def rate_limit(key: str):
    now = time.time()
    window_start, count = _hits.get(key, (now, 0))

    if now - window_start > WINDOW_SEC:
        window_start, count = now, 0

    count += 1
    _hits[key] = (window_start, count)

    if count > MAX_REQ:
        raise HTTPException(status_code=429, detail="Rate limit exceeded.")
```
## Step 6: API implementation
Create `app/main.py`:
```python
from fastapi import FastAPI, Depends, Header, HTTPException
from typing import List, Optional
import uuid

from schemas import SecurityEvent
from db import init_db, get_conn
from auth import require_api_key
from rate_limit import rate_limit

app = FastAPI(title="Security Event Ingestion API")

@app.on_event("startup")
def startup():
    init_db()

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

@app.post("/v1/events")
def ingest_event(
    event: SecurityEvent,
    _auth=Depends(require_api_key),
    x_request_id: Optional[str] = Header(default=None),
    idempotency_key: Optional[str] = Header(default=None),
):
    rate_limit("global")
    request_id = x_request_id or str(uuid.uuid4())

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO events (
                  event_id, timestamp, source, environment,
                  severity, category, action, actor,
                  target, ip, user_agent, metadata,
                  request_id, idempotency_key
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                ON CONFLICT (event_id) DO NOTHING
            """, (
                event.event_id,
                event.timestamp,
                event.source,
                event.environment,
                event.severity,
                event.category,
                event.action,
                event.actor,
                event.target,
                event.ip,
                event.user_agent,
                event.metadata,
                request_id,
                idempotency_key
            ))

    return {"status": "ok", "event_id": event.event_id, "request_id": request_id}
```
# API reference

## Base URL
http://localhost:8000

---

## Authentication

All ingestion endpoints require the following header:
X-API-Key: <your_api_key>


Requests without a valid API key return:

- **401 Unauthorized**

---

## POST /v1/events

Ingest a single security event.

### Success response

```json
{
  "status": "ok",
  "event_id": "uuid",
  "request_id": "req-id"
}
```
## Tutorial: Ingest your first event

### Step 1: Set your API key

```bash
export API_KEY="change-me"
```
### Step 2: Send a request
```curl
curl -X POST http://localhost:8000/v1/events \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "timestamp":"2026-02-17T10:10:10Z",
    "source":"auth-service",
    "environment":"prod",
    "severity":"high",
    "category":"auth",
    "action":"login_failed",
    "actor":{"type":"user","id":"u-123"},
    "metadata":{}
  }'
  ```
  ## Error model

| Status code | Meaning |
|-------------|----------|
| 401 | Unauthorized |
| 422 | Validation Error |
| 429 | Rate Limit Exceeded |

---

## OpenAPI snippet

```yaml
paths:
  /v1/events:
    post:
      summary: Ingest a security event
      responses:
        '200':
          description: Event ingested successfully
        '401':
          description: Unauthorized
```
## Operational considerations

| Step | Description |
|-----------|--------------|
| Use idempotency keys for safe retries | Prevents duplicate event ingestion if the client retries the same request due to network failures or timeouts. Ensures safe reprocessing without creating multiple records. |
| Log request IDs for traceability | Enables end-to-end request tracking across systems, making debugging, auditing, and incident investigation easier. |
| Apply proper indexing for high-volume environments | Improves query performance for frequently filtered fields (e.g., timestamp, category, severity), ensuring efficient searches at scale. |
| Replace in-memory rate limiting with Redis in production | Moves rate limiting to a distributed store so limits are enforced consistently across multiple API instances in horizontally scaled environments. |
