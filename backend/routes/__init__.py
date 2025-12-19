"""
Routes package initialization.
Exports all route blueprints.
"""
from .auth import auth_bp
from .cases import case_bp

__all__ = ['auth_bp', 'case_bp']
