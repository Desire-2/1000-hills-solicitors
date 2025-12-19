"""
Message model definition.
"""
from sqlalchemy import Column, Integer, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class Message(Base):
    """Message model for case communication."""
    __tablename__ = 'messages'
    
    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    
    # Foreign Keys
    case_id = Column(Integer, ForeignKey('cases.id'), nullable=False)
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    recipient_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Relationships
    case = relationship("Case", back_populates="messages")
    sender = relationship("User", back_populates="messages_sent", foreign_keys=[sender_id])
    recipient = relationship("User", back_populates="messages_received", foreign_keys=[recipient_id])
    attachments = relationship("Document", back_populates="message")
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())

    def __repr__(self):
        return f'<Message {self.id} from User {self.sender_id}>'
