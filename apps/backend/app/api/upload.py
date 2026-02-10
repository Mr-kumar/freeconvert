"""
Upload API endpoints.
Logic: Provides presigned URLs for direct-to-S3 uploads.
"""

import uuid
import logging
import re
from typing import Dict, Any

from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.s3 import s3_client
from app.core.config import settings
from app.core.database import get_db_session

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


class PresignedURLRequest(BaseModel):
    """Request model for presigned URL generation."""
    file_name: str = Field(..., min_length=1, max_length=255, regex=r'^[a-zA-Z0-9._-]+$')
    file_type: str = Field(..., regex=r'^(application|image)\/[a-zA-Z0-9._-]+$')
    file_size: int = Field(..., gt=0, le=settings.max_file_size_mb * 1024 * 1024)
    
    class Config:
        str_strip_whitespace = True


class PresignedURLResponse(BaseModel):
    """Response model for presigned URL."""
    upload_url: str
    file_key: str
    bucket: str
    region: str
    expires_in: int
    max_file_size: int


class ConfirmUploadRequest(BaseModel):
    """Request model for confirming upload."""
    file_key: str


class ConfirmUploadResponse(BaseModel):
    """Response model for confirm upload."""
    status: str
    file_key: str
    file_size: int
    last_modified: str
    session_id: str


class CleanupUploadRequest(BaseModel):
    """Request model for cleaning up upload."""
    file_key: str


@router.post("/presigned-url", response_model=PresignedURLResponse)
@limiter.limit("5/minute")
async def get_presigned_url(
    request: PresignedURLRequest,
    http_request: Request
) -> PresignedURLResponse:
    """
    Generate a presigned URL for direct-to-S3 upload.
    
    Args:
        request: Upload request with file details
        http_request: HTTP request for session tracking
        
    Returns:
        PresignedURLResponse: Upload URL and metadata
        
    Raises:
        HTTPException: If URL generation fails
    """
    try:
        # Validate file size
        max_file_size_bytes = settings.max_file_size_mb * 1024 * 1024
        if request.file_size > max_file_size_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File size {request.file_size} exceeds maximum allowed size {max_file_size_bytes} bytes"
            )
        
        # Validate file type
        allowed_types = set(settings.allowed_file_types)
        
        if request.file_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type {request.file_type} not allowed. Allowed types: {allowed_types}"
            )
        
        # Generate unique file key
        session_id = http_request.cookies.get("session_id", "anonymous")
        
        # Sanitize filename to handle special characters
        safe_filename = re.sub(r'[^\w\-_\.]', '', request.file_name)
        file_key = f"uploads/{session_id}/{uuid.uuid4()}-{safe_filename}"
        
        # Generate presigned upload URL
        presigned_data = s3_client.generate_presigned_upload_url(
            file_key=file_key,
            file_type=request.file_type
        )
        
        logger.info(f"Generated presigned URL for session {session_id}: {file_key}")
        
        return PresignedURLResponse(
            upload_url=presigned_data["upload_url"],
            file_key=presigned_data["file_key"],
            bucket=presigned_data["bucket"],
            region=settings.aws_region,  # Use settings.aws_region instead of presigned_data["region"]
            expires_in=presigned_data["expires_in"],
            max_file_size=(settings.max_file_size_mb * 1024 * 1024)  # Use correct setting name and convert to bytes
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to generate presigned URL: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate upload URL"
        )


@router.post("/confirm-upload", response_model=ConfirmUploadResponse)
async def confirm_upload(
    request: ConfirmUploadRequest,
    http_request: Request
) -> ConfirmUploadResponse:
    """
    Confirm that a file has been successfully uploaded to S3.
    
    Args:
        request: Request body containing file_key
        http_request: HTTP request for session tracking
        
    Returns:
        ConfirmUploadResponse: Confirmation response
        
    Raises:
        HTTPException: If validation fails
    """
    try:
        file_key = request.file_key
        logger.info(f"Confirming upload for file: {file_key}")
        
        # Verify file exists in S3
        exists = s3_client.file_exists(file_key)
        
        if not exists:
            logger.warning(f"File not found in S3: {file_key}")
            raise HTTPException(
                status_code=404,
                detail=f"File not found in S3: {file_key}"
            )
        
        # Get file info
        try:
            file_info = s3_client.get_file_info(file_key)
        except ValueError as e:
            logger.error(f"Failed to get file info: {str(e)}")
            raise HTTPException(
                status_code=404,
                detail=str(e)
            )
        
        session_id = http_request.cookies.get("session_id", "anonymous")
        
        logger.info(f"Upload confirmed for session {session_id}: {file_key} (size: {file_info['size']} bytes)")
        
        return ConfirmUploadResponse(
            status="confirmed",
            file_key=file_key,
            file_size=file_info["size"],
            last_modified=file_info["last_modified"],
            session_id=session_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to confirm upload: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to confirm upload: {str(e)}"
        )


@router.delete("/cleanup-upload")
async def cleanup_upload(
    request: CleanupUploadRequest,
    http_request: Request
) -> Dict[str, str]:
    """
    Clean up an uploaded file (useful for failed operations).
    
    Args:
        request: Request body containing file_key
        http_request: HTTP request for session tracking
        
    Returns:
        Dict: Cleanup response
    """
    try:
        file_key = request.file_key
        logger.info(f"Cleaning up file: {file_key}")
        
        # Delete file from S3
        s3_client.delete_file(file_key)
        
        session_id = http_request.cookies.get("session_id", "anonymous")
        logger.info(f"Cleaned up upload for session {session_id}: {file_key}")
        
        return {
            "status": "deleted",
            "file_key": file_key,
            "message": "File successfully deleted"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to cleanup upload: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete file: {str(e)}"
        )


@router.get("/upload-status/{file_key}")
async def get_upload_status(file_key: str) -> Dict[str, Any]:
    """
    Get the upload status of a file.
    
    Args:
        file_key: S3 key of the file
        
    Returns:
        Dict: Upload status
    """
    try:
        exists = s3_client.file_exists(file_key)
        
        if not exists:
            return {
                "status": "not_found",
                "file_key": file_key
            }
        
        file_info = s3_client.get_file_info(file_key)
        
        return {
            "status": "uploaded",
            "file_key": file_key,
            "file_size": file_info["size"],
            "last_modified": file_info["last_modified"]
        }
        
    except Exception as e:
        logger.error(f"Failed to get upload status: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get upload status"
        )
