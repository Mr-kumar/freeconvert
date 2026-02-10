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
    """Initialize database using migrations instead of auto-creation."""
    try:
        # Run alembic migrations instead of create_all
        import os
        import subprocess
        
        # Change to the backend directory
        os.chdir("/opt/render/project/src/apps/backend")
        
        # Run alembic upgrade head
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            print(f"Alembic migration failed: {result.stderr}")
            # Fallback to create_all if migration fails
            from app.models import job  # Import all models
            Base.metadata.create_all(bind=engine)
            print("Fallback: Created tables using create_all")
        else:
            print("Database migrations completed successfully")
            
    except Exception as e:
        print(f"Database initialization error: {e}")
        # Fallback to create_all
        from app.models import job  # Import all models
        Base.metadata.create_all(bind=engine)
        print("Fallback: Created tables using create_all")


def get_db_session() -> Session:
    """
    Get a database session (for background tasks).
    
    Returns:
        Session: Database session
    """
    return SessionLocal()
