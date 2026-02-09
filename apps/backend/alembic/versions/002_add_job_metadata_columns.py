"""Add job metadata columns

Revision ID: 002
Revises: 001
Create Date: 2026-02-09 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add missing columns to jobs table
    op.add_column('jobs', sa.Column('file_count', sa.Integer(), nullable=True, server_default='1'))
    op.add_column('jobs', sa.Column('original_size_mb', sa.Integer(), nullable=True))
    op.add_column('jobs', sa.Column('result_size_mb', sa.Integer(), nullable=True))


def downgrade() -> None:
    # Remove columns
    op.drop_column('jobs', 'result_size_mb')
    op.drop_column('jobs', 'original_size_mb')
    op.drop_column('jobs', 'file_count')
