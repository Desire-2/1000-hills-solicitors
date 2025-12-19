"""
Case notes management service.
"""
from extensions import db
from models import CaseNote, Case, User, Role
from sqlalchemy import select


class CaseNoteService:
    """Service class for case notes management."""
    
    @staticmethod
    def create_note(case_id, content, author_id, is_private=True):
        """Create a new case note."""
        try:
            # Verify case exists
            case = db.session.execute(
                select(Case).filter_by(id=case_id)
            ).scalar_one_or_none()
            
            if not case:
                return None, "Case not found"
            
            new_note = CaseNote(
                case_id=case_id,
                content=content,
                author_id=author_id,
                is_private=is_private
            )
            
            db.session.add(new_note)
            db.session.commit()
            
            return new_note, None
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def get_case_notes(case_id, user_role=None):
        """Get all notes for a case."""
        try:
            query = select(CaseNote).filter_by(case_id=case_id)
            
            # Clients can only see non-private notes
            if user_role == Role.CLIENT:
                query = query.filter_by(is_private=False)
            
            notes = db.session.execute(
                query.order_by(CaseNote.created_at.desc())
            ).scalars().all()
            
            return notes, None
        except Exception as e:
            return None, str(e)
    
    @staticmethod
    def update_note(note_id, content=None, is_private=None):
        """Update a case note."""
        note = db.session.execute(
            select(CaseNote).filter_by(id=note_id)
        ).scalar_one_or_none()
        
        if not note:
            return None, "Note not found"
        
        try:
            if content is not None:
                note.content = content
            if is_private is not None:
                note.is_private = is_private
            
            db.session.commit()
            return note, None
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def delete_note(note_id):
        """Delete a case note."""
        note = db.session.execute(
            select(CaseNote).filter_by(id=note_id)
        ).scalar_one_or_none()
        
        if not note:
            return False, "Note not found"
        
        try:
            db.session.delete(note)
            db.session.commit()
            return True, None
        except Exception as e:
            db.session.rollback()
            return False, str(e)
