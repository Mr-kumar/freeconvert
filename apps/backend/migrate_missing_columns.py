#!/usr/bin/env python3
"""
Migration script to add missing columns to jobs table.
"""

import sys
import os
from sqlalchemy import create_engine, text
from app.core.config import settings

def add_missing_columns():
    """Add missing columns to jobs table."""
    engine = create_engine(settings.database_url)
    
    try:
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
            print("✅ Successfully added missing columns to jobs table")
            
    except Exception as e:
        print(f"❌ Error adding columns: {e}")
        sys.exit(1)

if __name__ == "__main__":
    add_missing_columns()
