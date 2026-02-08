"""
Celery application.
Logic: Broker/backend from config (Redis). Register tasks from tasks.py. Used to run merge,
compress, reduce in background.
"""
