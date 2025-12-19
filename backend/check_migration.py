#!/usr/bin/env python3
"""
Migration script to transition from old structure to new structure.
This script helps verify the new structure works correctly.
"""
import os
import sys


def check_structure():
    """Check if all new directories and files exist."""
    print("Checking new backend structure...")
    
    required_items = [
        ('config', 'dir'),
        ('models', 'dir'),
        ('routes', 'dir'),
        ('services', 'dir'),
        ('utils', 'dir'),
        ('websockets', 'dir'),
        ('config/__init__.py', 'file'),
        ('config/settings.py', 'file'),
        ('models/__init__.py', 'file'),
        ('routes/__init__.py', 'file'),
        ('services/__init__.py', 'file'),
        ('utils/__init__.py', 'file'),
        ('websockets/__init__.py', 'file'),
        ('app_new.py', 'file'),
        ('setup_db_new.py', 'file'),
    ]
    
    all_exist = True
    for item, item_type in required_items:
        path = os.path.join(os.path.dirname(__file__), item)
        exists = os.path.exists(path)
        
        if exists:
            if item_type == 'dir':
                exists = os.path.isdir(path)
            else:
                exists = os.path.isfile(path)
        
        status = "✓" if exists else "✗"
        print(f"  {status} {item}")
        
        if not exists:
            all_exist = False
    
    return all_exist


def test_imports():
    """Test if all new modules can be imported."""
    print("\nTesting imports...")
    
    modules = [
        'config',
        'models',
        'routes',
        'services',
        'utils',
        'websockets',
    ]
    
    all_imported = True
    for module in modules:
        try:
            __import__(module)
            print(f"  ✓ {module}")
        except Exception as e:
            print(f"  ✗ {module}: {str(e)}")
            all_imported = False
    
    return all_imported


def suggest_next_steps():
    """Suggest next steps for migration."""
    print("\n" + "="*60)
    print("MIGRATION NEXT STEPS")
    print("="*60)
    print("""
1. Test the new application:
   python app_new.py

2. Initialize the database:
   python setup_db_new.py

3. Run tests to ensure everything works

4. Update any scripts that import from old files

5. Once verified, you can:
   - Backup old files: mkdir old_backup && mv app.py auth.py case_management.py models.py websocket.py setup_db.py old_backup/
   - Rename new files: mv app_new.py app.py && mv setup_db_new.py setup_db.py

6. Update your run scripts to use the new structure
    """)


def main():
    """Main migration check function."""
    print("="*60)
    print("BACKEND REORGANIZATION VERIFICATION")
    print("="*60)
    print()
    
    structure_ok = check_structure()
    print()
    
    if not structure_ok:
        print("⚠ Some required files or directories are missing!")
        sys.exit(1)
    
    imports_ok = test_imports()
    print()
    
    if not imports_ok:
        print("⚠ Some modules failed to import!")
        print("Please check the error messages above.")
        sys.exit(1)
    
    print("✓ All checks passed!")
    suggest_next_steps()


if __name__ == '__main__':
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # Add backend to path
    sys.path.insert(0, backend_dir)
    
    main()
