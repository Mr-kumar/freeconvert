"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2024-02-09 01:25:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create jobs table
    op.create_table('jobs',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('session_id', sa.String(255), nullable=False),
        sa.Column('tool_type', sa.Enum('MERGE', 'COMPRESS', 'REDUCE', 'JPG_TO_PDF', name='tooltype'), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', name='jobstatus'), nullable=False),
        sa.Column('input_files', sa.JSON(), nullable=False),
        sa.Column('result_key', sa.String(500), nullable=True),
        sa.Column('error_message', sa.String(), nullable=True),
        sa.Column('compression_level', sa.String(10), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index('ix_jobs_session_id', 'jobs', ['session_id'])
    op.create_index('ix_jobs_status', 'jobs', ['status'])
    op.create_index('ix_jobs_created_at', 'jobs', ['created_at'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_jobs_created_at', table_name='jobs')
    op.drop_index('ix_jobs_status', table_name='jobs')
    op.drop_index('ix_jobs_session_id', table_name='jobs')
    
    # Drop table
    op.drop_table('jobs')
