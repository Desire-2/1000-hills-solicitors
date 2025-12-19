"""
Enum definitions for the application.
"""
import enum


class Role(enum.Enum):
    """User role definitions."""
    CLIENT = "CLIENT"
    CASE_MANAGER = "CASE_MANAGER"
    CONTENT_EDITOR = "CONTENT_EDITOR"
    SUPER_ADMIN = "SUPER_ADMIN"
    VIEWER = "VIEWER"


class CaseCategory(enum.Enum):
    """Case category types."""
    LEGAL_CONSULTANCY = "LEGAL_CONSULTANCY"
    MEDIATION = "MEDIATION"
    LITIGATION = "LITIGATION"
    OTHER = "OTHER"


class CaseStatus(enum.Enum):
    """Case status workflow stages."""
    NEW = "NEW"
    IN_REVIEW = "IN_REVIEW"
    IN_PROGRESS = "IN_PROGRESS"
    AWAITING_CLIENT = "AWAITING_CLIENT"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"


class Priority(enum.Enum):
    """Case priority levels."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"
