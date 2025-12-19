"""
Deadline model definition.
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class Deadline(Base):
    """Deadline model for case deadlines."""
    __tablename__ = 'deadlines'
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    due_date = Column(DateTime, nullable=False)
    is_completed = Column(Boolean, default=False)
    
    # Foreign Keys
    case_id = Column(Integer, ForeignKey('cases.id'), nullable=False)
    
    # Relationships
    case = relationship("Case", back_populates="deadlines")
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())

    def __repr__(self):
        return f'<Deadline {self.title} for Case {self.case_id}>'
