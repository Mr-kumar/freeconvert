"""
Celery tasks for background file processing.
Logic: Download files from S3, process with service libraries, upload results back to S3.
Optimized to use tempfile instead of memory for large files.
"""

import logging
import uuid
import tempfile
import os
from typing import List, Dict, Any, Optional
from datetime import datetime

from celery import current_task

from app.workers.celery_app import celery_app
from app.core.database import get_db_session
from app.core.s3 import s3_client
from app.models.job import Job, JobStatus, ToolType
from app.services.merge_service import MergeService
from app.services.compress_service import CompressService
from app.services.reduce_service import ReduceService

logger = logging.getLogger(__name__)


def _download_files_to_temp(file_keys: List[str]) -> List[str]:
    """
    Download files from S3 to temporary files on disk.
    
    Args:
        file_keys: List of S3 keys to download
        
    Returns:
        List[str]: List of temporary file paths
        
    Raises:
        ValueError: If download fails
    """
    temp_files = []
    
    try:
        for file_key in file_keys:
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_path = temp_file.name
            
            # Download file from S3 to temp file
            file_data = s3_client.download_file(file_key)
            if file_data:
                with open(temp_path, 'wb') as f:
                    f.write(file_data)
                temp_files.append(temp_path)
                logger.info(f"Downloaded {file_key} to {temp_path}")
            else:
                # Cleanup on failure
                for path in temp_files:
                    try:
                        os.unlink(path)
                    except:
                        pass
                raise ValueError(f"Failed to download file {file_key}")
    
    except Exception as e:
        # Cleanup on error
        for path in temp_files:
            try:
                os.unlink(path)
            except:
                pass
        raise e
    
    return temp_files


def _cleanup_temp_files(temp_files: List[str]):
    """
    Clean up temporary files.
    
    Args:
        temp_files: List of temporary file paths
    """
    for temp_path in temp_files:
        try:
            os.unlink(temp_path)
            logger.debug(f"Cleaned up temp file: {temp_path}")
        except Exception as e:
            logger.warning(f"Failed to cleanup temp file {temp_path}: {e}")


def _read_temp_files(temp_files: List[str]) -> List[bytes]:
    """
    Read temporary files into memory for processing.
    
    Args:
        temp_files: List of temporary file paths
        
    Returns:
        List[bytes]: File data
    """
    file_data_list = []
    
    for temp_path in temp_files:
        try:
            with open(temp_path, 'rb') as f:
                file_data = f.read()
            file_data_list.append(file_data)
        except Exception as e:
            logger.error(f"Failed to read temp file {temp_path}: {e}")
            raise e
    
    return file_data_list


@celery_app.task(bind=True, name="app.workers.tasks.merge_pdf_task")
def merge_pdf_task(self, job_id: str, file_keys: List[str]) -> Dict[str, Any]:
    """
    Background task to merge multiple PDF files.
    Optimized to use tempfile for memory efficiency.
    
    Args:
        job_id: UUID of the job
        file_keys: List of S3 keys for input files
        
    Returns:
        Dict containing task result
    """
    task = current_task
    db = get_db_session()
    temp_files = []
    
    try:
        # Update job status to processing
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job {job_id} not found")
        
        job.status = JobStatus.PROCESSING
        db.commit()
        
        # Download input files from S3 to temp files
        temp_files = _download_files_to_temp(file_keys)
        
        # Read temp files for processing (only when needed)
        input_files = _read_temp_files(temp_files)
        
        # Process merge
        merge_service = MergeService()
        result_data = merge_service.merge_pdfs(input_files)
        
        # Upload result to S3
        result_key = f"results/{job_id}/merged.pdf"
        success = s3_client.upload_file(result_data, result_key, "application/pdf")
        
        if success:
            # Update job with success
            job.status = JobStatus.COMPLETED
            job.result_key = result_key
            job.completed_at = datetime.utcnow()
            job.error_message = None
            db.commit()
            
            # Cleanup input files from S3
            s3_client.delete_files(file_keys)
            
            return {
                "status": "success",
                "result_key": result_key,
                "message": "PDF merge completed successfully"
            }
        else:
            raise Exception("Failed to upload merged file")
            
    except Exception as e:
        # Update job with error
        try:
            job.status = JobStatus.FAILED
            job.error_message = str(e)
            job.completed_at = datetime.utcnow()
            db.commit()
        except:
            db.rollback()
        
        logger.error(f"Merge task failed for job {job_id}: {e}")
        task.update_state(
            state='FAILURE',
            meta={'error': str(e), 'job_id': job_id}
        )
        return {"status": "error", "message": str(e)}
    finally:
        # Always cleanup temp files
        _cleanup_temp_files(temp_files)
        db.close()


