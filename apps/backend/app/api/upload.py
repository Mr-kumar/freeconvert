"""
Upload API endpoints.
Logic: Provides presigned URLs for direct-to-S3 uploads.
"""

import uuid
import logging
from typing import Dict, Any

from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel

from app.core.s3 import s3_client
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


class PresignedURLRequest(BaseModel):
    """Request model for presigned URL generation."""
    file_name: str
    file_type: str
    file_size: int  # in bytes


class PresignedURLResponse(BaseModel):
    """Response model for presigned URL."""
    upload_url: str
    file_key: str
    bucket: str
    region: str
    expires_in: int
    max_file_size: int


@router.post("/presigned-url", response_model=PresignedURLResponse)
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
        allowed_types = {
            'application/pdf',
            'image/jpeg', 'image/jpg',
            'image/png',
            'image/webp',
            'image/heic', 'image/heif'
        }
        
        if request.file_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type {request.file_type} not allowed. Allowed types: {allowed_types}"
            )
        
        # Generate unique file key
        session_id = http_request.cookies.get("session_id", "anonymous")
        
        # Sanitize filename to handle special characters
        import re
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


@router.post("/confirm-upload")
async def confirm_upload(
    request: Dict[str, str],
    http_request: Request
) -> Dict[str, Any]:
    """
    Confirm that a file has been successfully uploaded to S3.
    
    Args:
        request: Request body containing file_key
        http_request: HTTP request for session tracking
        
    Returns:
        Dict: Confirmation response
    """
    try:
        # Log the raw request for debugging
        import json
        logger.info(f"Raw request type: {type(request)}")
        logger.info(f"Raw request content: {request}")
        
        # Try multiple ways to extract file_key
        file_key = None
        
        if isinstance(request, dict):
            file_key = request.get("file_key")
            logger.info(f"Extracted file_key from dict: {file_key}")
        elif hasattr(request, 'json'):
            try:
                json_data = await request.json()
                file_key = json_data.get("file_key")
                logger.info(f"Extracted file_key from JSON: {file_key}")
            except Exception as e:
                logger.error(f"Failed to parse JSON: {e}")
        elif hasattr(request, 'form'):
            form_data = await request.form()
            file_key = form_data.get("file_key")
            logger.info(f"Extracted file_key from form: {file_key}")
        
        if not file_key:
            logger.error("file_key is missing from all request formats")
            raise HTTPException(
                status_code=422,
                detail="file_key is required"
            )
        
        # Verify file exists in S3
        exists = s3_client.file_exists(file_key)
        
        if not exists:
            raise HTTPException(
                status_code=404,
                detail="File not found in S3"
            )
        
        # Get file info
        file_info = s3_client.get_file_info(file_key)
        session_id = http_request.cookies.get("session_id", "anonymous")
        
        logger.info(f"Upload confirmed for session {session_id}: {file_key}")
        
        return {
            "status": "confirmed",
            "file_key": file_key,
            "file_size": file_info["size"],
            "last_modified": file_info["last_modified"],
            "session_id": session_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to confirm upload: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to confirm upload"
        )


@router.delete("/cleanup-upload")
async def cleanup_upload(
    request: Dict[str, str],
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
        file_key = request.get("file_key")
        if not file_key:
            raise HTTPException(
                status_code=422,
                detail="file_key is required"
            )
        # Delete file from S3
        s3_client.delete_file(file_key)
        
        session_id = http_request.cookies.get("session_id", "anonymous")
        logger.info(f"Cleaned up upload for session {session_id}: {file_key}")
        
        return {
            "status": "deleted",
            "file_key": file_key,
            "message": "File successfully deleted"
        }
        
    except Exception as e:
        logger.error(f"Failed to cleanup upload: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to delete file"
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
