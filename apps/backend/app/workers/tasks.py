"""
Celery tasks (background jobs).
Logic: merge_pdfs(file_keys) -> calls merge_service, updates Job; compress_images(file_keys, opts);
reduce_pdf(file_key, level). Each task updates job status and result_key on success.
"""
