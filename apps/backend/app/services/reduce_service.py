"""
PDF size reduce service (pure logic).
Logic: Given PDF key, download, reduce size (image downscale, object stream, etc.) with PyPDF2
or ghostscript, upload result to S3. Called from Celery task only.
"""
