"""
Script to fix invalid enum values in the database.
This updates old enum values to match the current enum definitions.
"""
from app import app
from extensions import db
from sqlalchemy import text

def fix_case_categories():
    """Fix invalid case category enum values."""
    with app.app_context():
        try:
            print("\n=== Fixing Case Categories ===")
            # Update LITIGATION to CIVIL_LITIGATION
            result = db.session.execute(
                text("UPDATE cases SET category = 'CIVIL_LITIGATION' WHERE category = 'LITIGATION'")
            )
            if result.rowcount > 0:
                print(f"✓ Updated {result.rowcount} cases from LITIGATION to CIVIL_LITIGATION")
            
            # Check for other invalid enum values
            invalid_categories = ['MEDIATION', 'INTELLECTUAL_PROPERTY', 'CONSULTANCY']
            for invalid_cat in invalid_categories:
                result = db.session.execute(
                    text(f"UPDATE cases SET category = 'OTHER' WHERE category = '{invalid_cat}'")
                )
                if result.rowcount > 0:
                    print(f"✓ Updated {result.rowcount} cases from {invalid_cat} to OTHER")
            
            db.session.commit()
            print("✓ All case categories fixed!")
            
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error fixing categories: {e}")

def fix_case_statuses():
    """Fix invalid case status enum values."""
    with app.app_context():
        try:
            print("\n=== Fixing Case Statuses ===")
            # Map old status values to new ones
            status_mappings = {
                'NEW': 'PENDING',
                'OPEN': 'IN_PROGRESS',
                'AWAITING_INFO': 'AWAITING_CLIENT',
                'COMPLETED': 'RESOLVED'
            }
            
            for old_status, new_status in status_mappings.items():
                result = db.session.execute(
                    text(f"UPDATE cases SET status = '{new_status}' WHERE status = '{old_status}'")
                )
                if result.rowcount > 0:
                    print(f"✓ Updated {result.rowcount} cases from {old_status} to {new_status}")
            
            db.session.commit()
            print("✓ All case statuses fixed!")
            
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error fixing statuses: {e}")

def fix_case_priorities():
    """Fix invalid case priority enum values."""
    with app.app_context():
        try:
            print("\n=== Fixing Case Priorities ===")
            # Map old priority values to new ones
            priority_mappings = {
                'NORMAL': 'MEDIUM',
                'CRITICAL': 'URGENT'
            }
            
            for old_priority, new_priority in priority_mappings.items():
                result = db.session.execute(
                    text(f"UPDATE cases SET priority = '{new_priority}' WHERE priority = '{old_priority}'")
                )
                if result.rowcount > 0:
                    print(f"✓ Updated {result.rowcount} cases from {old_priority} to {new_priority}")
            
            db.session.commit()
            print("✓ All case priorities fixed!")
            
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error fixing priorities: {e}")

if __name__ == '__main__':
    print("\n" + "="*50)
    print("  DATABASE ENUM MIGRATION SCRIPT")
    print("="*50)
    
    fix_case_categories()
    fix_case_statuses()
    fix_case_priorities()
    
    print("\n" + "="*50)
    print("  ✓ ALL ENUM VALUES HAVE BEEN FIXED!")
    print("="*50 + "\n")
