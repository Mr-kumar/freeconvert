#!/bin/bash

# Run database migrations
cd apps/backend
alembic upgrade head

echo "Database migrations completed!"
