"""
S3 (or LocalStack) client.
Logic: Upload file bytes with key, get signed URL for download, delete object. Used by upload + workers.
"""
