"""
Routes package initialization.
Exports all route blueprints.
"""
from .auth import auth_bp
from .cases import case_bp
from .notes import notes_bp
from .messages import messages_bp

__all__ = ['auth_bp', 'case_bp', 'notes_bp', 'messages_bp']