@celery_app.task(bind=True, name="app.workers.tasks.compress_image_task")
def compress_image_task(self, job_id: str, file_keys: List[str], compression_level: str = "medium") -> Dict[str, Any]:
    """
    Background task to compress images.
    Optimized to use tempfile for memory efficiency.
    
    Args:
        job_id: UUID of the job
        file_keys: List of S3 keys for input files
        compression_level: Compression level (low, medium, high)
        
    Returns:
        Dict containing task result
    """
    task = current_task
    db = get_db_session()
    temp_files = []
    
    try:
        # Update job status to processing
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job {job_id} not found")
        
        job.status = JobStatus.PROCESSING
        job.compression_level = compression_level
        db.commit()
        
        # Download files to temp storage
        temp_files = _download_files_to_temp(file_keys)
        
        # Process files one at a time to minimize memory usage
        compress_service = CompressService()
        
        for i, temp_path in enumerate(temp_files):
            # Read file only when processing
            with open(temp_path, 'rb') as f:
                file_data = f.read()
            
            compressed_data = compress_service.compress_image(file_data, compression_level)
            
            # Upload compressed file
            compressed_key = f"results/{job_id}/compressed_{i}.jpg"
            s3_client.upload_file(compressed_data, compressed_key, "image/jpeg")
        
        # For now, return first compressed file (could be enhanced for multiple files)
        result_key = f"results/{job_id}/compressed_0.jpg"
        
        # Update job with success
        job.status = JobStatus.COMPLETED
        job.result_key = result_key
        job.completed_at = datetime.utcnow()
        job.error_message = None
        db.commit()
        
        # Cleanup input files from S3
        s3_client.delete_files(file_keys)
        
        return {
            "status": "success",
            "result_key": result_key,
            "message": f"Image compression completed with {compression_level} quality"
        }
        
    except Exception as e:
        # Update job with error
        try:
            job.status = JobStatus.FAILED
            job.error_message = str(e)
            job.completed_at = datetime.utcnow()
            db.commit()
        except:
            db.rollback()
        
        logger.error(f"Compress task failed for job {job_id}: {e}")
        task.update_state(
            state='FAILURE',
            meta={'error': str(e), 'job_id': job_id}
        )
        return {"status": "error", "message": str(e)}
    finally:
        # Always cleanup temp files
        _cleanup_temp_files(temp_files)
        db.close()


@celery_app.task(bind=True, name="app.workers.tasks.reduce_pdf_task")
def reduce_pdf_task(self, job_id: str, file_key: str, compression_level: str = "medium") -> Dict[str, Any]:
    """
    Background task to reduce PDF file size.
    Optimized to use tempfile for memory efficiency.
    
    Args:
        job_id: UUID of the job
        file_key: S3 key for input file
        compression_level: Compression level (low, medium, high)
        
    Returns:
        Dict containing task result
    """
    task = current_task
    db = get_db_session()
    temp_file = None
    
    try:
        # Update job status to processing
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job {job_id} not found")
        
        job.status = JobStatus.PROCESSING
        job.compression_level = compression_level
        db.commit()
        
        # Download file to temp storage
        temp_files = _download_files_to_temp([file_key])
        temp_file = temp_files[0] if temp_files else None
        
        if not temp_file:
            raise ValueError(f"Failed to download file {file_key}")
        
        # Read file for processing
        with open(temp_file, 'rb') as f:
            file_data = f.read()
        
        # Process PDF reduction
        reduce_service = ReduceService()
        reduced_data = reduce_service.reduce_pdf(file_data, compression_level)
        
        # Upload reduced file
        result_key = f"results/{job_id}/reduced.pdf"
        success = s3_client.upload_file(reduced_data, result_key, "application/pdf")
        
        if success:
            # Update job with success
            job.status = JobStatus.COMPLETED
            job.result_key = result_key
            job.completed_at = datetime.utcnow()
            job.error_message = None
            db.commit()
            
            # Cleanup input file from S3
            s3_client.delete_file(file_key)
            
            return {
                "status": "success",
                "result_key": result_key,
                "message": f"PDF reduction completed with {compression_level} compression"
            }
        else:
            raise Exception("Failed to upload reduced file")
            
    except Exception as e:
        # Update job with error
        try:
            job.status = JobStatus.FAILED
            job.error_message = str(e)
            job.completed_at = datetime.utcnow()
            db.commit()
        except:
            db.rollback()
        
        logger.error(f"Reduce task failed for job {job_id}: {e}")
        task.update_state(
            state='FAILURE',
            meta={'error': str(e), 'job_id': job_id}
        )
        return {"status": "error", "message": str(e)}
    finally:
        # Always cleanup temp file
        if temp_file:
            _cleanup_temp_files([temp_file])
        db.close()


