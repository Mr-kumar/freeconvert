"""
Download API endpoints.
Logic: Generate presigned download URLs for completed jobs.
"""

import logging
from typing import Dict, Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.core.database import get_db_session
from app.core.s3 import s3_client
from app.models.job import Job, JobStatus

logger = logging.getLogger(__name__)
router = APIRouter()


class DownloadResponse(BaseModel):
    """Response model for download URL."""
    download_url: str
    expires_in: int
    file_name: str


@router.get("/{job_id}", response_model=DownloadResponse)
async def get_download_url(job_id: str) -> DownloadResponse:
    """
    Generate a presigned download URL for a completed job.
    
    Args:
        job_id: UUID of the job
        
    Returns:
        DownloadResponse: Download URL and metadata
        
    Raises:
        HTTPException: If job not found, not completed, or no result
    """
    db = get_db_session()
    
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )
        
        if job.status != JobStatus.COMPLETED:
            raise HTTPException(
                status_code=400,
                detail=f"Job not completed. Current status: {job.status.value}"
            )
        
        if not job.result_key:
            raise HTTPException(
                status_code=404,
                detail="No result file available for this job"
            )
        
        # Generate presigned download URL
        download_data = s3_client.generate_presigned_download_url(
            file_key=job.result_key,
            expires_in=3600  # 1 hour
        )
        
        # Generate appropriate filename based on tool type
        if job.tool_type == "merge":
            file_name = "merged.pdf"
        elif job.tool_type == "compress":
            file_name = "compressed.jpg"
        elif job.tool_type == "reduce":
            file_name = "reduced.pdf"
        elif job.tool_type == "jpg-to-pdf":
            file_name = "converted.pdf"
        else:
            file_name = "result"
        
        logger.info(f"Generated download URL for job {job_id}: {job.result_key}")
        
        return DownloadResponse(
            download_url=download_data["download_url"],
            expires_in=download_data["expires_in"],
            file_name=file_name
        )
        
    finally:
        db.close()
