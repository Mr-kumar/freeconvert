#!/usr/bin/env python3
"""
Test database connectivity
"""

import os
import sys
import psycopg2
from psycopg2 import OperationalError

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Delta$77Stone@freeconvert-db.cpcmw4iy4079.eu-north-1.rds.amazonaws.com:5432/freeconvert")

def test_connection():
    try:
        print("Testing database connection...")
        print(f"Database URL: {DATABASE_URL}")
        
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Test query
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        
        print("✅ Database connection successful!")
        print(f"PostgreSQL version: {version[0]}")
        
        # Check if table exists
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'jobs';
        """)
        
        table_exists = cursor.fetchone()
        if table_exists:
            print("✅ Jobs table already exists")
        else:
            print("ℹ️  Jobs table does not exist - needs migration")
        
        cursor.close()
        conn.close()
        
    except OperationalError as e:
        print(f"❌ Database connection failed: {e}")
        print("\n🔧 Troubleshooting steps:")
        print("1. Check if the database is publicly accessible")
        print("2. Verify security group allows your IP address")
        print("3. Check if VPC has proper routing")
        print("4. Ensure database is in 'available' state")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    if test_connection():
        print("\n🚀 Ready to run migration!")
    else:
        print("\n⚠️  Fix connection issues before running migration")
