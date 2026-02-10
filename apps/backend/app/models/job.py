"""
Job model for tracking file processing tasks.
Logic: SQLAlchemy model with job tracking, status management, and S3 integration.
"""

from datetime import datetime
from typing import Optional
from enum import Enum
import uuid

from sqlalchemy import Column, String, DateTime, JSON, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.core.database import Base


class JobStatus(str, Enum):
    """Job status enumeration."""
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class ToolType(str, Enum):
    """Tool type enumeration."""
    MERGE = "merge"
    COMPRESS = "compress"
    REDUCE = "reduce"
    JPG_TO_PDF = "jpg-to-pdf"


class Job(Base):
    """Job model for tracking file processing tasks."""
    
    __tablename__ = "jobs"
    
    # Primary key - use string UUID instead of uuid_generate_v4()
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Job metadata
    tool_type = Column(String(50), nullable=False, index=True)
    status = Column(String(20), nullable=False, default="PENDING", index=True)  # Use plain string
    session_id = Column(String(255), nullable=False, index=True)
    
    # File tracking
    input_files = Column(JSON, nullable=False)  # List of input file keys from S3
    result_key = Column(String(500), nullable=True)  # S3 key for processed file
    
    # Processing details
    compression_level = Column(String(10), nullable=True)  # For reduce tool: low, medium, high
    error_message = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Metadata
    file_count = Column(Integer, default=1)  # Number of input files
    original_size_mb = Column(Integer, nullable=True)  # Original file size in MB
    result_size_mb = Column(Integer, nullable=True)  # Result file size in MB
    
    def __repr__(self) -> str:
        return f"<Job(id={self.id}, tool_type={self.tool_type}, status={self.status})>"
    
    def to_dict(self) -> dict:
        """Convert job to dictionary for API responses."""
        return {
            "id": str(self.id),
            "tool_type": self.tool_type,
            "status": self.status,
            "session_id": self.session_id,
            "input_files": self.input_files,
            "result_key": self.result_key,
            "compression_level": self.compression_level,
            "error_message": self.error_message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "file_count": self.file_count,
            "original_size_mb": self.original_size_mb,
            "result_size_mb": self.result_size_mb,
        }
