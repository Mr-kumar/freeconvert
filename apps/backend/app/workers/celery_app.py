"""
Celery application configuration.
Logic: Initialize Celery app with Redis broker for background task processing.
"""

import os
from celery import Celery
from kombu import Queue, Exchange

from app.core.config import get_redis_url, settings


# Create Celery app with Redis broker
celery_app = Celery(
    "freeconvert",
    broker=get_redis_url(),
    backend=get_redis_url(),
    include=["app.workers.tasks"]
)

# Configure Celery settings
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    task_acks_late=True,
    worker_disable_rate_limits=False,
    task_default_queue="default",
    task_routes={
        "app.workers.tasks.merge_pdf_task": {"queue": "merge"},
        "app.workers.tasks.compress_image_task": {"queue": "compress"},
        "app.workers.tasks.reduce_pdf_task": {"queue": "reduce"},
        "app.workers.tasks.jpg_to_pdf_task": {"queue": "jpg-to-pdf"},
    },
    task_annotations={
        "app.workers.tasks.merge_pdf_task": {"rate_limit": "10/m"},
        "app.workers.tasks.compress_image_task": {"rate_limit": "20/m"},
        "app.workers.tasks.reduce_pdf_task": {"rate_limit": "15/m"},
        "app.workers.tasks.jpg_to_pdf_task": {"rate_limit": "25/m"},
    }
)

# Configure beat schedule for periodic tasks
celery_app.conf.beat_schedule = {
    'cleanup-old-jobs': {
        'task': 'app.workers.tasks.cleanup_old_jobs',
        'schedule': 3600.0,  # Every hour
    },
    'cleanup-s3-temp-files': {
        'task': 'app.workers.tasks.cleanup_s3_temp_files',
        'schedule': 86400.0,  # Every day
    },
}

# Configure worker queues
celery_app.conf.task_queues = (
    Queue("default", Exchange("default"), routing_key="default"),
    Queue("merge", Exchange("merge"), routing_key="merge"),
    Queue("compress", Exchange("compress"), routing_key="compress"),
    Queue("reduce", Exchange("reduce"), routing_key="reduce"),
    Queue("jpg-to-pdf", Exchange("jpg-to-pdf"), routing_key="jpg-to-pdf"),
)

# Configure task priorities
celery_app.conf.task_inherit_parent_priority = True
celery_app.conf.task_default_priority = 5
celery_app.conf.worker_direct = True

# Configure result backend
celery_app.conf.result_backend_transport_options = {
    'result_expires': 3600,  # 1 hour
    'retry_policy': {
        'timeout': 5,
        'interval_start': 0,
        'interval_step': 0.2,
        'interval_max': 5,
    },
    'visibility_timeout': 3600,
    'group_meta': {
        'default_expires': 3600,
    }
}

# Configure monitoring
celery_app.conf.worker_send_task_events = True
celery_app.conf.task_send_sent_event = True

if settings.debug:
    celery_app.conf.update(
        worker_log_color=True,
        worker_log_format="[%(asctime)s: %(levelname)s/%(processName)s] %(message)s",
        worker_task_log_format="[%(asctime)s: %(levelname)s/%(processName)s][%(task_name)s] %(message)s",
    )

# Export celery app for easy import
__all__ = ["celery_app"]
