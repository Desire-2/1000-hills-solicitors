"""
Case management service for case operations.
"""
from extensions import db
from models import Case, User, Role, CaseStatus, CaseCategory, Priority
from sqlalchemy import select
from utils.helpers import generate_case_id


class CaseService:
    """Service class for case management operations."""
    
    @staticmethod
    def create_case(title, description, category, client_id, priority=Priority.MEDIUM):
        """Create a new case."""
        try:
            # Generate case ID
            case_id = generate_case_id()
            
            # Convert category string to enum
            if isinstance(category, str):
                category = CaseCategory[category.upper()]
            
            # Create new case
            new_case = Case(
                case_id=case_id,
                title=title,
                description=description,
                category=category,
                client_id=client_id,
                status=CaseStatus.NEW,
                priority=priority
            )
            
            db.session.add(new_case)
            db.session.commit()
            
            return new_case, None
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def get_cases_by_client(client_id):
        """Get all cases for a specific client."""
        cases = db.session.execute(
            select(Case)
            .filter_by(client_id=client_id)
            .order_by(Case.created_at.desc())
        ).scalars().all()
        return cases
    
    @staticmethod
    def get_all_cases():
        """Get all cases (admin view)."""
        cases = db.session.execute(
            select(Case).order_by(Case.created_at.desc())
        ).scalars().all()
        return cases
    
    @staticmethod
    def get_case_by_id(case_id, user_id=None, user_role=None):
        """Get a case by ID with optional access control."""
        case = db.session.execute(
            select(Case).filter_by(id=case_id)
        ).scalar_one_or_none()
        
        if not case:
            return None, "Case not found"
        
        # Check access control if user info provided
        if user_id is not None:
            # Staff can view all cases
            if user_role in [Role.CASE_MANAGER, Role.SUPER_ADMIN]:
                return case, None
            # Clients can only view their own cases
            elif case.client_id != user_id:
                return None, "Access denied"
        
        return case, None
    
    @staticmethod
    def update_case(case_id, status=None, priority=None, assigned_to_id=None):
        """Update a case."""
        case = db.session.execute(
            select(Case).filter_by(id=case_id)
        ).scalar_one_or_none()
        
        if not case:
            return None, "Case not found"
        
        try:
            if status:
                if isinstance(status, str):
                    status = CaseStatus[status.upper()]
                case.status = status
            
            if priority:
                if isinstance(priority, str):
                    priority = Priority[priority.upper()]
                case.priority = priority
            
            if assigned_to_id is not None:
                # Validate that assigned user is staff
                assigned_user = db.session.execute(
                    select(User).filter_by(id=assigned_to_id)
                ).scalar_one_or_none()
                
                if assigned_user and assigned_user.role in [Role.CASE_MANAGER, Role.SUPER_ADMIN]:
                    case.assigned_to_id = assigned_to_id
                else:
                    return None, "Invalid user for assignment"
            
            db.session.commit()
            return case, None
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def get_cases_by_status(status):
        """Get cases filtered by status."""
        if isinstance(status, str):
            status = CaseStatus[status.upper()]
        
        cases = db.session.execute(
            select(Case)
            .filter_by(status=status)
            .order_by(Case.created_at.desc())
        ).scalars().all()
        return cases
