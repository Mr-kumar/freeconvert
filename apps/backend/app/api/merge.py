"""
PDF Merge API endpoint.
Logic: Accept list of file_keys, create Celery task (merge_pdfs), store job_id, return { jobId }.
Heavy work done in worker.
"""
