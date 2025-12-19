from extensions import db, bcrypt
from models import User, Role

def setup_initial_data():
    """Creates initial data: Super Admin user and a test client."""
    from app import app
    
    with app.app_context():
        print("Starting database setup...")
        
        # 1. Create all tables
        db.create_all()
        print("Database tables created.")

        # 2. Create Super Admin if none exists
        admin_email = "admin@1000hills.com"
        if not db.session.execute(db.select(User).filter_by(email=admin_email)).scalar_one_or_none():
            print(f"Creating Super Admin user: {admin_email}")
            hashed_password = bcrypt.generate_password_hash("SuperSecureAdminPassword123").decode('utf-8')
            
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
        if not db.session.execute(db.select(User).filter_by(email=client_email)).scalar_one_or_none():
            print(f"Creating Test Client user: {client_email}")
            hashed_password = bcrypt.generate_password_hash("ClientPassword123").decode('utf-8')
            
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

        # 4. Commit changes
        db.session.commit()
        print("Database setup complete.")

if __name__ == '__main__':
    setup_initial_data()
