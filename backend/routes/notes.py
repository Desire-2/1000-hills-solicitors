"""
Case notes routes.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.note_service import CaseNoteService
from services.case_service import CaseService
from utils import role_required, get_current_user, validate_required_fields
from models import Role

notes_bp = Blueprint('notes', __name__, url_prefix='/cases/<int:case_id>/notes')


@notes_bp.route('/', methods=['GET'])
@jwt_required()
def get_case_notes(case_id):
    """Get all notes for a case."""
    current_user = get_current_user()
    
    # Verify user has access to the case
    case, error = CaseService.get_case_by_id(
        case_id,
        user_id=current_user.id,
        user_role=current_user.role
    )
    
    if error:
        return jsonify({"msg": error}), 404
    
    notes, error = CaseNoteService.get_case_notes(case_id, current_user.role)
    
    if error:
        return jsonify({"msg": error}), 500
    
    return jsonify([{
        'id': note.id,
        'content': note.content,
        'is_private': note.is_private,
        'author': {
            'id': note.author.id,
            'name': note.author.name,
            'role': note.author.role.value
        },
        'created_at': note.created_at.isoformat()
    } for note in notes]), 200


@notes_bp.route('/', methods=['POST'])
@jwt_required()
@role_required(Role.CASE_MANAGER, Role.SUPER_ADMIN)
def create_case_note(case_id):
    """Create a new case note (staff only)."""
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    is_valid, error_msg = validate_required_fields(data, ['content'])
    if not is_valid:
        return jsonify({"msg": error_msg}), 400
    
    note, error = CaseNoteService.create_note(
        case_id=case_id,
        content=data['content'],
        author_id=current_user_id,
        is_private=data.get('is_private', True)
    )
    
    if error:
        return jsonify({"msg": error}), 400
    
    return jsonify({
        "msg": "Note created successfully",
        "note": {
            'id': note.id,
            'content': note.content,
            'is_private': note.is_private,
            'created_at': note.created_at.isoformat()
        }
    }), 201


@notes_bp.route('/<int:note_id>', methods=['PUT'])
@jwt_required()
@role_required(Role.CASE_MANAGER, Role.SUPER_ADMIN)
def update_case_note(case_id, note_id):
    """Update a case note."""
    data = request.get_json()
    
    note, error = CaseNoteService.update_note(
        note_id,
        content=data.get('content'),
        is_private=data.get('is_private')
    )
    
    if error:
        return jsonify({"msg": error}), 404
    
    return jsonify({
        "msg": "Note updated successfully",
        "note": {
            'id': note.id,
            'content': note.content,
            'is_private': note.is_private
        }
    }), 200


@notes_bp.route('/<int:note_id>', methods=['DELETE'])
@jwt_required()
@role_required(Role.CASE_MANAGER, Role.SUPER_ADMIN)
def delete_case_note(case_id, note_id):
    """Delete a case note."""
    success, error = CaseNoteService.delete_note(note_id)
    
    if error:
        return jsonify({"msg": error}), 404
    
    return jsonify({"msg": "Note deleted successfully"}), 200
