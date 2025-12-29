"""
Database migration script to add appointments table.
Run this after creating the Appointment model.
"""
from app_new import create_app
from extensions import db
from models import Appointment, User, Case

def run_migration():
    """Create appointments table and relationships."""
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Appointments table created successfully!")
        
        # Verify table creation
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        
        if 'appointments' in tables:
            print("✅ Appointments table exists in database")
            
            # Get columns
            columns = [col['name'] for col in inspector.get_columns('appointments')]
            print(f"\nColumns in appointments table:")
            for col in columns:
                print(f"  - {col}")
            
            # Get foreign keys
            foreign_keys = inspector.get_foreign_keys('appointments')
            print(f"\nForeign keys:")
            for fk in foreign_keys:
                print(f"  - {fk['constrained_columns']} -> {fk['referred_table']}.{fk['referred_columns']}")
                
            print("\n✅ Migration completed successfully!")
        else:
            print("❌ Appointments table was not created")

if __name__ == '__main__':
    run_migration()
