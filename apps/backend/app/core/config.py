"""
App configuration with professional stack integration.
Logic: Load from environment variables using Pydantic Settings for type safety and validation.
"""

from typing import List, Optional
from pydantic import Field
from pydantic_settings import BaseSettings


class BaseSettings(BaseSettings):
    """Base configuration class for the FreeConvert backend."""
    
    # AWS Configuration (Supabase S3)
    aws_access_key_id: str = Field(..., env="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: str = Field(..., env="AWS_SECRET_ACCESS_KEY")
    aws_region: str = Field("us-east-1", env="AWS_REGION")
    s3_bucket_name: str = Field(..., env="S3_BUCKET_NAME")
    s3_endpoint_url: Optional[str] = Field(None, env="S3_ENDPOINT_URL")
    
    # Database Configuration (Neon)
    database_url: str = Field(..., env="DATABASE_URL")
    
    # Redis Configuration (Upstash)
    redis_url: str = Field(..., env="REDIS_URL")
    
    # Application Configuration
    app_name: str = Field("FreeConvert Backend", env="APP_NAME")
    debug: bool = Field(False, env="DEBUG")
    environment: str = Field("production", env="ENVIRONMENT")
    
    # CORS Configuration
    cors_origins: List[str] = Field(
        default=["https://freeconvert.in", "https://freeconvert-web.vercel.app"],
        env="CORS_ORIGINS"
    )
    
    # File Processing Configuration
    allowed_file_types: List[str] = Field(
        default=["application/pdf", "image/jpeg", "image/png", "image/jpg"],
        env="ALLOWED_FILE_TYPES"
    )
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse CORS_ORIGINS if it's a string
        if isinstance(self.cors_origins, str):
            import json
            try:
                self.cors_origins = json.loads(self.cors_origins)
            except json.JSONDecodeError:
                # Fallback to comma-separated
                self.cors_origins = [origin.strip() for origin in self.cors_origins.split(",")]
        
        # Parse ALLOWED_FILE_TYPES if it's a string
        if isinstance(self.allowed_file_types, str):
            import json
            try:
                self.allowed_file_types = json.loads(self.allowed_file_types)
            except json.JSONDecodeError:
                # Fallback to comma-separated
                self.allowed_file_types = [ft.strip() for ft in self.allowed_file_types.split(",")]
    
    # Security Configuration
    secret_key: str = Field(..., env="SECRET_KEY")
    session_expiry_hours: int = Field(24, env="SESSION_EXPIRY_HOURS")
    
    max_file_size_mb: int = Field(100, env="MAX_FILE_SIZE_MB")
    
    # S3 Configuration
    s3_expiry_seconds: int = Field(3600, env="S3_EXPIRY_SECONDS")
    
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
