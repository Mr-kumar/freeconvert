#!/usr/bin/env python3
"""
Setup Neon Database - Run migrations and verify tables
"""

import sys
import os
from sqlalchemy import create_engine, text, inspect
from app.core.config import settings

def setup_neon_database():
    """Setup Neon database with all required tables."""
    
    print("🔍 Connecting to Neon database...")
    
    try:
        # Create engine
        engine = create_engine(settings.database_url)
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Connected to PostgreSQL: {version[:50]}...")
        
        print("\n📋 Checking current tables...")
        
        # Check existing tables
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Current tables: {tables}")
        
        # Run migrations
        print("\n🚀 Running Alembic migrations...")
        os.system("cd apps/backend && alembic upgrade head")
        
        # Verify tables after migration
        print("\n📊 Verifying tables after migration...")
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables after migration: {tables}")
        
        # Check jobs table structure
        if 'jobs' in tables:
            print("\n🔍 Checking jobs table structure...")
            columns = inspector.get_columns('jobs')
            print("Jobs table columns:")
            for col in columns:
                print(f"  - {col['name']}: {col['type']}")
        
        print("\n✅ Neon database setup complete!")
        return True
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        return False

if __name__ == "__main__":
    success = setup_neon_database()
    sys.exit(0 if success else 1)
