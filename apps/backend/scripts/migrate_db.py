#!/usr/bin/env python3
"""
Standalone database migration script.
Creates the jobs table directly without Alembic dependencies.
"""

import os
import sys
from sqlalchemy import create_engine, text

# Database URL from environment or command line
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Delta$77Stone@freeconvert-db.cpcmw4iy4079.eu-north-1.rds.amazonaws.com:5432/freeconvert")

def create_jobs_table():
    """Create the jobs table and indexes."""
    
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    # SQL to create the jobs table
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(255) PRIMARY KEY,
        session_id VARCHAR(255),
        tool_type VARCHAR(20) NOT NULL CHECK (tool_type IN ('MERGE', 'COMPRESS', 'REDUCE', 'JPG_TO_PDF')),
        status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
        input_files JSONB,
        result_key VARCHAR(500),
        error_message TEXT,
        compression_level VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE
    );
    """
    
    # SQL to create indexes
    create_indexes_sql = [
        "CREATE INDEX IF NOT EXISTS ix_jobs_session_id ON jobs(session_id);",
        "CREATE INDEX IF NOT EXISTS ix_jobs_status ON jobs(status);",
        "CREATE INDEX IF NOT EXISTS ix_jobs_created_at ON jobs(created_at);",
        "CREATE INDEX IF NOT EXISTS ix_jobs_tool_type ON jobs(tool_type);"
    ]
    
    try:
        with engine.connect() as conn:
            print("Creating jobs table...")
            conn.execute(text(create_table_sql))
            
            print("Creating indexes...")
            for index_sql in create_indexes_sql:
                conn.execute(text(index_sql))
            
            conn.commit()
            print("✅ Database migration completed successfully!")
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    create_jobs_table()
