"""
Database initialization script.
Creates initial data including Super Admin user and test client.
"""
from extensions import db, bcrypt
from models import (
    User, Role, Case, Message, Document, CaseNote,
    Deadline, Service, TeamMember, BlogPost
)


def setup_initial_data(app):
    """
    Creates initial data: Super Admin user and a test client.
    
    Args:
        app: Flask application instance
    """
    with app.app_context():
        print("Starting database setup...")
        
        # 1. Create all tables
        db.create_all()
        print("Database tables created.")

        # 2. Create Super Admin if none exists
        admin_email = "admin@1000hills.com"
        existing_admin = db.session.execute(
            db.select(User).filter_by(email=admin_email)
        ).scalar_one_or_none()
        
        if not existing_admin:
            print(f"Creating Super Admin user: {admin_email}")
            hashed_password = bcrypt.generate_password_hash(
                "SuperSecureAdminPassword123"
            ).decode('utf-8')
            
            super_admin = User(
                email=admin_email,
                password_hash=hashed_password,
                name="Super Admin",
                role=Role.SUPER_ADMIN,
                email_verified=True
            )
            db.session.add(super_admin)
            print("Super Admin created.")
        else:
            print("Super Admin already exists.")

        # 3. Create a test client
        client_email = "client@example.com"
        existing_client = db.session.execute(
            db.select(User).filter_by(email=client_email)
        ).scalar_one_or_none()
        
        if not existing_client:
            print(f"Creating Test Client user: {client_email}")
            hashed_password = bcrypt.generate_password_hash(
                "ClientPassword123"
            ).decode('utf-8')
            
            test_client = User(
                email=client_email,
                password_hash=hashed_password,
                name="Test Client",
                role=Role.CLIENT,
                email_verified=True
            )
            db.session.add(test_client)
            print("Test Client created.")
        else:
            print("Test Client already exists.")

        # 4. Create a test case manager
        manager_email = "manager@1000hills.com"
        existing_manager = db.session.execute(
            db.select(User).filter_by(email=manager_email)
        ).scalar_one_or_none()
        
        if not existing_manager:
            print(f"Creating Test Case Manager user: {manager_email}")
            hashed_password = bcrypt.generate_password_hash(
                "ManagerPassword123"
            ).decode('utf-8')
            
            test_manager = User(
                email=manager_email,
                password_hash=hashed_password,
                name="Test Case Manager",
                role=Role.CASE_MANAGER,
                email_verified=True
            )
            db.session.add(test_manager)
            print("Test Case Manager created.")
        else:
            print("Test Case Manager already exists.")

        # Commit all changes
        try:
            db.session.commit()
            print("\nDatabase setup completed successfully!")
            print("\nDefault credentials:")
            print(f"  Super Admin: {admin_email} / SuperSecureAdminPassword123")
            print(f"  Case Manager: {manager_email} / ManagerPassword123")
            print(f"  Test Client: {client_email} / ClientPassword123")
        except Exception as e:
            db.session.rollback()
            print(f"Error during database setup: {str(e)}")


if __name__ == '__main__':
    from app_new import create_app
    
    app = create_app()
    setup_initial_data(app)
