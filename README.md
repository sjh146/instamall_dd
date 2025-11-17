# Instagram-Style Web Service with PayPal Integration

인스타그램 스타일의 웹 서비스로, PayPal 결제 기능이 통합된 React + Flask 애플리케이션입니다.

## 🚀 Features

- **Instagram-style UI**: 실제 인스타그램과 유사한 디자인
- **PayPal Integration**: 안전한 결제 처리
- **Responsive Design**: 모바일 및 데스크톱 지원
- **Real-time Updates**: 실시간 주문 상태 업데이트
- **Admin Dashboard**: 주문 관리 및 통계

## 🛠 Tech Stack

### Frontend
- React 19.1.0
- PayPal React SDK
- CSS3 with Instagram-style design

### Backend
- Python 3.12
- Flask
- Gunicorn WSGI Server (프로덕션)
- Flask-SQLAlchemy
- PostgreSQL (with SQLite fallback)
- Anaconda 환경 (dduckbeagy)

### Infrastructure
- Docker
- RHEL 10
- Anaconda
- Node.js 18.x

## 📦 Docker 배포 (분리된 서비스)

### 1. 분리된 서비스 빌드 및 실행

```bash
# 모든 서비스 빌드 및 실행
docker-compose -f docker-compose.separated.yml up -d --build

# 또는 스크립트 사용
./build-separated.sh
```

### 2. 개별 서비스 빌드

```bash
# 백엔드만 빌드
docker-compose -f docker-compose.separated.yml build backend

# 프론트엔드만 빌드
docker-compose -f docker-compose.separated.yml build frontend

# PostgreSQL은 이미지 사용
docker pull postgres:15
```

### 3. 서비스별 실행

```bash
# 데이터베이스 먼저 실행
docker-compose -f docker-compose.separated.yml up -d postgres

# 백엔드 실행
docker-compose -f docker-compose.separated.yml up -d backend

# 프론트엔드 실행
docker-compose -f docker-compose.separated.yml up -d frontend
```

## 🔧 환경 설정

### 환경 변수

```bash
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopping_db
DB_USERNAME=postgres
DB_PASSWORD=password

# PayPal 설정
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Flask 설정
FLASK_ENV=production
SECRET_KEY=your_secret_key
```

### 포트 설정

- **3000**: React 프론트엔드
- **5000**: Flask 백엔드 API
- **5432**: PostgreSQL (선택사항)

## 📱 사용 방법

1. **프론트엔드 접속**: `http://your-domain:3000`
2. **상품 선택**: 카메라 상품 확인
3. **PayPal 결제**: 결제 버튼 클릭
4. **주문 완료**: 결제 후 주문 정보 저장

## 🛡️ 보안 고려사항

- PayPal 샌드박스 환경 사용 (개발용)
- 환경 변수로 민감 정보 관리
- HTTPS 사용 권장 (프로덕션)
- 방화벽 설정으로 포트 제한

## 📊 모니터링

```bash
# 컨테이너 상태 확인
docker ps

# 로그 확인
docker logs -f instagram-web-service

# 리소스 사용량 확인
docker stats instagram-web-service
```

## 🔄 업데이트

```bash
# 최신 이미지 가져오기
docker pull dduckbeagy/instagram-web-service:latest

# 컨테이너 재시작
docker restart instagram-web-service
```

## 🐛 문제 해결

### 일반적인 문제들

1. **포트 충돌**: 다른 서비스가 3000/5000 포트 사용 중
2. **메모리 부족**: 시스템 리소스 확인 및 증가
3. **네트워크 문제**: 방화벽 및 네트워크 설정 확인

### 로그 확인

```bash
# 컨테이너 로그
docker logs instagram-web-service

# 시스템 로그
sudo journalctl -u docker
```

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. Docker 로그: `docker logs instagram-web-service`
2. 시스템 리소스: `docker stats`
3. 네트워크 연결: `curl localhost:3000`

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 

# Instead Project

## 📋 PayPal 웹훅 설정

### **현재 웹훅 정보**
```
Webhook URL: https://192.168.75.39/api/webhooks/paypal
Webhook ID: 7K771721GD998503X
Events Tracked: All Events
```

### **PayPal 계정 정보**
```
App Name: dduckbeagy
Client ID: AZREWLa1aIlO5AJsS8LHGSQjInUK0ZH3fsLifMU-oPUV6eDqgR17kWFxpxv_8Rb65852p84b1u_1Tnt7
Secret Key: EBc2wFR6TGOorxPighDaT6u8ibbblW8Ku6mwrfsVYWjzWBhtyUWMG41OE1INZTmAezvIyXsbI2csrhNC
```

### **환경 변수 설정**

#### **Backend (.env 파일 생성)**
```bash
# backend/.env 파일을 생성하고 다음 내용을 추가하세요:

# PayPal 설정 (실제 값으로 교체하세요)
PAYPAL_CLIENT_ID=AZREWLa1aIlO5AJsS8LHGSQjInUK0ZH3fsLifMU-oPUV6eDqgR17kWFxpxv_8Rb65852p84b1u_1Tnt7
PAYPAL_CLIENT_SECRET=EBc2wFR6TGOorxPighDaT6u8ibbblW8Ku6mwrfsVYWjzWBhtyUWMG41OE1INZTmAezvIyXsbI2csrhNC
PAYPAL_WEBHOOK_SECRET=your-paypal-webhook-secret-here

# PayPal 웹훅 설정
PAYPAL_WEBHOOK_ID=7K771721GD998503X
PAYPAL_WEBHOOK_URL=https://192.168.75.39/api/webhooks/paypal

# Flask 설정
SECRET_KEY=your-secret-key-here
FLASK_ENV=development

# 데이터베이스 설정
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=instagram_user
DB_PASSWORD=instagram_password
DB_NAME=instagram_db

# Redis 설정
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password-here
```

#### **Frontend (.env 파일 생성)**
```bash
# frontend/.env 파일을 생성하고 다음 내용을 추가하세요:

# PayPal 설정 (실제 값으로 교체하세요)
REACT_APP_PAYPAL_CLIENT_ID=AZREWLa1aIlO5AJsS8LHGSQjInUK0ZH3fsLifMU-oPUV6eDqgR17kWFxpxv_8Rb65852p84b1u_1Tnt7

# 백엔드 설정
REACT_APP_BACKEND_URL=https://192.168.75.39
REACT_APP_BACKEND_PORT=5000

# 환경 설정
NODE_ENV=production
```

### **웹훅 테스트**
```bash
# 웹훅 시뮬레이션 테스트
curl -X POST http://localhost:5000/api/webhooks/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "PAYMENT.CAPTURE.COMPLETED",
    "id": "WH-TEST-1234567890",
    "resource": {
      "id": "2GG3456789012345",
      "status": "COMPLETED",
      "amount": {
        "currency_code": "USD",
        "value": "75.00"
      }
    }
  }'
```

## 📚 상세 문서

- [웹훅 설정 가이드](WEBHOOK_SETUP.md)
- [웹훅 시크릿 설정 가이드](PAYPAL_WEBHOOK_SECRET_SETUP.md)
- [배포 가이드](DEPLOYMENT.md) 