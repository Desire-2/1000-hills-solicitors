"""
Base model configuration.
"""
from extensions import db

# Use Flask-SQLAlchemy's Model as base
Base = db.Model
