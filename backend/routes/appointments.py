"""  
Appointment routes for managing client-attorney meetings.
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from functools import wraps
from extensions import db
from models import Appointment, AppointmentType, AppointmentStatus, User, Case, Role
from utils.decorators import role_required
from utils.google_meet import google_meet_service
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid

appointments_bp = Blueprint('appointments', __name__, url_prefix='/api/appointments')


# CORS preflight handler
@appointments_bp.route('', methods=['OPTIONS'])
@appointments_bp.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path=None):
    """Handle CORS preflight requests."""
    return '', 204


def generate_google_meet_link(appointment_id, title=""):
    """
    Generate a Google Meet link for an appointment.
    Uses the Google Meet service for consistent link generation.
    """
    return google_meet_service.generate_meet_link(appointment_id, title)


def send_appointment_confirmation(appointment, user_type="client"):
    """
    Send appointment confirmation email to client and/or attorney.
    
    Args:
        appointment: Appointment object
        user_type: "client", "attorney", or "both"
    """
    appointment_details = {
        'title': appointment.title,
        'start_datetime': appointment.start_datetime.strftime('%B %d, %Y at %I:%M %p'),
        'end_datetime': appointment.end_datetime.strftime('%I:%M %p'),
        'appointment_type': appointment.appointment_type.value,
        'meeting_link': appointment.meeting_link,
        'location': appointment.location,
    }
    
    # Send to client
    if user_type in ["client", "both"] and appointment.client:
        try:
            google_meet_service.send_confirmation_email(
                recipient_email=appointment.client.email,
                recipient_name=appointment.client.name,
                appointment_details=appointment_details
            )
        except Exception as e:
            print(f"Failed to send confirmation to client: {str(e)}")
    
    # Send to attorney
    if user_type in ["attorney", "both"] and appointment.attorney:
        try:
            google_meet_service.send_confirmation_email(
                recipient_email=appointment.attorney.email,
                recipient_name=appointment.attorney.name,
                appointment_details=appointment_details
            )
        except Exception as e:
            print(f"Failed to send confirmation to attorney: {str(e)}")


@appointments_bp.route('', methods=['GET'])
@jwt_required()
def get_appointments():
    """Get all appointments for the current user."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get query parameters
        status = request.args.get('status')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Build query based on user role
        if user.role == Role.CLIENT:
            query = Appointment.query.filter_by(client_id=current_user_id)
        elif user.role in [Role.CASE_MANAGER, Role.SUPER_ADMIN]:
            # Managers and admins can see all appointments
            query = Appointment.query
        else:
            # Other roles see appointments where they are the attorney
            query = Appointment.query.filter_by(attorney_id=current_user_id)
        
        # Apply filters
        if status:
            try:
                status_enum = AppointmentStatus(status)
                query = query.filter_by(status=status_enum)
            except ValueError:
                pass
        
        if start_date:
            try:
                start = datetime.fromisoformat(start_date)
                query = query.filter(Appointment.start_datetime >= start)
            except ValueError:
                pass
        
        if end_date:
            try:
                end = datetime.fromisoformat(end_date)
                query = query.filter(Appointment.start_datetime <= end)
            except ValueError:
                pass
        
        # Order by date
        appointments = query.order_by(Appointment.start_datetime.desc()).all()
        
        return jsonify({
            'appointments': [apt.to_dict() for apt in appointments],
            'count': len(appointments)
        }), 200
        
    except Exception as e:
        print(f"Error fetching appointments: {str(e)}")
        return jsonify({'error': 'Failed to fetch appointments'}), 500


