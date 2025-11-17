# Instagram Web Service 서버 시작 스크립트 (PowerShell)

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("production", "development", "local")]
    [string]$Mode = "production"
)

# 색상 정의
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"

# 로그 함수
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# 환경 확인
function Test-Environment {
    Write-Info "환경 확인 중..."
    
    # Docker 확인
    try {
        docker --version | Out-Null
        Write-Success "Docker 확인 완료"
    }
    catch {
        Write-Error "Docker가 설치되지 않았습니다."
        exit 1
    }
    
    # Docker Compose 확인
    try {
        docker-compose --version | Out-Null
        Write-Success "Docker Compose 확인 완료"
    }
    catch {
        Write-Error "Docker Compose가 설치되지 않았습니다."
        exit 1
    }
    
    Write-Success "환경 확인 완료"
}

# 프로덕션 모드 시작
function Start-Production {
    Write-Info "프로덕션 모드로 서비스를 시작합니다..."
    
    # 기존 컨테이너 정리
    docker-compose down
    
    # 프로덕션 모드로 시작
    docker-compose up -d
    
    Write-Success "프로덕션 서비스가 시작되었습니다!"
    Write-Info "백엔드: http://localhost:5000"
    Write-Info "프론트엔드: http://localhost:3000"
    Write-Info "헬스체크: http://localhost:5000/health"
    
    # 로그 확인 여부
    $showLogs = Read-Host "로그를 확인하시겠습니까? (y/n)"
    if ($showLogs -eq "y" -or $showLogs -eq "Y") {
        docker-compose logs -f
    }
}

# 개발 모드 시작
function Start-Development {
    Write-Info "개발 모드로 서비스를 시작합니다..."
    
    # 기존 컨테이너 정리
    docker-compose -f docker-compose.dev.yml down
    
    # 개발 모드로 시작
    docker-compose -f docker-compose.dev.yml up -d
    
    Write-Success "개발 서비스가 시작되었습니다!"
    Write-Info "백엔드: http://localhost:5000 (자동 리로드 활성화)"
    Write-Info "프론트엔드: http://localhost:3000"
    Write-Info "헬스체크: http://localhost:5000/health"
    
    # 로그 확인 여부
    $showLogs = Read-Host "로그를 확인하시겠습니까? (y/n)"
    if ($showLogs -eq "y" -or $showLogs -eq "Y") {
        docker-compose -f docker-compose.dev.yml logs -f
    }
}

# 로컬 개발 모드 시작
function Start-Local {
    Write-Info "로컬 개발 모드로 시작합니다..."
    
    # 백엔드 디렉토리로 이동
    Set-Location backend
    
    # 가상환경 확인 및 생성
    if (-not (Test-Path "venv")) {
        Write-Info "가상환경을 생성합니다..."
        python -m venv venv
    }
    
    # 가상환경 활성화
    Write-Info "가상환경을 활성화합니다..."
    & ".\venv\Scripts\Activate.ps1"
    
    # 의존성 설치
    Write-Info "의존성을 설치합니다..."
    pip install -r requirements.txt
    
    # 환경 변수 설정
    $env:FLASK_ENV = "development"
    $env:FLASK_APP = "app.py"
    
    # Gunicorn으로 실행
    Write-Info "Gunicorn으로 서버를 시작합니다..."
    gunicorn --bind 0.0.0.0:5000 --workers 1 --reload --log-level debug app:app
}

# 메인 함수
function Main {
    Write-Host "🚀 Instagram Web Service 서버 시작 스크립트" -ForegroundColor $White
    Write-Host "==========================================" -ForegroundColor $White
    
    Test-Environment
    
    switch ($Mode) {
        "production" {
            Start-Production
        }
        "development" {
            Start-Development
        }
        "local" {
            Start-Local
        }
        default {
            Write-Error "잘못된 모드입니다. 'production', 'development', 'local' 중 선택하세요."
            exit 1
        }
    }
}

# 스크립트 실행
Main
