"""
User model definition.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
from .enums import Role


class User(Base):
    """User model for authentication and authorization."""
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String)
    role = Column(Enum(Role), default=Role.CLIENT, nullable=False)
    email_verified = Column(Boolean, default=False)
    
    # Relationships
    cases_client = relationship("Case", back_populates="client", foreign_keys="[Case.client_id]")
    cases_assigned = relationship("Case", back_populates="assigned_to", foreign_keys="[Case.assigned_to_id]")
    messages_sent = relationship("Message", back_populates="sender", foreign_keys="[Message.sender_id]")
    messages_received = relationship("Message", back_populates="recipient", foreign_keys="[Message.recipient_id]")
    notes = relationship("CaseNote", back_populates="author")
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def to_dict(self):
        """Convert user to dictionary."""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'phone': self.phone,
            'role': self.role.value if self.role else None,
            'email_verified': self.email_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<User {self.email}>'