@appointments_bp.route('/<int:appointment_id>', methods=['GET'])
@jwt_required()
def get_appointment(appointment_id):
    """Get a specific appointment."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404
        
        # Check authorization
        if user.role == Role.CLIENT and appointment.client_id != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Non-admin/manager roles can only see their own appointments
        if user.role not in [Role.SUPER_ADMIN, Role.CASE_MANAGER] and appointment.attorney_id != current_user_id and appointment.client_id != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        return jsonify(appointment.to_dict()), 200
        
    except Exception as e:
        print(f"Error fetching appointment: {str(e)}")
        return jsonify({'error': 'Failed to fetch appointment'}), 500


@appointments_bp.route('', methods=['POST'])
@jwt_required()
def create_appointment():
    """Create a new appointment."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'start_datetime', 'end_datetime', 'attorney_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Parse dates
        try:
            start_datetime = datetime.fromisoformat(data['start_datetime'].replace('Z', '+00:00'))
            end_datetime = datetime.fromisoformat(data['end_datetime'].replace('Z', '+00:00'))
        except ValueError as e:
            return jsonify({'error': f'Invalid datetime format: {str(e)}'}), 400
        
        # Validate dates
        now = datetime.utcnow()
        if start_datetime < now:
            return jsonify({'error': 'Appointment cannot be scheduled in the past'}), 400
        
        if end_datetime <= start_datetime:
            return jsonify({'error': 'End time must be after start time'}), 400
        
        # Calculate duration
        duration = int((end_datetime - start_datetime).total_seconds() / 60)
        
        # Validate duration (should be at least 15 minutes and not more than 8 hours)
        if duration < 15:
            return jsonify({'error': 'Appointment must be at least 15 minutes long'}), 400
        
        if duration > 480:  # 8 hours
            return jsonify({'error': 'Appointment cannot exceed 8 hours'}), 400
        
        # Determine client and attorney
        if user.role == Role.CLIENT:
            client_id = current_user_id
            attorney_id = data['attorney_id']
        else:
            # Staff creating appointment - client is optional (can be anonymous)
            client_id = data.get('client_id')
            attorney_id = data.get('attorney_id')
            
            # If no attorney specified, assign to current user (manager/admin)
            if not attorney_id:
                attorney_id = current_user_id
        
        # Validate users exist (only if IDs provided)
        if client_id:
            client = User.query.get(client_id)
            if not client:
                return jsonify({'error': 'Invalid client ID'}), 400
        
        # Validate attorney - if it's the current user, no need to query
        if attorney_id == current_user_id:
            attorney = user
        else:
            attorney = User.query.get(attorney_id)
            if not attorney:
                return jsonify({'error': 'Invalid attorney ID'}), 400
            
        # Verify attorney is not a client
        if attorney.role == Role.CLIENT:
            return jsonify({'error': 'Attorney must be a staff member (Manager or Admin)'}), 400
        
        # Get appointment type
        appointment_type = AppointmentType(data.get('appointment_type', 'video'))
        
        # Determine initial status based on who's creating
        if user.role in [Role.SUPER_ADMIN, Role.CASE_MANAGER]:
            # Managers/Admins can directly confirm
            initial_status = AppointmentStatus(data.get('status', 'confirmed'))
        else:
            # Clients create pending appointments
            initial_status = AppointmentStatus.PENDING
        
        # Get location - only managers/admins can set this
        location = None
        if user.role in [Role.SUPER_ADMIN, Role.CASE_MANAGER]:
            location = data.get('location')
        
        # Create appointment
        appointment = Appointment(
            title=data['title'],
            description=data.get('description'),
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            duration=duration,
            appointment_type=appointment_type,
            location=location,
            status=initial_status,
            client_id=client_id,
            attorney_id=attorney_id,
            case_id=data.get('case_id'),
            notes=data.get('notes'),
            created_by_id=current_user_id
        )
        
        db.session.add(appointment)
        db.session.flush()  # Get the ID
        
        # Generate Google Meet link for video appointments that are confirmed
        if appointment_type == AppointmentType.VIDEO and initial_status == AppointmentStatus.CONFIRMED:
            try:
                appointment.meeting_link = generate_google_meet_link(appointment.id, data['title'])
                print(f"Generated meeting link for appointment {appointment.id}: {appointment.meeting_link}")
            except Exception as e:
                print(f"Failed to generate meeting link: {str(e)}")
                # Continue anyway - user can be notified to contact support
        
        # For phone appointments, store client's phone number if provided
        if appointment_type == AppointmentType.PHONE and 'client_phone' in data:
            if client:
                client.phone = data['client_phone']
        
        db.session.commit()
        
        # Send confirmation emails if appointment is confirmed
        if initial_status == AppointmentStatus.CONFIRMED:
            try:
                send_appointment_confirmation(appointment, user_type="both")
            except Exception as e:
                print(f"Failed to send confirmation emails: {str(e)}")
        
        return jsonify({
            'message': 'Appointment created successfully',
            'appointment': appointment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating appointment: {str(e)}")
        return jsonify({'error': 'Failed to create appointment'}), 500


@appointments_bp.route('/<int:appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment(appointment_id):
    """Update an existing appointment."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        data = request.get_json()
        
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404
        
        # Check authorization
        if user.role == Role.CLIENT and appointment.client_id != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update fields
        if 'title' in data:
            appointment.title = data['title']
        
        if 'description' in data:
            appointment.description = data['description']
        
        if 'start_datetime' in data:
            appointment.start_datetime = datetime.fromisoformat(data['start_datetime'].replace('Z', '+00:00'))
        
        if 'end_datetime' in data:
            appointment.end_datetime = datetime.fromisoformat(data['end_datetime'].replace('Z', '+00:00'))
        
        # Recalculate duration
        if appointment.start_datetime and appointment.end_datetime:
            appointment.duration = int((appointment.end_datetime - appointment.start_datetime).total_seconds() / 60)
        
        if 'appointment_type' in data:
            old_type = appointment.appointment_type
            appointment.appointment_type = AppointmentType(data['appointment_type'])
            
            # Generate Google Meet link if changing to video and confirmed
            if (appointment.appointment_type == AppointmentType.VIDEO and 
                appointment.status == AppointmentStatus.CONFIRMED and 
                not appointment.meeting_link):
                try:
                    appointment.meeting_link = generate_google_meet_link(appointment.id, appointment.title)
                    print(f"Generated meeting link for appointment {appointment.id}: {appointment.meeting_link}")
                except Exception as e:
                    print(f"Failed to generate meeting link: {str(e)}")
            
            # For phone appointments, update client phone if provided
            if appointment.appointment_type == AppointmentType.PHONE and 'client_phone' in data:
                client = User.query.get(appointment.client_id)
                if client:
                    client.phone = data['client_phone']
        
        # Only managers/admins can set location
        if 'location' in data and user.role in [Role.SUPER_ADMIN, Role.CASE_MANAGER]:
            appointment.location = data['location']
        
        # Allow managers/admins to manually set meeting link
        if 'meeting_link' in data and user.role in [Role.SUPER_ADMIN, Role.CASE_MANAGER]:
            manual_link = data['meeting_link'].strip()
            if manual_link:
                # Validate that it's a Google Meet link
                if 'meet.google.com' in manual_link or manual_link.startswith('https://'):
                    appointment.meeting_link = manual_link
                    print(f"Manual meeting link set for appointment {appointment.id}: {manual_link}")
                else:
                    return jsonify({'error': 'Invalid meeting link format'}), 400
        
        status_changed_to_confirmed = False
        if 'status' in data:
            old_status = appointment.status
            new_status = AppointmentStatus(data['status'])
            appointment.status = new_status
            
            # Auto-generate Google Meet link when status changes to confirmed for video appointments
            # Only if no manual link was provided and no link exists
            if new_status == AppointmentStatus.CONFIRMED and old_status != AppointmentStatus.CONFIRMED:
                status_changed_to_confirmed = True
                if appointment.appointment_type == AppointmentType.VIDEO and not appointment.meeting_link:
                    # Check if manual link was provided in this request
                    if 'meeting_link' not in data or not data['meeting_link']:
                        try:
                            appointment.meeting_link = generate_google_meet_link(appointment.id, appointment.title)
                            print(f"Auto-generated meeting link for appointment {appointment.id}: {appointment.meeting_link}")
                        except Exception as e:
                            print(f"Failed to generate meeting link: {str(e)}")
                            # Return error so frontend can notify user
                            db.session.rollback()
                            return jsonify({
                                'error': 'Appointment confirmed but failed to generate meeting link. Please contact support.'
                            }), 500
        
        if 'notes' in data:
            appointment.notes = data['notes']
        
        if 'attorney_id' in data and user.role in [Role.SUPER_ADMIN, Role.CASE_MANAGER]:
            appointment.attorney_id = data['attorney_id']
        
        appointment.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Send confirmation emails if status just changed to confirmed
        if status_changed_to_confirmed:
            try:
                send_appointment_confirmation(appointment, user_type="both")
            except Exception as e:
                print(f"Failed to send confirmation emails: {str(e)}")
                # Don't fail the request - appointment is already confirmed
        
        return jsonify({
            'message': 'Appointment updated successfully',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating appointment: {str(e)}")
        return jsonify({'error': 'Failed to update appointment'}), 500


@appointments_bp.route('/<int:appointment_id>', methods=['DELETE'])
@jwt_required()
@role_required([Role.SUPER_ADMIN, Role.CASE_MANAGER])
def delete_appointment(appointment_id):
    """Delete an appointment."""
    try:
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404
        
        db.session.delete(appointment)
        db.session.commit()
        
        return jsonify({'message': 'Appointment deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting appointment: {str(e)}")
        return jsonify({'error': 'Failed to delete appointment'}), 500


@appointments_bp.route('/<int:appointment_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_appointment(appointment_id):
    """Cancel an appointment."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404
        
        # Check authorization
        if user.role == Role.CLIENT and appointment.client_id != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        appointment.status = AppointmentStatus.CANCELLED
        appointment.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Appointment cancelled successfully',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error cancelling appointment: {str(e)}")
        return jsonify({'error': 'Failed to cancel appointment'}), 500


@appointments_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_appointment_stats():
    """Get appointment statistics for the current user."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        # Base query based on role
        if user.role == Role.CLIENT:
            base_query = Appointment.query.filter_by(client_id=current_user_id)
        elif user.role in [Role.SUPER_ADMIN, Role.CASE_MANAGER]:
            base_query = Appointment.query
        else:
            base_query = Appointment.query.filter_by(attorney_id=current_user_id)
        
        # Get current date
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Calculate stats
        upcoming = base_query.filter(
            Appointment.start_datetime >= now,
            Appointment.status.in_([AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED])
        ).count()
        
        this_month = base_query.filter(
            Appointment.start_datetime >= month_start
        ).count()
        
        completed = base_query.filter_by(
            status=AppointmentStatus.COMPLETED
        ).count()
        
        pending = base_query.filter_by(
            status=AppointmentStatus.PENDING
        ).count()
        
        return jsonify({
            'upcoming': upcoming,
            'this_month': this_month,
            'completed': completed,
            'pending': pending
        }), 200
        
    except Exception as e:
        print(f"Error fetching appointment stats: {str(e)}")
        return jsonify({'error': 'Failed to fetch appointment stats'}), 500


@appointments_bp.route('/attorneys', methods=['GET'])
@jwt_required()
def get_available_attorneys():
    """Get list of available attorneys for booking."""
    try:
        # Get all non-client users who can handle appointments
        attorneys = User.query.filter(User.role != Role.CLIENT).all()
        
        # If no attorneys found, return empty list
        if not attorneys:
            attorneys = []
        
        return jsonify({
            'attorneys': [{
                'id': attorney.id,
                'name': attorney.name,
                'email': attorney.email
            } for attorney in attorneys]
        }), 200
        
    except Exception as e:
        print(f"Error fetching attorneys: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch attorneys', 'details': str(e)}), 500


@appointments_bp.route('/<int:appointment_id>/regenerate-link', methods=['POST'])
@jwt_required()
@role_required([Role.SUPER_ADMIN, Role.CASE_MANAGER])
def regenerate_meeting_link(appointment_id):
    """Regenerate Google Meet link for an appointment (Admin/Manager only)."""
    try:
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404
        
        # Only video appointments can have meeting links
        if appointment.appointment_type != AppointmentType.VIDEO:
            return jsonify({'error': 'Meeting links are only for video appointments'}), 400
        
        # Only confirmed appointments should have meeting links
        if appointment.status != AppointmentStatus.CONFIRMED:
            return jsonify({'error': 'Appointment must be confirmed first'}), 400
        
        # Generate new meeting link
        try:
            appointment.meeting_link = generate_google_meet_link(appointment.id, appointment.title)
            appointment.updated_at = datetime.utcnow()
            db.session.commit()
            
            # Send updated confirmation emails
            try:
                send_appointment_confirmation(appointment, user_type="both")
            except Exception as e:
                print(f"Failed to send confirmation emails: {str(e)}")
            
            return jsonify({
                'message': 'Meeting link regenerated successfully',
                'appointment': appointment.to_dict()
            }), 200
            
        except Exception as e:
            db.session.rollback()
            print(f"Failed to regenerate meeting link: {str(e)}")
            return jsonify({'error': 'Failed to generate meeting link'}), 500
        
    except Exception as e:
        db.session.rollback()
        print(f"Error regenerating meeting link: {str(e)}")
        return jsonify({'error': 'Failed to regenerate meeting link'}), 500
