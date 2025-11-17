import os

class Config:
    # PostgreSQL 데이터베이스 설정
    DB_USERNAME = os.getenv('DB_USERNAME', 'instagram_user')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'instagram_password')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '5432')
    DB_NAME = os.getenv('DB_NAME', 'instagram_db')
    
    # 데이터베이스 URI
    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # SQLAlchemy 엔진 설정 개선
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_timeout': 20,
        'max_overflow': 0,
        'pool_size': 10
    }
    
    # PayPal 설정 (환경 변수로 설정 가능)
    PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID')
    PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET')
    PAYPAL_MODE = os.getenv('PAYPAL_MODE', 'live')  # 'sandbox' 또는 'live'
    PAYPAL_WEBHOOK_SECRET = os.getenv('PAYPAL_WEBHOOK_SECRET')
    PAYPAL_WEBHOOK_ID = os.getenv('PAYPAL_WEBHOOK_ID')
    PAYPAL_WEBHOOK_URL = os.getenv('PAYPAL_WEBHOOK_URL')
    
    # Flask 설정
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here') 