"""
Job status API endpoint.
Logic: GET by job_id. Load job from DB/Redis, return { status, result_key?, error? }.
Used for polling from frontend (merge, compress, reduce).
"""
