"""
Helper utility functions.
"""
from datetime import datetime
from models import Case
from extensions import db
from sqlalchemy import select


def generate_case_id():
    """Generate a unique case ID in format: 1000HILLS-YYYY-NNN"""
    current_year = datetime.now().year
    
    # Get only the case_id field from the last case for the current year
    # This avoids loading invalid enum values from old data
    result = db.session.execute(
        select(Case.case_id)
        .filter(Case.case_id.like(f'1000HILLS-{current_year}-%'))
        .order_by(Case.id.desc())
        .limit(1)
    ).scalar_one_or_none()
    
    if result:
        # Extract the sequence number from the last case ID
        last_sequence = int(result.split('-')[-1])
        next_sequence = last_sequence + 1
    else:
        # First case of the year
        next_sequence = 1
    
    return f"1000HILLS-{current_year}-{next_sequence:03d}"


def validate_required_fields(data, required_fields):
    """Validate that all required fields are present in the request data."""
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    
    return True, None
