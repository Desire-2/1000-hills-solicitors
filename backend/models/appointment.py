"""
Appointment model for managing client-attorney meetings.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
import enum
from .base import Base


class AppointmentType(enum.Enum):
    """Appointment type enumeration."""
    VIDEO = "video"
    IN_PERSON = "in_person"
    PHONE = "phone"


class AppointmentStatus(enum.Enum):
    """Appointment status enumeration."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"


class Appointment(Base):
    """Appointment model for client-attorney meetings."""
    
    __tablename__ = 'appointments'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    
    # Date and Time
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)
    duration = Column(Integer)  # Duration in minutes
    
    # Appointment Type and Location
    appointment_type = Column(SQLEnum(AppointmentType), nullable=False, default=AppointmentType.VIDEO)
    location = Column(String(500))
    meeting_link = Column(String(500))  # Google Meet or Zoom link
    
    # Status
    status = Column(SQLEnum(AppointmentStatus), nullable=False, default=AppointmentStatus.PENDING)
    
    # Relationships
    client_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    attorney_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    case_id = Column(Integer, ForeignKey('cases.id'))
    
    # Relationships
    client = relationship('User', foreign_keys=[client_id], backref='client_appointments')
    attorney = relationship('User', foreign_keys=[attorney_id], backref='attorney_appointments')
    case = relationship('Case', backref='appointments')
    
    # Reminder and Notification
    reminder_sent = Column(DateTime)
    notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by_id = Column(Integer, ForeignKey('users.id'))
    
    created_by = relationship('User', foreign_keys=[created_by_id])
    
    def to_dict(self):
        """Convert appointment to dictionary."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'start_datetime': self.start_datetime.isoformat() if self.start_datetime else None,
            'end_datetime': self.end_datetime.isoformat() if self.end_datetime else None,
            'duration': self.duration,
            'appointment_type': self.appointment_type.value if self.appointment_type else None,
            'location': self.location,
            'meeting_link': self.meeting_link,
            'status': self.status.value if self.status else None,
            'client_id': self.client_id,
            'client_name': self.client.name if self.client else None,
            'client_phone': self.client.phone if self.client else None,
            'attorney_id': self.attorney_id,
            'attorney_name': self.attorney.name if self.attorney else None,
            'attorney_phone': self.attorney.phone if self.attorney else None,
            'case_id': self.case_id,
            'case_reference': self.case.reference_number if self.case else None,
            'reminder_sent': self.reminder_sent.isoformat() if self.reminder_sent else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
