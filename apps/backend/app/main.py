"""
FastAPI entry point.
Logic: Creates app, includes API routers (upload, job, merge, compress, reduce, download),
CORS, lifespan. No business logic here.
"""

import uuid
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from app.core.config import settings
from app.core.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logging.info("Starting FreeConvert backend...")
    init_db()
    logging.info("Database initialized")
    
    yield
    
    # Shutdown
    logging.info("Shutting down FreeConvert backend...")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="FreeConvert backend for file processing with AWS integration",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.middleware("http")
async def ensure_session_id(request: Request, call_next):
    """
    Anonymous session middleware.
    Ensures every visitor has a session_id cookie for tracking.
    """
    # Check for session_id in cookies
    session_id = request.cookies.get("session_id")
    
    # If not present, this is a new anonymous "guest"
    if not session_id:
        session_id = str(uuid.uuid4())
        logging.info(f"Created new session: {session_id}")
    
    # Call the next middleware/route
    response = await call_next(request)
    
    # Attach the session_id to the response so the browser saves it
    response.set_cookie(
        key="session_id", 
        value=session_id, 
        httponly=True, 
        samesite="lax",
        max_age=60 * 60 * 24 * 7  # 1 week
    )
    
    return response


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "FreeConvert Backend API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "freeconvert-backend"}


# Include API routers
from app.api import upload
app.include_router(upload.router, prefix="/api/v1/upload", tags=["upload"])

# TODO: Add other routers when implemented
# from app.api import job, merge, compress, reduce, download
# app.include_router(job.router, prefix="/api/v1", tags=["job"])
# app.include_router(merge.router, prefix="/api/v1", tags=["merge"])
# app.include_router(compress.router, prefix="/api/v1", tags=["compress"])
# app.include_router(reduce.router, prefix="/api/v1", tags=["reduce"])
# app.include_router(download.router, prefix="/api/v1", tags=["download"])
