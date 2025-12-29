"""
Application configuration module.
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'a_very_secret_key_for_dev')
    
    # Database URL handling for both SQLite (dev) and PostgreSQL (production)
    # Use an absolute path to the `instance` directory for the default SQLite file
    # so containers can reliably open/create the DB file.
    default_sqlite_path = os.path.abspath(os.path.join(os.getcwd(), 'instance', 'app.db'))
    database_url = os.environ.get('DATABASE_URL', f"sqlite:///{default_sqlite_path}")

    # Validate DATABASE_URL if provided; fail fast on malformed values
    if os.environ.get('DATABASE_URL'):
        if '://' not in database_url:
            raise RuntimeError(
                "Invalid DATABASE_URL environment variable.\n"
                "Provide a full DB URL, e.g. 'postgresql://user:password@host:port/dbname'.\n"
                f"Got: {database_url!r}"
            )
    # Fix for Render PostgreSQL (postgres:// -> postgresql://)
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = database_url
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or os.environ.get('SECRET_KEY', 'a_very_secret_key_for_dev')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # JWT Configuration
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    JWT_CSRF_METHODS = []  # Disable CSRF protection for API
    JWT_ERROR_MESSAGE_KEY = 'msg'
    
    # CORS Configuration
    cors_origins_env = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000')
    CORS_ORIGINS = [origin.strip() for origin in cors_origins_env.split(',')]


class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    TESTING = False


class TestingConfig(Config):
    """Testing configuration."""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config(config_name=None):
    """Get configuration object based on environment."""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    return config.get(config_name, config['default'])
