from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Case, User, Role, CaseStatus, CaseCategory, Priority
from auth import role_required
from sqlalchemy import select

case_bp = Blueprint('case', __name__, url_prefix='/cases')

def case_to_dict(case):
    """Helper function to serialize a Case object."""
    return {
        "id": case.id,
        "case_id": case.case_id,
        "title": case.title,
        "description": case.description,
        "category": case.category.value,
        "status": case.status.value,
        "priority": case.priority.value,
        "client_id": case.client_id,
        "client_name": case.client.name,
        "assigned_to_id": case.assigned_to_id,
        "assigned_to_name": case.assigned_to.name if case.assigned_to else None,
        "created_at": case.created_at.isoformat(),
        "updated_at": case.updated_at.isoformat(),
    }

# --- Client Routes ---

@case_bp.route('/', methods=['POST'])
@jwt_required()
def submit_case():
    """Client submits a new case."""
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    # Basic validation
    if not all(k in data for k in ('title', 'category', 'description')):
        return jsonify({"msg": "Missing required fields"}), 400

    try:
        # Generate a simple case ID (e.g., 1000HILLS-2025-001)
        # In a real app, this would be a more robust sequence generator
        last_case = db.session.execute(select(Case).order_by(Case.id.desc())).scalar_one_or_none()
        next_id = (last_case.id if last_case else 0) + 1
        case_id = f"1000HILLS-{Case.created_at.default.arg.year}-{next_id:03d}"
        
        new_case = Case(
            case_id=case_id,
            title=data['title'],
            description=data['description'],
            category=CaseCategory[data['category'].upper()],
            client_id=current_user_id,
            status=CaseStatus.NEW,
            priority=Priority.MEDIUM # Default priority
        )
        
        db.session.add(new_case)
        db.session.commit()
        
        return jsonify({"msg": "Case submitted successfully", "case": case_to_dict(new_case)}), 201
    except KeyError:
        return jsonify({"msg": "Invalid case category"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "An error occurred during submission", "error": str(e)}), 500

@case_bp.route('/', methods=['GET'])
@jwt_required()
def get_client_cases():
    """Client views their own cases."""
    current_user_id = get_jwt_identity()
    
    cases = db.session.execute(
        select(Case).filter_by(client_id=current_user_id).order_by(Case.created_at.desc())
    ).scalars().all()
    
    return jsonify([case_to_dict(case) for case in cases]), 200

@case_bp.route('/<int:case_id>', methods=['GET'])
@jwt_required()
def get_case_details(case_id):
    """Client views a specific case detail."""
    current_user_id = get_jwt_identity()
    
    case = db.session.execute(
        select(Case).filter_by(id=case_id, client_id=current_user_id)
    ).scalar_one_or_none()
    
    if not case:
        return jsonify({"msg": "Case not found or access denied"}), 404
    
    return jsonify(case_to_dict(case)), 200

# --- Admin/Staff Routes ---

@case_bp.route('/admin', methods=['GET'])
@role_required(Role.CASE_MANAGER) # Only Case Managers and above can view all cases
def get_all_cases():
    """Staff views all cases."""
    cases = db.session.execute(
        select(Case).order_by(Case.created_at.desc())
    ).scalars().all()
    
    return jsonify([case_to_dict(case) for case in cases]), 200

@case_bp.route('/admin/<int:case_id>', methods=['GET'])
@role_required(Role.CASE_MANAGER)
def get_admin_case_details(case_id):
    """Staff views a specific case detail."""
    case = db.session.execute(select(Case).filter_by(id=case_id)).scalar_one_or_none()
    
    if not case:
        return jsonify({"msg": "Case not found"}), 404
    
    return jsonify(case_to_dict(case)), 200

@case_bp.route('/admin/<int:case_id>', methods=['PUT'])
@role_required(Role.CASE_MANAGER)
def update_case(case_id):
    """Staff updates case status, priority, or assignment."""
    data = request.get_json()
    case = db.session.execute(select(Case).filter_by(id=case_id)).scalar_one_or_none()
    
    if not case:
        return jsonify({"msg": "Case not found"}), 404

    try:
        if 'status' in data:
            case.status = CaseStatus[data['status'].upper()]
        if 'priority' in data:
            case.priority = Priority[data['priority'].upper()]
        if 'assigned_to_id' in data:
            # Check if assigned user is a staff member (Case Manager or Super Admin)
            assigned_user = db.session.execute(select(User).filter_by(id=data['assigned_to_id'])).scalar_one_or_none()
            if assigned_user and assigned_user.role in [Role.CASE_MANAGER, Role.SUPER_ADMIN]:
                case.assigned_to_id = data['assigned_to_id']
            else:
                return jsonify({"msg": "Invalid user ID for assignment or user is not staff"}), 400
        
        db.session.commit()
        return jsonify({"msg": "Case updated successfully", "case": case_to_dict(case)}), 200
    except KeyError:
        return jsonify({"msg": "Invalid status or priority value"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "An error occurred during update", "error": str(e)}), 500

# --- CMS Routes (Placeholder for Service Management) ---

@case_bp.route('/services', methods=['GET'])
def get_services():
    """Get all published services for the public website."""
    # Placeholder for actual Service model query
    return jsonify([
        {"id": 1, "title": "Legal Consultancy", "slug": "legal-consultancy", "summary": "Expert advice on legal matters."},
        {"id": 2, "title": "Mediation Services", "slug": "mediation-services", "summary": "Alternative dispute resolution."},
    ]), 200

@case_bp.route('/admin/services', methods=['POST'])
@role_required(Role.CONTENT_EDITOR)
def create_service():
    """Staff creates a new service."""
    # Implementation for creating a Service object
    return jsonify({"msg": "Service creation endpoint (CMS)"}), 201

# Register the blueprint in app.py (Next step)
