"""
Image compress service (pure logic).
Logic: Given image key(s), download, resize/compress with Pillow, upload result(s) to S3.
Called from Celery task only.
"""
