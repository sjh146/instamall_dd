#!/usr/bin/env python3
"""
개발 환경에서 Gunicorn을 사용하여 Flask 앱을 실행하는 스크립트
"""

import os
import sys
import subprocess

def main():
    # 환경 변수 설정
    os.environ['FLASK_ENV'] = 'development'
    os.environ['FLASK_APP'] = 'app.py'
    
    print("🚀 Instagram Web Service Backend (Development Mode)")
    print("📝 Gunicorn WSGI 서버로 실행 중...")
    print("🔧 개발 모드: 자동 리로드 활성화")
    print("🌐 서버 주소: http://localhost:5000")
    print("📊 헬스체크: http://localhost:5000/health")
    print("=" * 50)
    
    # Gunicorn 명령어 구성
    cmd = [
        'gunicorn',
        '--bind', '0.0.0.0:5000',
        '--workers', '1',  # 개발 환경에서는 단일 워커
        '--timeout', '120',
        '--reload',  # 개발 환경에서 자동 리로드
        '--reload-extra-file', 'app.py',
        '--reload-extra-file', 'config.py',
        '--log-level', 'debug',
        '--access-logfile', '-',
        '--error-logfile', '-',
        'app:app'
    ]
    
    try:
        # Gunicorn 실행
        subprocess.run(cmd, check=True)
    except KeyboardInterrupt:
        print("\n👋 서버를 종료합니다...")
        sys.exit(0)
    except subprocess.CalledProcessError as e:
        print(f"❌ 서버 실행 중 오류 발생: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
