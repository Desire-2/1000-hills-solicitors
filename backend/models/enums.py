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
    IMMIGRATION = "IMMIGRATION"
    FAMILY_LAW = "FAMILY_LAW"
    CRIMINAL_DEFENSE = "CRIMINAL_DEFENSE"
    CIVIL_LITIGATION = "CIVIL_LITIGATION"
    CORPORATE_LAW = "CORPORATE_LAW"
    PROPERTY_LAW = "PROPERTY_LAW"
    EMPLOYMENT_LAW = "EMPLOYMENT_LAW"
    OTHER = "OTHER"


class CaseStatus(enum.Enum):
    """Case status workflow stages."""
    PENDING = "PENDING"
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
