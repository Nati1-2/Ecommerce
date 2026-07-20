"""
E-Commerce Recommendation Service
AI-ready recommendation engine using Python FastAPI.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import logging
from contextlib import asynccontextmanager

from .database import connect_db, close_db
from .routes import router
from .services.event_consumer import start_consumer, stop_consumer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [recommendation-service] %(levelname)s: %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("Starting Recommendation Service...")
    await connect_db()
    await start_consumer()
    logger.info("Recommendation Service started successfully")
    yield
    logger.info("Shutting down Recommendation Service...")
    await stop_consumer()
    await close_db()


app = FastAPI(
    title="E-Commerce Recommendation Service",
    description="AI-ready product recommendation engine",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="/api/recommendations")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "recommendation-service"}


@app.get("/metrics")
async def metrics():
    return {"status": "ok"}
