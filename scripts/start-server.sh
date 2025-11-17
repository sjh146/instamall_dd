#!/bin/bash

# Instagram Web Service 서버 시작 스크립트

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 환경 확인
check_environment() {
    log_info "환경 확인 중..."
    
    # Docker 확인
    if ! command -v docker &> /dev/null; then
        log_error "Docker가 설치되지 않았습니다."
        exit 1
    fi
    
    # Docker Compose 확인
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose가 설치되지 않았습니다."
        exit 1
    fi
    
    log_success "환경 확인 완료"
}

# 서비스 선택
select_service() {
    echo
    log_info "실행할 서비스를 선택하세요:"
    echo "1) 프로덕션 모드 (Gunicorn WSGI 서버)"
    echo "2) 개발 모드 (Gunicorn WSGI 서버 + 자동 리로드)"
    echo "3) 로컬 개발 모드 (Python 직접 실행)"
    echo "4) 종료"
    echo
    
    read -p "선택 (1-4): " choice
    
    case $choice in
        1)
            log_info "프로덕션 모드로 시작합니다..."
            start_production
            ;;
        2)
            log_info "개발 모드로 시작합니다..."
            start_development
            ;;
        3)
            log_info "로컬 개발 모드로 시작합니다..."
            start_local
            ;;
        4)
            log_info "종료합니다."
            exit 0
            ;;
        *)
            log_error "잘못된 선택입니다."
            select_service
            ;;
    esac
}

# 프로덕션 모드 시작
start_production() {
    log_info "프로덕션 모드로 서비스를 시작합니다..."
    
    # 기존 컨테이너 정리
    docker-compose down
    
    # 프로덕션 모드로 시작
    docker-compose up -d
    
    log_success "프로덕션 서비스가 시작되었습니다!"
    log_info "백엔드: http://localhost:5000"
    log_info "프론트엔드: http://localhost:3000"
    log_info "헬스체크: http://localhost:5000/health"
    
    # 로그 확인
    echo
    read -p "로그를 확인하시겠습니까? (y/n): " show_logs
    if [[ $show_logs == "y" || $show_logs == "Y" ]]; then
        docker-compose logs -f
    fi
}

# 개발 모드 시작
start_development() {
    log_info "개발 모드로 서비스를 시작합니다..."
    
    # 기존 컨테이너 정리
    docker-compose -f docker-compose.dev.yml down
    
    # 개발 모드로 시작
    docker-compose -f docker-compose.dev.yml up -d
    
    log_success "개발 서비스가 시작되었습니다!"
    log_info "백엔드: http://localhost:5000 (자동 리로드 활성화)"
    log_info "프론트엔드: http://localhost:3000"
    log_info "헬스체크: http://localhost:5000/health"
    
    # 로그 확인
    echo
    read -p "로그를 확인하시겠습니까? (y/n): " show_logs
    if [[ $show_logs == "y" || $show_logs == "Y" ]]; then
        docker-compose -f docker-compose.dev.yml logs -f
    fi
}

# 로컬 개발 모드 시작
start_local() {
    log_info "로컬 개발 모드로 시작합니다..."
    
    # 백엔드 디렉토리로 이동
    cd backend
    
    # 가상환경 확인 및 생성
    if [ ! -d "venv" ]; then
        log_info "가상환경을 생성합니다..."
        python -m venv venv
    fi
    
    # 가상환경 활성화
    log_info "가상환경을 활성화합니다..."
    source venv/bin/activate
    
    # 의존성 설치
    log_info "의존성을 설치합니다..."
    pip install -r requirements.txt
    
    # 환경 변수 설정
    export FLASK_ENV=development
    export FLASK_APP=app.py
    
    # Gunicorn으로 실행
    log_info "Gunicorn으로 서버를 시작합니다..."
    gunicorn --bind 0.0.0.0:5000 --workers 1 --reload --log-level debug app:app
}

# 메인 함수
main() {
    echo "🚀 Instagram Web Service 서버 시작 스크립트"
    echo "=========================================="
    
    check_environment
    select_service
}

# 스크립트 실행
main "$@"
