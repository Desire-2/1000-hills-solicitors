"""
Case management routes.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services import CaseService
from utils import role_required, case_to_dict, get_current_user, validate_required_fields
from models import Role

case_bp = Blueprint('case', __name__, url_prefix='/cases')


# --- Client Routes ---

@case_bp.route('/', methods=['POST'])
@jwt_required()
def submit_case():
    """Client submits a new case."""
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    # Validate required fields
    is_valid, error_msg = validate_required_fields(
        data,
        ['title', 'category', 'description']
    )
    
    if not is_valid:
        return jsonify({"msg": error_msg}), 400

    case, error = CaseService.create_case(
        title=data['title'],
        description=data['description'],
        category=data['category'],
        client_id=current_user_id
    )
    
    if error:
        return jsonify({"msg": "Failed to create case", "error": error}), 500
    
    return jsonify({
        "msg": "Case submitted successfully",
        "case": case_to_dict(case)
    }), 201


@case_bp.route('/', methods=['GET'])
@jwt_required()
def get_client_cases():
    """Client views their own cases."""
    current_user_id = get_jwt_identity()
    cases = CaseService.get_cases_by_client(current_user_id)
    
    return jsonify([case_to_dict(case) for case in cases]), 200


@case_bp.route('/<int:case_id>', methods=['GET'])
@jwt_required()
def get_case_details(case_id):
    """Client views a specific case detail."""
    current_user = get_current_user()
    
    case, error = CaseService.get_case_by_id(
        case_id,
        user_id=current_user.id,
        user_role=current_user.role
    )
    
    if error:
        return jsonify({"msg": error}), 404
    
    return jsonify(case_to_dict(case)), 200


# --- Admin/Staff Routes ---

@case_bp.route('/admin', methods=['GET'])
@role_required(Role.CASE_MANAGER, Role.SUPER_ADMIN)
def get_all_cases():
    """Staff views all cases."""
    status = request.args.get('status')
    
    if status:
        cases = CaseService.get_cases_by_status(status)
    else:
        cases = CaseService.get_all_cases()
    
    return jsonify([case_to_dict(case) for case in cases]), 200


@case_bp.route('/admin/<int:case_id>', methods=['GET'])
@role_required(Role.CASE_MANAGER, Role.SUPER_ADMIN)
def get_admin_case_details(case_id):
    """Staff views a specific case detail."""
    case, error = CaseService.get_case_by_id(case_id)
    
    if error:
        return jsonify({"msg": error}), 404
    
    return jsonify(case_to_dict(case)), 200


@case_bp.route('/admin/<int:case_id>', methods=['PUT'])
@role_required(Role.CASE_MANAGER, Role.SUPER_ADMIN)
def update_case(case_id):
    """Staff updates case status, priority, or assignment."""
    data = request.get_json()
    
    case, error = CaseService.update_case(
        case_id,
        status=data.get('status'),
        priority=data.get('priority'),
        assigned_to_id=data.get('assigned_to_id')
    )
    
    if error:
        return jsonify({"msg": error}), 400
    
    return jsonify({
        "msg": "Case updated successfully",
        "case": case_to_dict(case)
    }), 200


# --- Service/CMS Routes (Placeholder) ---

@case_bp.route('/services', methods=['GET'])
def get_services():
    """Get all published services for the public website."""
    # Placeholder for actual Service model query
    return jsonify([
        {
            "id": 1,
            "title": "Legal Consultancy",
            "slug": "legal-consultancy",
            "summary": "Expert advice on legal matters."
        },
        {
            "id": 2,
            "title": "Mediation Services",
            "slug": "mediation-services",
            "summary": "Alternative dispute resolution."
        },
    ]), 200


@case_bp.route('/admin/services', methods=['POST'])
@role_required(Role.CONTENT_EDITOR, Role.SUPER_ADMIN)
def create_service():
    """Staff creates a new service."""
    # Implementation for creating a Service object
    return jsonify({"msg": "Service creation endpoint (CMS)"}), 201
