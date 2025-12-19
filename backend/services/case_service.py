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
            
            # Convert priority string to enum
            if isinstance(priority, str):
                priority = Priority[priority.upper()]
            
            # Create new case
            new_case = Case(
                case_id=case_id,
                title=title,
                description=description,
                category=category,
                client_id=client_id,
                status=CaseStatus.PENDING,
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
    
    @staticmethod
    def get_cases_by_assignee(assignee_id):
        """Get cases assigned to a specific staff member."""
        cases = db.session.execute(
            select(Case)
            .filter_by(assigned_to_id=assignee_id)
            .order_by(Case.created_at.desc())
        ).scalars().all()
        return cases
    
    @staticmethod
    def filter_cases(status=None, category=None, priority=None, assigned_to_id=None, client_id=None):
        """Filter cases by multiple criteria."""
        query = select(Case)
        
        if status:
            if isinstance(status, str):
                status = CaseStatus[status.upper()]
            query = query.filter_by(status=status)
        
        if category:
            if isinstance(category, str):
                category = CaseCategory[category.upper()]
            query = query.filter_by(category=category)
        
        if priority:
            if isinstance(priority, str):
                priority = Priority[priority.upper()]
            query = query.filter_by(priority=priority)
        
        if assigned_to_id is not None:
            query = query.filter_by(assigned_to_id=assigned_to_id)
        
        if client_id:
            query = query.filter_by(client_id=client_id)
        
        query = query.order_by(Case.created_at.desc())
        cases = db.session.execute(query).scalars().all()
        return cases
    
    @staticmethod
    def get_case_statistics(user_id=None, role=None):
        """Get case statistics for dashboard."""
        try:
            stats = {}
            
            # Base query filter conditions
            if user_id and role == Role.CLIENT:
                # Client sees only their cases
                base_filter = Case.client_id == user_id
            else:
                # Staff sees all cases
                base_filter = True
            
            # Count by status
            for status in CaseStatus:
                count = db.session.execute(
                    select(Case).filter(base_filter, Case.status == status)
                ).scalars().all()
                stats[status.value.lower()] = len(count)
            
            # Count by priority
            priority_counts = {}
            for priority in Priority:
                count = db.session.execute(
                    select(Case).filter(base_filter, Case.priority == priority)
                ).scalars().all()
                priority_counts[priority.value.lower()] = len(count)
            stats['by_priority'] = priority_counts
            
            # Total count
            total = db.session.execute(
                select(Case).filter(base_filter)
            ).scalars().all()
            stats['total'] = len(total)
            
            # My cases (for staff)
            if user_id and role in [Role.CASE_MANAGER, Role.SUPER_ADMIN]:
                my_cases = db.session.execute(
                    select(Case).filter_by(assigned_to_id=user_id)
                ).scalars().all()
                stats['my_cases'] = len(my_cases)
            
            return stats, None
        except Exception as e:
            return None, str(e)
    
    @staticmethod
    def delete_case(case_id):
        """Delete a case (soft delete - mark as closed)."""
        case = db.session.execute(
            select(Case).filter_by(id=case_id)
        ).scalar_one_or_none()
        
        if not case:
            return False, "Case not found"
        
        try:
            case.status = CaseStatus.CLOSED
            db.session.commit()
            return True, None
        except Exception as e:
            db.session.rollback()
            return False, str(e)
