"""
PDF Size Reducer API endpoint.
Logic: Accept file_key + optional level, create Celery task (reduce_pdf), return { jobId }.
Worker runs PDF compression (e.g. image downscale, object stream).
"""
