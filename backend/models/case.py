"""
Case model definition.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
from .enums import CaseCategory, CaseStatus, Priority


class Case(Base):
    """Case model for legal case management."""
    __tablename__ = 'cases'
    
    id = Column(Integer, primary_key=True)
    case_id = Column(String, unique=True, nullable=False)  # Format: 1000HILLS-2024-001
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(Enum(CaseCategory), nullable=False)
    status = Column(Enum(CaseStatus), default=CaseStatus.NEW, nullable=False)
    priority = Column(Enum(Priority), default=Priority.MEDIUM, nullable=False)
    
    # Foreign Keys
    client_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    assigned_to_id = Column(Integer, ForeignKey('users.id'))  # Staff member assigned
    
    # Relationships
    client = relationship("User", back_populates="cases_client", foreign_keys=[client_id])
    assigned_to = relationship("User", back_populates="cases_assigned", foreign_keys=[assigned_to_id])
    documents = relationship("Document", back_populates="case")
    messages = relationship("Message", back_populates="case")
    notes = relationship("CaseNote", back_populates="case")
    deadlines = relationship("Deadline", back_populates="case")
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f'<Case {self.case_id}>'
