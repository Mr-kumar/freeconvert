"""
Image Compress API endpoint.
Logic: Accept file_keys + options (quality, max size), create Celery task (compress_images),
return { jobId }. Worker does actual compression.
"""