@celery_app.task(bind=True, name="app.workers.tasks.jpg_to_pdf_task")
def jpg_to_pdf_task(self, job_id: str, file_keys: List[str]) -> Dict[str, Any]:
    """
    Background task to convert JPG images to PDF.
    Optimized to use tempfile for memory efficiency.
    
    Args:
        job_id: UUID of the job
        file_keys: List of S3 keys for input files
        
    Returns:
        Dict containing task result
    """
    task = current_task
    db = get_db_session()
    temp_files = []
    
    try:
        # Update job status to processing
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job {job_id} not found")
        
        job.status = JobStatus.PROCESSING
        db.commit()
        
        # Download files to temp storage
        temp_files = _download_files_to_temp(file_keys)
        
        # Process JPG to PDF conversion
        from PIL import Image
        import io
        
        # Create PDF from images
        images = []
        
        for temp_path in temp_files:
            # Read file only when processing
            with open(temp_path, 'rb') as f:
                file_data = f.read()
            
            img = Image.open(io.BytesIO(file_data))
            if img.mode == 'RGBA':
                img = img.convert('RGB')
            images.append(img)
        
        if images:
            # Save as PDF
            first_image = images[0]
            pdf_data = io.BytesIO()
            first_image.save(pdf_data, format='PDF', resolution=100.0)
            pdf_bytes = pdf_data.getvalue()
        else:
            raise ValueError("No valid images found for conversion")
        
        # Upload result to S3
        result_key = f"results/{job_id}/converted.pdf"
        success = s3_client.upload_file(pdf_bytes, result_key, "application/pdf")
        
        if success:
            # Update job with success
            job.status = JobStatus.COMPLETED
            job.result_key = result_key
            job.completed_at = datetime.utcnow()
            job.error_message = None
            db.commit()
            
            # Cleanup input files from S3
            s3_client.delete_files(file_keys)
            
            return {
                "status": "success",
                "result_key": result_key,
                "message": "JPG to PDF conversion completed successfully"
            }
        else:
            raise Exception("Failed to upload converted PDF")
            
    except Exception as e:
        # Update job with error
        try:
            job.status = JobStatus.FAILED
            job.error_message = str(e)
            job.completed_at = datetime.utcnow()
            db.commit()
        except:
            db.rollback()
        
        logger.error(f"JPG to PDF task failed for job {job_id}: {e}")
        task.update_state(
            state='FAILURE',
            meta={'error': str(e), 'job_id': job_id}
        )
        return {"status": "error", "message": str(e)}
    finally:
        # Always cleanup temp files
        _cleanup_temp_files(temp_files)
        db.close()


@celery_app.task(bind=True, name="app.workers.tasks.cleanup_old_jobs")
def cleanup_old_jobs(self) -> Dict[str, Any]:
    """
    Periodic task to clean up old completed jobs.
    
    Returns:
        Dict containing cleanup results
    """
    db = get_db_session()
    
    try:
        # Find jobs older than 24 hours
        from datetime import timedelta
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        
        old_jobs = db.query(Job).filter(
            Job.completed_at < cutoff_time
        ).all()
        
        cleaned_files = []
        for job in old_jobs:
            # Clean up result files from S3
            if job.result_key:
                if s3_client.delete_file(job.result_key):
                    cleaned_files.append(job.result_key)
            
            # Delete job record
            db.delete(job)
        
        db.commit()
        
        return {
            "status": "success",
            "cleaned_jobs": len(old_jobs),
            "cleaned_files": len(cleaned_files),
            "message": f"Cleaned up {len(old_jobs)} old jobs"
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"Cleanup task failed: {e}")
        return {"status": "error", "message": str(e)}
    finally:
        db.close()


@celery_app.task(bind=True, name="app.workers.tasks.cleanup_s3_temp_files")
def cleanup_s3_temp_files(self) -> Dict[str, Any]:
    """
    Periodic task to clean up temporary files from S3.
    
    Returns:
        Dict containing cleanup results
    """
    try:
        import boto3
        from botocore.exceptions import ClientError
        
        # List objects in temp folder
        response = s3_client.client.list_objects_v2(
            Bucket=s3_client.bucket_name,
            Prefix="temp/"
        )
        
        if 'Contents' not in response:
            return {"status": "success", "message": "No temp files to clean"}
        
        temp_files = response['Contents']
        if not temp_files:
            return {"status": "success", "message": "No temp files to clean"}
        
        # Delete files older than 1 hour
        from datetime import datetime, timedelta
        cutoff_time = datetime.utcnow() - timedelta(hours=1)
        
        files_to_delete = []
        for obj in temp_files:
            if obj['LastModified'] < cutoff_time:
                files_to_delete.append({'Key': obj['Key']})
        
        if files_to_delete:
            # Delete in batches
            if len(files_to_delete) > 1000:
                # Process in batches of 1000
                for i in range(0, len(files_to_delete), 1000):
                    batch = files_to_delete[i:i + 1000]
                    s3_client.client.delete_objects(
                        Bucket=s3_client.bucket_name,
                        Delete={'Objects': batch}
                    )
            else:
                s3_client.client.delete_objects(
                    Bucket=s3_client.bucket_name,
                    Delete={'Objects': files_to_delete}
                )
        
        return {
            "status": "success",
            "deleted_files": len(files_to_delete),
            "message": f"Cleaned up {len(files_to_delete)} temporary files"
        }
        
    except Exception as e:
        logger.error(f"S3 cleanup task failed: {e}")
        return {"status": "error", "message": str(e)}
