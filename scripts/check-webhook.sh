#!/bin/bash

# PayPal 웹훅 설정 확인 스크립트

echo "🔍 PayPal 웹훅 설정 확인"
echo "=========================="

# 웹훅 정보 출력
echo "📋 현재 웹훅 정보:"
echo "   Webhook URL: https://192.168.75.39/api/webhooks/paypal"
echo "   Webhook ID: 7K771721GD998503X"
echo "   Events Tracked: All Events"
echo ""

# PayPal 계정 정보 출력
echo "💳 PayPal 계정 정보:"
echo "   App Name: dduckbeagy"
echo "   Client ID: AZREWLa1aIlO5AJsS8LHGSQjInUK0ZH3fsLifMU-oPUV6eDqgR17kWFxpxv_8Rb65852p84b1u_1Tnt7"
echo ""

# 환경 변수 확인
echo "🔧 환경 변수 확인:"
if [ -f "backend/.env" ]; then
    echo "   ✅ backend/.env 파일 존재"
    
    # PayPal Client ID 확인
    if grep -q "PAYPAL_CLIENT_ID=" backend/.env; then
        echo "   ✅ PAYPAL_CLIENT_ID 설정됨"
    else
        echo "   ❌ PAYPAL_CLIENT_ID 설정되지 않음"
    fi
    
    # PayPal Client Secret 확인
    if grep -q "PAYPAL_CLIENT_SECRET=" backend/.env; then
        echo "   ✅ PAYPAL_CLIENT_SECRET 설정됨"
    else
        echo "   ❌ PAYPAL_CLIENT_SECRET 설정되지 않음"
    fi
    
    # 웹훅 ID 확인
    if grep -q "PAYPAL_WEBHOOK_ID=7K771721GD998503X" backend/.env; then
        echo "   ✅ PAYPAL_WEBHOOK_ID 설정됨"
    else
        echo "   ❌ PAYPAL_WEBHOOK_ID 설정되지 않음"
    fi
    
    # 웹훅 URL 확인
    if grep -q "PAYPAL_WEBHOOK_URL=https://192.168.75.39/api/webhooks/paypal" backend/.env; then
        echo "   ✅ PAYPAL_WEBHOOK_URL 설정됨"
    else
        echo "   ❌ PAYPAL_WEBHOOK_URL 설정되지 않음"
    fi
    
    # 웹훅 시크릿 확인
    if grep -q "PAYPAL_WEBHOOK_SECRET=" backend/.env; then
        echo "   ✅ PAYPAL_WEBHOOK_SECRET 설정됨"
    else
        echo "   ❌ PAYPAL_WEBHOOK_SECRET 설정되지 않음"
    fi
else
    echo "   ❌ backend/.env 파일이 존재하지 않음"
fi

echo ""

# 프론트엔드 환경 변수 확인
if [ -f "frontend/.env" ]; then
    echo "   ✅ frontend/.env 파일 존재"
    
    # PayPal Client ID 확인
    if grep -q "REACT_APP_PAYPAL_CLIENT_ID=" frontend/.env; then
        echo "   ✅ REACT_APP_PAYPAL_CLIENT_ID 설정됨"
    else
        echo "   ❌ REACT_APP_PAYPAL_CLIENT_ID 설정되지 않음"
    fi
    
    # 백엔드 URL 확인
    if grep -q "REACT_APP_BACKEND_URL=https://192.168.75.39" frontend/.env; then
        echo "   ✅ REACT_APP_BACKEND_URL 설정됨"
    else
        echo "   ❌ REACT_APP_BACKEND_URL 설정되지 않음"
    fi
else
    echo "   ❌ frontend/.env 파일이 존재하지 않음"
fi

echo ""

# 웹훅 엔드포인트 테스트
echo "🧪 웹훅 엔드포인트 테스트:"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/webhooks/paypal | grep -q "405"; then
    echo "   ✅ 웹훅 엔드포인트 접근 가능 (405 Method Not Allowed는 정상 - POST만 허용)"
else
    echo "   ❌ 웹훅 엔드포인트 접근 불가"
fi

echo ""

# 웹훅 시뮬레이션 테스트
echo "🎯 웹훅 시뮬레이션 테스트:"
response=$(curl -s -X POST http://localhost:5000/api/webhooks/simulate \
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
  }')

if [ $? -eq 0 ]; then
    echo "   ✅ 웹훅 시뮬레이션 성공"
    echo "   📄 응답: $response"
else
    echo "   ❌ 웹훅 시뮬레이션 실패"
fi

echo ""
echo "✅ 웹훅 설정 확인 완료"
echo ""
echo "📚 추가 정보:"
echo "   - 웹훅 설정 가이드: WEBHOOK_SETUP.md"
echo "   - 웹훅 시크릿 설정: PAYPAL_WEBHOOK_SECRET_SETUP.md"
