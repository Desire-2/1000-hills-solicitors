"""
Document model definition.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class Document(Base):
    """Document model for file attachments."""
    __tablename__ = 'documents'
    
    id = Column(Integer, primary_key=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)  # Path to S3/local storage
    file_size = Column(Integer)  # Size in bytes
    mime_type = Column(String)
    
    # Foreign Keys (Document can be attached to a Case or a Message)
    case_id = Column(Integer, ForeignKey('cases.id'))
    message_id = Column(Integer, ForeignKey('messages.id'))
    uploaded_by_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Relationships
    case = relationship("Case", back_populates="documents")
    message = relationship("Message", back_populates="attachments")
    uploaded_by = relationship("User")
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())

    def __repr__(self):
        return f'<Document {self.filename}>'
