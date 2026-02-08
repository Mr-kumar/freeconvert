"""
PDF merge service (pure logic).
Logic: Given list of S3 keys, download PDFs, merge with PyPDF2 (or pypdf), upload result to S3,
return result key. Called from Celery task only.
"""
