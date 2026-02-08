"""
Celery tasks for background file processing.
Logic: Download files from S3, process with service libraries, upload results back to S3.
"""

import logging
import uuid
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


@celery_app.task(bind=True, name="app.workers.tasks.merge_pdf_task")
def merge_pdf_task(self, job_id: str, file_keys: List[str]) -> Dict[str, Any]:
    """
    Background task to merge multiple PDF files.
    
    Args:
        job_id: UUID of the job
        file_keys: List of S3 keys for input files
        
    Returns:
        Dict containing task result
    """
    task = current_task
    db = get_db_session()
    
    try:
        # Update job status to processing
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job {job_id} not found")
        
        job.status = JobStatus.PROCESSING
        db.commit()
        
        # Download input files from S3
        input_files = []
        for file_key in file_keys:
            file_data = s3_client.download_file(file_key)
            if file_data:
                input_files.append(file_data)
            else:
                raise ValueError(f"Failed to download file {file_key}")
        
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
            
            # Cleanup input files
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
        db.close()


@celery_app.task(bind=True, name="app.workers.tasks.compress_image_task")
def compress_image_task(self, job_id: str, file_keys: List[str], compression_level: str = "medium") -> Dict[str, Any]:
    """
    Background task to compress images.
    
    Args:
        job_id: UUID of the job
        file_keys: List of S3 keys for input files
        compression_level: Compression level (low, medium, high)
        
    Returns:
        Dict containing task result
    """
    task = current_task
    db = get_db_session()
    
    try:
        # Update job status to processing
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job {job_id} not found")
        
        job.status = JobStatus.PROCESSING
        job.compression_level = compression_level
        db.commit()
        
        # Download and process files
        compress_service = CompressService()
        processed_files = []
        
        for i, file_key in enumerate(file_keys):
            file_data = s3_client.download_file(file_key)
            if file_data:
                compressed_data = compress_service.compress_image(file_data, compression_level)
                processed_files.append(compressed_data)
                
                # Upload compressed file
                compressed_key = f"results/{job_id}/compressed_{i}.jpg"
                s3_client.upload_file(compressed_data, compressed_key, "image/jpeg")
            else:
                raise ValueError(f"Failed to download file {file_key}")
        
        # For now, return first compressed file (could be enhanced for multiple files)
        result_key = f"results/{job_id}/compressed_0.jpg"
        
        # Update job with success
        job.status = JobStatus.COMPLETED
        job.result_key = result_key
        job.completed_at = datetime.utcnow()
        job.error_message = None
        db.commit()
        
        # Cleanup input files
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
        db.close()


@celery_app.task(bind=True, name="app.workers.tasks.reduce_pdf_task")
def reduce_pdf_task(self, job_id: str, file_key: str, compression_level: str = "medium") -> Dict[str, Any]:
    """
    Background task to reduce PDF file size.
    
    Args:
        job_id: UUID of the job
        file_key: S3 key for input file
        compression_level: Compression level (low, medium, high)
        
    Returns:
        Dict containing task result
    """
    task = current_task
    db = get_db_session()
    
    try:
        # Update job status to processing
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job {job_id} not found")
        
        job.status = JobStatus.PROCESSING
        job.compression_level = compression_level
        db.commit()
        
        # Download and process file
        file_data = s3_client.download_file(file_key)
        if not file_data:
            raise ValueError(f"Failed to download file {file_key}")
        
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
            
            # Cleanup input file
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
        db.close()


@celery_app.task(bind=True, name="app.workers.tasks.jpg_to_pdf_task")
def jpg_to_pdf_task(self, job_id: str, file_keys: List[str]) -> Dict[str, Any]:
    """
    Background task to convert JPG images to PDF.
    
    Args:
        job_id: UUID of the job
        file_keys: List of S3 keys for input files
        
    Returns:
        Dict containing task result
    """
    task = current_task
    db = get_db_session()
    
    try:
        # Update job status to processing
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job {job_id} not found")
        
        job.status = JobStatus.PROCESSING
        db.commit()
        
        # Download input files from S3
        input_files = []
        for file_key in file_keys:
            file_data = s3_client.download_file(file_key)
            if file_data:
                input_files.append(file_data)
            else:
                raise ValueError(f"Failed to download file {file_key}")
        
        # Process JPG to PDF conversion
        from PIL import Image
        import io
        
        # Create PDF from images
        pdf_data = io.BytesIO()
        images = []
        
        for file_data in input_files:
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
            
            # Cleanup input files
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
