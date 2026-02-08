"""
Upload API endpoint.
Logic: Accept multipart/form-data, validate file type/size, store in S3 (or local), save record
in DB, return { fileKey }. Used by all three tools.
"""
