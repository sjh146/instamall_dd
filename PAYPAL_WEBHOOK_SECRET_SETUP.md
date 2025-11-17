# PayPal 웹훅 시크릿 설정 가이드

## 🔐 PayPal 웹훅 시크릿이란?

PayPal 웹훅 시크릿은 웹훅의 무결성을 검증하기 위한 비밀키입니다. PayPal에서 보낸 웹훅이 실제로 PayPal에서 온 것인지 확인하는 데 사용됩니다.

## 📋 현재 웹훅 설정

### **웹훅 정보**
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

## 🔍 웹훅 ID vs 웹훅 시크릿

### **📋 차이점**

| 구분 | 웹훅 ID | 웹훅 시크릿 |
|------|---------|-------------|
| **용도** | 웹훅을 식별하는 고유 번호 | 웹훅 서명을 검증하는 비밀키 |
| **형태** | `7K771721GD998503X` | `1234567890abcdef1234567890abcdef` |
| **위치** | 웹훅 목록에서 확인 | 웹훅 상세 페이지에서 확인 |
| **사용처** | 웹훅 관리, 삭제, 수정 | 서명 검증, 보안 |

### **🛠️ PayPal Developer Dashboard에서 확인 방법**

#### **1. 웹훅 ID 확인**
1. PayPal Developer Dashboard 접속
2. **Webhooks** 메뉴로 이동
3. 웹훅 목록에서 **웹훅 ID** 확인
   ```
   예시: 7K771721GD998503X
   ```

#### **2. 웹훅 시크릿 확인**
1. 웹훅 목록에서 해당 웹훅 **클릭**
2. **Webhook Secret** 섹션에서 시크릿 확인
   ```
   예시: 1234567890abcdef1234567890abcdef
   ```

### **💻 코드에서의 사용**

#### **웹훅 ID 사용**
```python
# 웹훅 관리용 (삭제, 수정 등)
webhook_id = "7K771721GD998503X"

# PayPal SDK에서 웹훅 삭제
paypalrestsdk.Webhook.delete(webhook_id)
```

#### **웹훅 시크릿 사용**
```python
# 서명 검증용
PAYPAL_WEBHOOK_SECRET = "1234567890abcdef1234567890abcdef"

def verify_webhook_signature(payload, headers):
    # 웹훅 시크릿을 사용하여 서명 검증
    return verify_signature(payload, headers, PAYPAL_WEBHOOK_SECRET)
```

## 🛠️ 웹훅 시크릿 설정 방법

### **1. PayPal Developer Dashboard에서 웹훅 생성**

