"""
S3 client for file upload and download operations.
Logic: boto3 integration for presigned URLs, file management, and temporary access.
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta

import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from botocore.config import Config

from app.core.config import get_s3_config, settings

logger = logging.getLogger(__name__)


class S3Client:
    """S3 client wrapper for file operations."""
    
    def __init__(self):
        """Initialize S3 client with Supabase S3 compatibility."""
        self.config = get_s3_config()
        
        # Build S3 client parameters
        s3_params = {
            'aws_access_key_id': self.config['aws_access_key_id'],
            'aws_secret_access_key': self.config['aws_secret_access_key'],
            'region_name': self.config['region'],
            'config': Config(
                signature_version='s3v4',
                retries={'max_attempts': 3},
                max_pool_connections=50
            )
        }
        
        # Add custom endpoint for Supabase S3
        if settings.s3_endpoint_url:
            s3_params['endpoint_url'] = settings.s3_endpoint_url
        
        self.client = boto3.client('s3', **s3_params)
        self.bucket_name = self.config['bucket_name']
    
    def generate_presigned_upload_url(
        self, 
        file_key: str, 
        file_type: str, 
        file_size_mb: int = None
    ) -> Dict[str, Any]:
        """
        Generate a presigned URL for file upload.
        
        Args:
            file_key: S3 key for the file
            file_type: MIME type of the file
            file_size_mb: File size in MB for validation
            
        Returns:
            Dict containing upload URL and file metadata
        """
        try:
            # Validate file size
            max_size = file_size_mb or settings.max_file_size_mb
            if file_size_mb and file_size_mb > max_size:
                raise ValueError(f"File size {file_size_mb}MB exceeds maximum {max_size}MB")
            
            # Generate presigned URL for PUT operation
            # Note: We DO NOT include ContentType in Params to give flexibility
            # to the client to send the correct Content-Type header
            url = self.client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': file_key
                },
                ExpiresIn=settings.s3_expiry_seconds
            )
            
            return {
                "upload_url": url,
                "file_key": file_key,
                "bucket": self.bucket_name,
                "region": self.config['region'],
                "expires_in": settings.s3_expiry_seconds,
                "max_file_size_mb": max_size
            }
            
        except NoCredentialsError:
            logger.error("AWS credentials not found")
            raise ValueError("AWS credentials not configured properly")
        except ClientError as e:
            logger.error(f"S3 client error: {e}")
            raise ValueError(f"Failed to generate upload URL: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error generating upload URL: {e}")
            raise ValueError(f"Failed to generate upload URL: {str(e)}")
    
    def generate_presigned_download_url(
        self, 
        file_key: str, 
        expires_in: int = None
    ) -> str:
        """
        Generate a presigned URL for file download.
        
        Args:
            file_key: S3 key for the file
            expires_in: Custom expiry time in seconds
            
        Returns:
            str: Presigned download URL
        """
        try:
            expires_in = expires_in or settings.s3_expiry_seconds
            
            url = self.client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': file_key
                },
                ExpiresIn=expires_in
            )
            
            return url
            
        except ClientError as e:
            logger.error(f"S3 client error generating download URL: {e}")
            raise ValueError(f"Failed to generate download URL: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error generating download URL: {e}")
            raise ValueError(f"Failed to generate download URL: {str(e)}")
    
    def upload_file(
        self, 
        file_data: bytes, 
        file_key: str, 
        content_type: str
    ) -> bool:
        """
        Direct file upload to S3 (for background tasks).
        
        Args:
            file_data: Binary file data
            file_key: S3 key for the file
            content_type: MIME type of the file
            
        Returns:
            bool: True if successful
        """
        try:
            self.client.put_object(
                Bucket=self.bucket_name,
                Key=file_key,
                Body=file_data,
                ContentType=content_type,
                ACL='private'
            )
            logger.info(f"Successfully uploaded file to S3: {file_key}")
            return True
            
        except ClientError as e:
            logger.error(f"Failed to upload file {file_key}: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error uploading file {file_key}: {e}")
            return False
    
    def download_file(self, file_key: str) -> Optional[bytes]:
        """
        Download file from S3 (for background tasks).
        
        Args:
            file_key: S3 key for the file
            
        Returns:
            Optional[bytes]: File data if successful
        """
        try:
            response = self.client.get_object(
                Bucket=self.bucket_name,
                Key=file_key
            )
            return response['Body'].read()
            
        except ClientError as e:
            logger.error(f"Failed to download file {file_key}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error downloading file {file_key}: {e}")
            return None
    
    def delete_file(self, file_key: str) -> bool:
        """
        Delete file from S3.
        
        Args:
            file_key: S3 key for the file
            
        Returns:
            bool: True if successful
        """
        try:
            self.client.delete_object(
                Bucket=self.bucket_name,
                Key=file_key
            )
            logger.info(f"Successfully deleted file from S3: {file_key}")
            return True
            
        except ClientError as e:
            logger.error(f"Failed to delete file {file_key}: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error deleting file {file_key}: {e}")
            return False
    
    def delete_files(self, file_keys: List[str]) -> Dict[str, bool]:
        """
        Delete multiple files from S3.
        
        Args:
            file_keys: List of S3 keys to delete
            
        Returns:
            Dict[str, bool]: Results for each file
        """
        results = {}
        
        # Process in batches of 1000 files (S3 limit)
        batch_size = 1000
        for i in range(0, len(file_keys), batch_size):
            batch = file_keys[i:i + batch_size]
            
            # Create delete objects format
            delete_objects = [{'Key': key} for key in batch]
            
            try:
                response = self.client.delete_objects(
                    Bucket=self.bucket_name,
                    Delete={'Objects': delete_objects}
                )
                
                # Process results
                for obj in response.get('Deleted', []):
                    results[obj['Key']] = True
                
                for error in response.get('Errors', []):
                    results[error['Key']] = False
                    logger.error(f"Failed to delete {error['Key']}: {error['Message']}")
                    
            except ClientError as e:
                logger.error(f"Batch delete error: {e}")
                for key in batch:
                    results[key] = False
        
        return results
    
    def file_exists(self, file_key: str) -> bool:
        """
        Check if file exists in S3.
        
        Args:
            file_key: S3 key for the file
            
        Returns:
            bool: True if file exists
        """
        try:
            self.client.head_object(
                Bucket=self.bucket_name,
                Key=file_key
            )
            return True
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return False
            logger.error(f"Error checking file existence {file_key}: {e}")
            return False
    
    def get_file_size(self, file_key: str) -> Optional[int]:
        """
        Get file size from S3 metadata.
        
        Args:
            file_key: S3 key for the file
            
        Returns:
            Optional[int]: File size in bytes
        """
        try:
            response = self.client.head_object(
                Bucket=self.bucket_name,
                Key=file_key
            )
            return response.get('ContentLength')
        except ClientError as e:
            logger.error(f"Error getting file size {file_key}: {e}")
            return None
    
    def get_file_info(self, file_key: str) -> Dict[str, Any]:
        """
        Get complete file information from S3 metadata.
        
        Args:
            file_key: S3 key for the file
            
        Returns:
            Dict containing file size and last modified timestamp
            
        Raises:
            ValueError: If file doesn't exist or can't be accessed
        """
        try:
            response = self.client.head_object(
                Bucket=self.bucket_name,
                Key=file_key
            )
            return {
                "size": response.get('ContentLength', 0),
                "last_modified": response.get('LastModified', '').isoformat() if response.get('LastModified') else '',
                "content_type": response.get('ContentType', 'application/octet-stream'),
                "etag": response.get('ETag', '')
            }
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                raise ValueError(f"File not found: {file_key}")
            logger.error(f"Error getting file info {file_key}: {e}")
            raise ValueError(f"Failed to get file info: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error getting file info {file_key}: {e}")
            raise ValueError(f"Failed to get file info: {str(e)}")


# Global S3 client instance
s3_client = S3Client()
