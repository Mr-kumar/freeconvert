"""
Job API endpoints.
Logic: Start jobs, check status, get download URLs, and manage job lifecycle.
"""

import uuid
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel

from app.core.database import get_db_session
from app.core.s3 import s3_client
from app.models.job import Job, JobStatus, ToolType
from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)
router = APIRouter()


class StartJobRequest(BaseModel):
    """Request model for starting a job."""
    tool_type: ToolType
    file_keys: List[str]
    compression_level: Optional[str] = "medium"


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
        # Validate file keys exist in S3
        for file_key in request.file_keys:
            if not s3_client.file_exists(file_key):
                raise HTTPException(
                    status_code=404,
                    detail=f"File not found: {file_key}"
                )
        
        # Generate job ID
        job_id = str(uuid.uuid4())
        session_id = http_request.cookies.get("session_id", "anonymous")
        
        # Create job record
        job = Job(
            id=job_id,
            session_id=session_id,
            tool_type=request.tool_type,
            status=JobStatus.PENDING,
            input_files=request.file_keys,
            compression_level=request.compression_level
        )
        
        db.add(job)
        db.commit()
        
        # Start appropriate Celery task
        task_name = f"app.workers.tasks.{request.tool_type.value}_task"
        
        if request.tool_type == ToolType.MERGE:
            celery_app.send_task(task_name, args=[job_id, request.file_keys])
        elif request.tool_type == ToolType.COMPRESS:
            celery_app.send_task(task_name, args=[job_id, request.file_keys, request.compression_level])
        elif request.tool_type == ToolType.REDUCE:
            # Reduce task takes single file key
            if len(request.file_keys) != 1:
                raise HTTPException(
                    status_code=400,
                    detail="Reduce tool requires exactly one file"
                )
            celery_app.send_task(task_name, args=[job_id, request.file_keys[0], request.compression_level])
        elif request.tool_type == ToolType.JPG_TO_PDF:
            celery_app.send_task(task_name, args=[job_id, request.file_keys])
        
        logger.info(f"Started job {job_id} for session {session_id}: {request.tool_type.value}")
        
        return StartJobResponse(
            job_id=job_id,
            status="started",
            message=f"Job started successfully for {request.tool_type.value}"
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
