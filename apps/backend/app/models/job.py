"""
Job model (DB).
Logic: SQLAlchemy/SQLModel table: id, type (merge|compress|reduce), status, input_keys (JSON),
result_key, created_at. Used by API and workers to track tasks.
"""
