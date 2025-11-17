# PayPal 설정 가이드

## 개요
PayPal 결제 시스템이 하드코딩에서 소프트코딩으로 변경되었으며, 샌드박스 모드에서 라이브 모드로 전환할 수 있도록 개선되었습니다.

## 주요 변경사항

### 1. 환경 변수 기반 설정
- 모든 PayPal 설정이 환경 변수로 관리됩니다
- 하드코딩된 컨테이너 ID가 제거되었습니다
- 동적 PayPal SDK 로딩이 구현되었습니다

### 2. 라이브 모드 지원
- 샌드박스 모드에서 라이브 모드로 전환 가능
- 환경별 설정 분리

## 설정 방법

### Frontend 설정 (frontend/.env)

```env
# PayPal 설정 (라이브 모드)
REACT_APP_PAYPAL_CLIENT_ID=your-live-paypal-client-id-here
REACT_APP_PAYPAL_CLIENT_SECRET=your-live-paypal-client-secret-here
REACT_APP_PAYPAL_ENVIRONMENT=live
REACT_APP_PAYPAL_CONTAINER_ID=paypal-button-container
REACT_APP_PAYPAL_CURRENCY=USD
REACT_APP_PAYPAL_HOSTED_BUTTON_ID=your-hosted-button-id-here



# 상품 설정
REACT_APP_PRODUCT_NAME=MINI high-end camera
REACT_APP_PRODUCT_DESCRIPTION=The ultimate camera for pros — unmatched precision, instant response.
REACT_APP_PRODUCT_PRICE=75.00
REACT_APP_PRODUCT_KRW_PRICE=90,000원
```

### Backend 설정 (backend/.env)

```env
# PayPal 설정 (라이브 모드)
PAYPAL_CLIENT_ID=your-live-paypal-client-id-here
PAYPAL_CLIENT_SECRET=your-live-paypal-client-secret-here
PAYPAL_MODE=live
PAYPAL_WEBHOOK_SECRET=your-paypal-webhook-secret-here

# PayPal 웹훅 설정
PAYPAL_WEBHOOK_ID=your-webhook-id-here
PAYPAL_WEBHOOK_URL=https://your-domain.com/api/webhooks/paypal
```

## 환경별 설정

### 샌드박스 모드 (테스트)
```env
REACT_APP_PAYPAL_ENVIRONMENT=sandbox
PAYPAL_MODE=sandbox
```

### 라이브 모드 (실제 결제)
```env
REACT_APP_PAYPAL_ENVIRONMENT=live
PAYPAL_MODE=live
```

## PayPal 계정 설정

### 1. PayPal 개발자 계정 생성
1. [PayPal Developer Portal](https://developer.paypal.com/)에 접속
2. 계정 생성 및 로그인

### 2. 앱 생성
1. "My Apps & Credentials" 메뉴로 이동
2. "Create App" 클릭
3. 앱 이름 입력 및 생성

### 3. Client ID 및 Secret 확인
- **Sandbox**: 테스트용 Client ID 및 Secret
- **Live**: 실제 결제용 Client ID 및 Secret

### 4. 웹훅 설정 (백엔드용)
1. "Webhooks" 메뉴로 이동
2. "Add Webhook" 클릭
3. URL 설정: `https://your-domain.com/api/webhooks/paypal`
4. 이벤트 선택: `PAYMENT.CAPTURE.COMPLETED`

## 파일 구조

```
frontend/
├── src/
│   ├── config/
│   │   └── paypal.js          # PayPal 설정 관리
│   ├── components/
│   │   └── PayPalSDKLoader.js # 동적 PayPal SDK 로더
│   └── App.js                 # 메인 앱 (설정 적용)
├── .env                       # 환경 변수 설정
└── env.example               # 환경 변수 예시

backend/
├── config.py                 # 백엔드 PayPal 설정
├── .env                      # 환경 변수 설정
└── env.example              # 환경 변수 예시
```

## 주요 기능

### 1. 동적 PayPal SDK 로딩
- 환경 변수에 따라 적절한 PayPal SDK URL 생성
- 라이브/샌드박스 모드 자동 감지

### 2. 설정 검증
- 필수 환경 변수 검증
- 환경별 설정 유효성 확인

### 3. Hosted Buttons 지원
- PayPal Hosted Buttons를 통한 안전한 결제
- 환경 변수로 Hosted Button ID 관리

### 4. 환경 표시
- 개발 모드에서 현재 PayPal 환경 표시
- Client ID 일부 표시 (보안 고려)

## 주의사항

### 라이브 모드 사용 시
1. **실제 결제가 발생합니다**
2. **충분한 테스트 후 전환하세요**
3. **웹훅 URL이 공개적으로 접근 가능해야 합니다**
4. **SSL 인증서가 필요합니다**

### 보안
1. **환경 변수 파일(.env)을 Git에 커밋하지 마세요**
2. **Client Secret을 프론트엔드에 노출하지 마세요**
3. **프로덕션에서는 HTTPS를 사용하세요**

## 문제 해결

### PayPal SDK 로딩 실패
1. Client ID가 올바른지 확인
2. 환경 설정이 올바른지 확인
3. 네트워크 연결 상태 확인

### 결제 오류
1. PayPal 계정 상태 확인
2. 웹훅 설정 확인
3. 백엔드 로그 확인

### 환경 변수 인식 안됨
1. .env 파일이 올바른 위치에 있는지 확인
2. 환경 변수 이름이 올바른지 확인
3. 앱 재시작
