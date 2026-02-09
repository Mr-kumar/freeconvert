"""
Migration API endpoint to run database migrations.
"""

from fastapi import APIRouter, HTTPException
from sqlalchemy import create_engine, text
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/run-migration")
async def run_migration() -> dict:
    """
    Run database migration to add missing columns.
    """
    try:
        engine = create_engine(settings.database_url)
        
        with engine.connect() as conn:
            # Add file_count column if it doesn't exist
            conn.execute(text("""
                ALTER TABLE jobs 
                ADD COLUMN IF NOT EXISTS file_count INTEGER DEFAULT 1;
            """))
            
            # Add original_size_mb column if it doesn't exist
            conn.execute(text("""
                ALTER TABLE jobs 
                ADD COLUMN IF NOT EXISTS original_size_mb INTEGER;
            """))
            
            # Add result_size_mb column if it doesn't exist
            conn.execute(text("""
                ALTER TABLE jobs 
                ADD COLUMN IF NOT EXISTS result_size_mb INTEGER;
            """))
            
            conn.commit()
            
        return {
            "status": "success",
            "message": "Database migration completed successfully"
        }
        
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Migration failed: {str(e)}"
        )
