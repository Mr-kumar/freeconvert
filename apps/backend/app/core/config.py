"""
App configuration with AWS integration.
Logic: Load from environment variables using Pydantic Settings for type safety and validation.
"""

from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings


class BaseSettings(BaseSettings):
    """Base configuration class for the FreeConvert backend."""
    
    # AWS Configuration
    aws_access_key_id: str = Field(..., env="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: str = Field(..., env="AWS_SECRET_ACCESS_KEY")
    aws_region: str = Field("eu-north-1", env="AWS_REGION")
    s3_bucket_name: str = Field(..., env="S3_BUCKET_NAME")
    
    # Database Configuration
    database_url: str = Field(..., env="DATABASE_URL")
    
    # Redis Configuration
    redis_url: str = Field(..., env="REDIS_URL")
    
    # Application Configuration
    app_name: str = Field("FreeConvert Backend", env="APP_NAME")
    debug: bool = Field(False, env="DEBUG")
    environment: str = Field("development", env="ENVIRONMENT")
    
    # CORS Configuration
    cors_origins: List[str] = Field(
        default=[
            "http://localhost:3000", 
            "https://freeconvert.com",
            "https://freeconvert-web.vercel.app",
            "https://yourdomain.com"  # Add your custom domain here
        ],
        env="CORS_ORIGINS"
    )
    
    # Security Configuration
    secret_key: str = Field(..., env="SECRET_KEY")
    session_expiry_hours: int = Field(24, env="SESSION_EXPIRY_HOURS")
    
    # File Processing Configuration
    max_file_size_mb: int = Field(100, env="MAX_FILE_SIZE_MB")
    allowed_file_types: List[str] = Field(
        default=["application/pdf", "image/jpeg", "image/png", "image/jpg"],
        env="ALLOWED_FILE_TYPES"
    )
    
    # S3 Configuration
    s3_expiry_seconds: int = Field(3600, env="S3_EXPIRY_SECONDS")  # 1 hour
    s3_max_file_size_mb: int = Field(100, env="S3_MAX_FILE_SIZE_MB")
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = BaseSettings()


def get_database_url() -> str:
    """Get the database URL from settings."""
    return settings.database_url


def get_redis_url() -> str:
    """Get the Redis URL from settings."""
    return settings.redis_url


def get_s3_config() -> dict:
    """Get S3 configuration as a dictionary."""
    return {
        "aws_access_key_id": settings.aws_access_key_id,
        "aws_secret_access_key": settings.aws_secret_access_key,
        "region": settings.aws_region,
        "bucket_name": settings.s3_bucket_name,
    }
