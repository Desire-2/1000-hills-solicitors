"""
CMS (Content Management System) models.
"""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class Service(Base):
    """Service model for website services."""
    __tablename__ = 'services'
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    description = Column(Text)
    full_content = Column(Text)
    is_published = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f'<Service {self.title}>'


class TeamMember(Base):
    """Team Member model for website team page."""
    __tablename__ = 'team_members'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    title = Column(String)
    bio = Column(Text)
    photo_url = Column(String)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f'<TeamMember {self.name}>'


class BlogPost(Base):
    """Blog Post model for insights/blog section."""
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
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f'<BlogPost {self.title}>'
