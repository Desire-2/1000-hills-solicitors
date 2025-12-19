from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
import enum

Base = declarative_base()

# --- Enums ---

class Role(enum.Enum):
    CLIENT = "CLIENT"
    CASE_MANAGER = "CASE_MANAGER"
    CONTENT_EDITOR = "CONTENT_EDITOR"
    SUPER_ADMIN = "SUPER_ADMIN"
    VIEWER = "VIEWER"

class CaseCategory(enum.Enum):
    LEGAL_CONSULTANCY = "LEGAL_CONSULTANCY"
    MEDIATION = "MEDIATION"
    LITIGATION = "LITIGATION"
    OTHER = "OTHER"

class CaseStatus(enum.Enum):
    NEW = "NEW"
    IN_REVIEW = "IN_REVIEW"
    IN_PROGRESS = "IN_PROGRESS"
    AWAITING_CLIENT = "AWAITING_CLIENT"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"

class Priority(enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"

# --- Core Models ---

class User(Base):
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
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Case(Base):
    __tablename__ = 'cases'
    id = Column(Integer, primary_key=True)
    case_id = Column(String, unique=True, nullable=False) # Format: 1000HILLS-2024-001
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(Enum(CaseCategory), nullable=False)
    status = Column(Enum(CaseStatus), default=CaseStatus.NEW, nullable=False)
    priority = Column(Enum(Priority), default=Priority.MEDIUM, nullable=False)
    
    # Foreign Keys
    client_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    assigned_to_id = Column(Integer, ForeignKey('users.id')) # Staff member assigned
    
    # Relationships
    client = relationship("User", back_populates="cases_client", foreign_keys=[client_id])
    assigned_to = relationship("User", back_populates="cases_assigned", foreign_keys=[assigned_to_id])
    documents = relationship("Document", back_populates="case")
    messages = relationship("Message", back_populates="case")
    notes = relationship("CaseNote", back_populates="case")
    deadlines = relationship("Deadline", back_populates="case")
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Message(Base):
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
    attachments = relationship("Document", back_populates="message") # Documents attached to a message
    
    created_at = Column(DateTime, default=func.now())

class Document(Base):
    __tablename__ = 'documents'
    id = Column(Integer, primary_key=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False) # Path to S3/local storage
    file_size = Column(Integer) # Size in bytes
    mime_type = Column(String)
    
    # Foreign Keys (Document can be attached to a Case or a Message)
    case_id = Column(Integer, ForeignKey('cases.id'))
    message_id = Column(Integer, ForeignKey('messages.id'))
    uploaded_by_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Relationships
    case = relationship("Case", back_populates="documents")
    message = relationship("Message", back_populates="attachments")
    uploaded_by = relationship("User")
    
    created_at = Column(DateTime, default=func.now())

class CaseNote(Base):
    __tablename__ = 'case_notes'
    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    is_private = Column(Boolean, default=True) # Only visible to staff
    
    # Foreign Keys
    case_id = Column(Integer, ForeignKey('cases.id'), nullable=False)
    author_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Relationships
    case = relationship("Case", back_populates="notes")
    author = relationship("User", back_populates="notes", foreign_keys=[author_id])
    
    created_at = Column(DateTime, default=func.now())

class Deadline(Base):
    __tablename__ = 'deadlines'
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    due_date = Column(DateTime, nullable=False)
    is_completed = Column(Boolean, default=False)
    
    # Foreign Keys
    case_id = Column(Integer, ForeignKey('cases.id'), nullable=False)
    
    # Relationships
    case = relationship("Case", back_populates="deadlines")
    
    created_at = Column(DateTime, default=func.now())

# --- CMS Models ---

class Service(Base):
    __tablename__ = 'services'
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    description = Column(Text)
    full_content = Column(Text)
    is_published = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class TeamMember(Base):
    __tablename__ = 'team_members'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    title = Column(String)
    bio = Column(Text)
    photo_url = Column(String)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class BlogPost(Base):
    __tablename__ = 'blog_posts'
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    summary = Column(Text)
    content = Column(Text)
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime)
    author_id = Column(Integer, ForeignKey('users.id'))
    
    # Relationships
    author = relationship("User")
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# Utility function to initialize the database (for setup phase)
def init_db(engine):
    Base.metadata.create_all(engine)

if __name__ == '__main__':
    # Example usage for local testing (will be replaced by Flask config)
    # engine = create_engine('sqlite:///./test.db')
    # init_db(engine)
    pass
