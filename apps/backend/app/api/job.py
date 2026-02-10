"""
Job API endpoints.
Logic: Start jobs, check status, get download URLs, and manage job lifecycle.
"""

import uuid
import logging
from typing import List, Dict, Any, Optional, Union
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.database import get_db_session
from app.core.s3 import s3_client
from app.models.job import Job, JobStatus, ToolType
from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


class StartJobRequest(BaseModel):
    """Request model for starting a job."""
    tool_type: Union[ToolType, str] = Field(..., pattern=r'^(merge|compress|reduce|jpg-to-pdf)$')
    file_keys: List[str] = Field(..., min_items=1, max_items=20)
    compression_level: Optional[str] = Field("medium", pattern=r'^(low|medium|high)$')
    
    class Config:
        str_strip_whitespace = True


class StartJobResponse(BaseModel):
    """Response model for starting a job."""
    job_id: str
    status: str
    message: str


class JobStatusResponse(BaseModel):
    """Response model for job status."""
    id: str
    status: JobStatus
    tool_type: ToolType
    input_files: List[str]
    result_key: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    compression_level: Optional[str] = None


class DownloadResponse(BaseModel):
    """Response model for download URL."""
    download_url: str
    expires_in: int
    file_name: str


@router.post("/start", response_model=StartJobResponse)
@limiter.limit("10/minute")
async def start_job(
    request: StartJobRequest,
    http_request: Request
) -> StartJobResponse:
    """
    Start a new background job for file processing.
    
    Args:
        request: Job request with tool type and files
        http_request: HTTP request for session tracking
        
    Returns:
        StartJobResponse: Job ID and status
        
    Raises:
        HTTPException: If job creation fails
    """
    db = get_db_session()
    
    try:
        # Get the string value directly (e.g., "merge")
        tool_type_str = request.tool_type.value if hasattr(request.tool_type, 'value') else str(request.tool_type)
        
        # Validate file keys exist in S3
        for file_key in request.file_keys:
            if not s3_client.file_exists(file_key):
                raise HTTPException(status_code=404, detail=f"File not found: {file_key}")
        
        job_id = str(uuid.uuid4())
        session_id = http_request.cookies.get("session_id", "anonymous")
        
        # Create job record using strings for String columns
        job = Job(
            id=job_id,
            session_id=session_id,
            tool_type=tool_type_str,  # Use plain string
            status=JobStatus.PENDING.value,  # Use plain string "PENDING"
            input_files=request.file_keys,
            compression_level=request.compression_level
        )
        
        db.add(job)
        db.commit()
        
        # Start Celery task
        # FIX: Explicitly name tasks to match tasks.py
        if tool_type_str == "merge":
            celery_app.send_task("app.workers.tasks.merge_pdf_task", args=[job_id, request.file_keys])
        elif tool_type_str == "compress":
            celery_app.send_task("app.workers.tasks.compress_image_task", args=[job_id, request.file_keys, request.compression_level])
        elif tool_type_str == "reduce":
            if len(request.file_keys) != 1:
                raise HTTPException(status_code=400, detail="Reduce tool requires exactly one file")
            # FIX: Use 'reduce_pdf_task' instead of 'reduce_task'
            celery_app.send_task("app.workers.tasks.reduce_pdf_task", args=[job_id, request.file_keys[0], request.compression_level])
        elif tool_type_str == "jpg-to-pdf":
            celery_app.send_task("app.workers.tasks.jpg_to_pdf_task", args=[job_id, request.file_keys])
        
        logger.info(f"Started job {job_id} for session {session_id}: {tool_type_str}")
        
        return StartJobResponse(
            job_id=job_id,
            status="started",
            message=f"Job started successfully for {tool_type_str}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to start job: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to start job"
        )
    finally:
        db.close()


@router.get("/{job_id}/status", response_model=JobStatusResponse)
async def get_job_status(job_id: str) -> JobStatusResponse:
    """
    Get the status of a job.
    
    Args:
        job_id: UUID of the job
        
    Returns:
        JobStatusResponse: Current job status
        
    Raises:
        HTTPException: If job not found
    """
    db = get_db_session()
    
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )
        
        return JobStatusResponse(
            id=job.id,
            status=job.status,
            tool_type=job.tool_type,
            input_files=job.input_files,
            result_key=job.result_key,
            error_message=job.error_message,
            created_at=job.created_at,
            completed_at=job.completed_at,
            compression_level=job.compression_level
        )
        
    finally:
        db.close()


@router.get("/my-jobs", response_model=List[JobStatusResponse])
async def get_user_jobs(http_request: Request) -> List[JobStatusResponse]:
    """
    Get all jobs for the current user (based on session).
    
    Args:
        http_request: HTTP request for session tracking
        
    Returns:
        List[JobStatusResponse]: List of user's jobs
    """
    db = get_db_session()
    
    try:
        session_id = http_request.cookies.get("session_id", "anonymous")
        
        jobs = db.query(Job).filter(
            Job.session_id == session_id
        ).order_by(Job.created_at.desc()).limit(50).all()
        
        return [
            JobStatusResponse(
                id=job.id,
                status=job.status,
                tool_type=job.tool_type,
                input_files=job.input_files,
                result_key=job.result_key,
                error_message=job.error_message,
                created_at=job.created_at,
                completed_at=job.completed_at,
                compression_level=job.compression_level
            )
            for job in jobs
        ]
        
    finally:
        db.close()


@router.delete("/{job_id}")
async def delete_job(job_id: str, http_request: Request) -> Dict[str, str]:
    """
    Delete a job and its associated files.
    
    Args:
        job_id: UUID of the job
        http_request: HTTP request for session tracking
        
    Returns:
        Dict: Deletion response
        
    Raises:
        HTTPException: If job not found or unauthorized
    """
    db = get_db_session()
    
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )
        
        # Check if job belongs to current session
        session_id = http_request.cookies.get("session_id", "anonymous")
        if job.session_id != session_id:
            raise HTTPException(
                status_code=403,
                detail="Unauthorized to delete this job"
            )
        
        # Delete result file from S3 if exists
        if job.result_key:
            try:
                s3_client.delete_file(job.result_key)
                logger.info(f"Deleted result file: {job.result_key}")
            except Exception as e:
                logger.warning(f"Failed to delete result file {job.result_key}: {e}")
        
        # Delete job from database
        db.delete(job)
        db.commit()
        
        logger.info(f"Deleted job {job_id} for session {session_id}")
        
        return {
            "status": "deleted",
            "job_id": job_id,
            "message": "Job deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to delete job {job_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to delete job"
        )
    finally:
        db.close()
