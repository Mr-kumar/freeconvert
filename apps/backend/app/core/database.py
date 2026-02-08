"""
Database configuration and session management.
Logic: SQLAlchemy engine setup with connection pooling and session management for AWS RDS.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool

from app.core.config import get_database_url, settings

# Create SQLAlchemy engine with optimized settings for AWS RDS
engine = create_engine(
    get_database_url(),
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=3600,  # Recycle connections every hour
    echo=settings.debug,  # Enable SQL logging in debug mode
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Create base class for declarative models
Base = declarative_base()


def get_db() -> Session:
    """
    Dependency function to get database session.
    
    Yields:
        Session: Database session with automatic cleanup
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Initialize database tables."""
    from app.models import job  # Import all models
    
    Base.metadata.create_all(bind=engine)


def get_db_session() -> Session:
    """
    Get a database session (for background tasks).
    
    Returns:
        Session: Database session
    """
    return SessionLocal()