#### **1.1 개발자 계정 접속**
1. [PayPal Developer](https://developer.paypal.com) 접속
2. 로그인 후 Dashboard로 이동

#### **1.2 샌드박스 환경 선택**
- **Sandbox**: 테스트 환경
- **Live**: 실제 운영 환경

#### **1.3 웹훅 생성**
1. **Webhooks** 메뉴로 이동
2. **Add Webhook** 클릭
3. **Webhook URL** 설정: `https://192.168.75.39/api/webhooks/paypal`
4. **Event Types** 선택:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.REFUNDED`
   - `CHECKOUT.ORDER.COMPLETED`

#### **1.4 웹훅 시크릿 확인**
웹훅을 생성하면 PayPal에서 자동으로 웹훅 시크릿을 생성합니다:
1. 생성된 웹훅을 클릭
2. **Webhook Secret** 섹션에서 시크릿 확인
3. 시크릿을 복사하여 안전한 곳에 보관

### **2. 환경 변수 설정**

#### **2.1 개발 환경 (.env 파일)**
```bash
# backend/.env 파일 생성
PAYPAL_WEBHOOK_SECRET=your-actual-webhook-secret-from-paypal
PAYPAL_WEBHOOK_ID=7K771721GD998503X
PAYPAL_WEBHOOK_URL=https://192.168.75.39/api/webhooks/paypal
PAYPAL_CLIENT_ID=AZREWLa1aIlO5AJsS8LHGSQjInUK0ZH3fsLifMU-oPUV6eDqgR17kWFxpxv_8Rb65852p84b1u_1Tnt7
PAYPAL_CLIENT_SECRET=EBc2wFR6TGOorxPighDaT6u8ibbblW8Ku6mwrfsVYWjzWBhtyUWMG41OE1INZTmAezvIyXsbI2csrhNC
FLASK_ENV=development
```

#### **2.2 프로덕션 환경**
```bash
# 서버에서 환경 변수 설정
export PAYPAL_WEBHOOK_SECRET=your-actual-webhook-secret-from-paypal
export PAYPAL_WEBHOOK_ID=7K771721GD998503X
export PAYPAL_WEBHOOK_URL=https://192.168.75.39/api/webhooks/paypal
export PAYPAL_CLIENT_ID=AZREWLa1aIlO5AJsS8LHGSQjInUK0ZH3fsLifMU-oPUV6eDqgR17kWFxpxv_8Rb65852p84b1u_1Tnt7
export PAYPAL_CLIENT_SECRET=EBc2wFR6TGOorxPighDaT6u8ibbblW8Ku6mwrfsVYWjzWBhtyUWMG41OE1INZTmAezvIyXsbI2csrhNC
export FLASK_ENV=production
```

#### **2.3 Docker 환경**
```yaml
# docker-compose.yml에 환경 변수 추가
services:
  backend:
    environment:
      - PAYPAL_WEBHOOK_SECRET=your-actual-webhook-secret-from-paypal
      - PAYPAL_WEBHOOK_ID=7K771721GD998503X
      - PAYPAL_WEBHOOK_URL=https://192.168.75.39/api/webhooks/paypal
      - PAYPAL_CLIENT_ID=AZREWLa1aIlO5AJsS8LHGSQjInUK0ZH3fsLifMU-oPUV6eDqgR17kWFxpxv_8Rb65852p84b1u_1Tnt7
      - PAYPAL_CLIENT_SECRET=EBc2wFR6TGOorxPighDaT6u8ibbblW8Ku6mwrfsVYWjzWBhtyUWMG41OE1INZTmAezvIyXsbI2csrhNC
      - FLASK_ENV=production
```

### **3. 웹훅 시크릿 검증**

#### **3.1 현재 코드의 검증 로직**
```python
def verify_webhook_signature(payload, headers):
    """
    PayPal 웹훅 서명을 검증합니다.
    """
    try:
        # PayPal에서 제공하는 서명 헤더들
        auth_algo = headers.get('PAYPAL-AUTH-ALGO')
        cert_url = headers.get('PAYPAL-CERT-URL')
        transmission_id = headers.get('PAYPAL-TRANSMISSION-ID')
        transmission_sig = headers.get('PAYPAL-TRANSMISSION-SIG')
        transmission_time = headers.get('PAYPAL-TRANSMISSION-TIME')
        
        print(f"🔐 웹훅 서명 검증 시작")
        print(f"   - AUTH_ALGO: {auth_algo}")
        print(f"   - CERT_URL: {cert_url}")
        print(f"   - TRANSMISSION_ID: {transmission_id}")
        print(f"   - TRANSMISSION_TIME: {transmission_time}")
        
        # 실제 환경에서는 PayPal의 공개키를 사용하여 서명 검증
        # 여기서는 간단한 검증만 수행
        if not all([auth_algo, cert_url, transmission_id, transmission_sig, transmission_time]):
            print("❌ 필수 웹훅 헤더가 누락됨")
            return False
            
        # 실제 구현에서는 PayPal SDK를 사용하여 서명 검증
        # return paypal.verify_webhook_signature(payload, headers)
        
        # 개발 환경에서는 항상 True 반환
        print("✅ 웹훅 서명 검증 성공 (개발 모드)")
        return True
        
    except Exception as e:
        print(f"❌ 웹훅 서명 검증 오류: {e}")
        return False
```

#### **3.2 PayPal SDK를 사용한 실제 검증**
```python
import paypalrestsdk

def verify_webhook_signature(payload, headers):
    """
    PayPal SDK를 사용한 실제 웹훅 서명 검증
    """
    try:
        # PayPal SDK 설정
        paypalrestsdk.configure({
            "mode": "sandbox",  # 또는 "live"
            "client_id": os.environ.get('PAYPAL_CLIENT_ID'),
            "client_secret": os.environ.get('PAYPAL_CLIENT_SECRET')
        })
        
        # 웹훅 서명 검증
        verification_result = paypalrestsdk.WebhookEvent.verify(
            transmission_id=headers.get('PAYPAL-TRANSMISSION-ID'),
            transmission_time=headers.get('PAYPAL-TRANSMISSION-TIME'),
            cert_url=headers.get('PAYPAL-CERT-URL'),
            auth_algo=headers.get('PAYPAL-AUTH-ALGO'),
            transmission_sig=headers.get('PAYPAL-TRANSMISSION-SIG'),
            webhook_id=os.environ.get('PAYPAL_WEBHOOK_ID'),  # 웹훅 ID도 필요
            webhook_event=payload
        )
        
        return verification_result
        
    except Exception as e:
        print(f"❌ 웹훅 서명 검증 오류: {e}")
        return False
```

## 🔒 보안 고려사항

### **1. 시크릿 관리**
- ✅ **환경 변수 사용**: 코드에 직접 하드코딩하지 않음
- ✅ **안전한 저장**: 시크릿을 안전한 곳에 보관
- ✅ **정기적 변경**: 주기적으로 시크릿 변경
- ❌ **Git에 커밋 금지**: .env 파일을 Git에 포함하지 않음

### **2. .gitignore 설정**
```gitignore
# 환경 변수 파일
.env
.env.local
.env.production
.env.staging

# 시크릿 파일
*.key
*.pem
secrets/
```

### **3. 프로덕션 환경**
```bash
# 프로덕션에서는 반드시 실제 시크릿 사용
export PAYPAL_WEBHOOK_SECRET=WH-2JR3241H2131242X-1234567890123456
export PAYPAL_WEBHOOK_ID=7K771721GD998503X
export PAYPAL_WEBHOOK_URL=https://192.168.75.39/api/webhooks/paypal
export FLASK_ENV=production
```

## 🧪 테스트 방법

### **1. 개발 환경 테스트**
```bash
# 개발 환경에서는 기본 시크릿 사용
export PAYPAL_WEBHOOK_ID=7K771721GD998503X
export PAYPAL_WEBHOOK_URL=https://192.168.75.39/api/webhooks/paypal
export FLASK_ENV=development
```

### **2. 웹훅 시뮬레이션**
```bash
# 웹훅 시뮬레이션 엔드포인트 테스트
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

### **3. 로그 확인**
```bash
# 웹훅 처리 로그 확인
tail -f logs/webhook.log
```

## 📞 문제 해결

### **1. 웹훅 수신 안됨**
- URL 확인: `https://192.168.75.39/api/webhooks/paypal`
- HTTPS 인증서 유효성 확인
- 방화벽 설정 확인

### **2. 서명 검증 실패**
- 웹훅 시크릿 확인
- PayPal 공개키 확인
- 시간 동기화 확인

### **3. 중복 이벤트**
- 이벤트 ID 기반 중복 체크
- 데이터베이스 인덱스 설정

## 🔗 유용한 링크

- [PayPal Webhooks Documentation](https://developer.paypal.com/docs/api-basics/notifications/webhooks/)
- [PayPal Webhook Signature Verification](https://developer.paypal.com/docs/api-basics/notifications/webhooks/notification-messages/)
- [PayPal Developer Dashboard](https://developer.paypal.com/)
