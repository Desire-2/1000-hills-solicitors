"""
Case Note model definition.
"""
from sqlalchemy import Column, Integer, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class CaseNote(Base):
    """Case Note model for internal case notes."""
    __tablename__ = 'case_notes'
    
    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    is_private = Column(Boolean, default=True)  # Only visible to staff
    
    # Foreign Keys
    case_id = Column(Integer, ForeignKey('cases.id'), nullable=False)
    author_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Relationships
    case = relationship("Case", back_populates="notes")
    author = relationship("User", back_populates="notes", foreign_keys=[author_id])
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())

    def __repr__(self):
        return f'<CaseNote {self.id} for Case {self.case_id}>'
