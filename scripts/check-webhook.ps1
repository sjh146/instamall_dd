# PayPal 웹훅 설정 확인 스크립트 (PowerShell)

Write-Host "🔍 PayPal 웹훅 설정 확인" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan

# 웹훅 정보 출력
Write-Host "📋 현재 웹훅 정보:" -ForegroundColor Yellow
Write-Host "   Webhook URL: https://192.168.75.39/api/webhooks/paypal" -ForegroundColor White
Write-Host "   Webhook ID: 7K771721GD998503X" -ForegroundColor White
Write-Host "   Events Tracked: All Events" -ForegroundColor White
Write-Host ""

# PayPal 계정 정보 출력
Write-Host "💳 PayPal 계정 정보:" -ForegroundColor Yellow
Write-Host "   App Name: dduckbeagy" -ForegroundColor White
Write-Host "   Client ID: AZREWLa1aIlO5AJsS8LHGSQjInUK0ZH3fsLifMU-oPUV6eDqgR17kWFxpxv_8Rb65852p84b1u_1Tnt7" -ForegroundColor White
Write-Host ""

# 환경 변수 확인
Write-Host "🔧 환경 변수 확인:" -ForegroundColor Yellow

if (Test-Path "backend\.env") {
    Write-Host "   ✅ backend\.env 파일 존재" -ForegroundColor Green
    
    $backendEnv = Get-Content "backend\.env" -Raw
    
    # PayPal Client ID 확인
    if ($backendEnv -match "PAYPAL_CLIENT_ID=") {
        Write-Host "   ✅ PAYPAL_CLIENT_ID 설정됨" -ForegroundColor Green
    } else {
        Write-Host "   ❌ PAYPAL_CLIENT_ID 설정되지 않음" -ForegroundColor Red
    }
    
    # PayPal Client Secret 확인
    if ($backendEnv -match "PAYPAL_CLIENT_SECRET=") {
        Write-Host "   ✅ PAYPAL_CLIENT_SECRET 설정됨" -ForegroundColor Green
    } else {
        Write-Host "   ❌ PAYPAL_CLIENT_SECRET 설정되지 않음" -ForegroundColor Red
    }
    
    # 웹훅 ID 확인
    if ($backendEnv -match "PAYPAL_WEBHOOK_ID=7K771721GD998503X") {
        Write-Host "   ✅ PAYPAL_WEBHOOK_ID 설정됨" -ForegroundColor Green
    } else {
        Write-Host "   ❌ PAYPAL_WEBHOOK_ID 설정되지 않음" -ForegroundColor Red
    }
    
    # 웹훅 URL 확인
    if ($backendEnv -match "PAYPAL_WEBHOOK_URL=https://192\.168\.75\.39/api/webhooks/paypal") {
        Write-Host "   ✅ PAYPAL_WEBHOOK_URL 설정됨" -ForegroundColor Green
    } else {
        Write-Host "   ❌ PAYPAL_WEBHOOK_URL 설정되지 않음" -ForegroundColor Red
    }
    
    # 웹훅 시크릿 확인
    if ($backendEnv -match "PAYPAL_WEBHOOK_SECRET=") {
        Write-Host "   ✅ PAYPAL_WEBHOOK_SECRET 설정됨" -ForegroundColor Green
    } else {
        Write-Host "   ❌ PAYPAL_WEBHOOK_SECRET 설정되지 않음" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ backend\.env 파일이 존재하지 않음" -ForegroundColor Red
}

Write-Host ""

# 프론트엔드 환경 변수 확인
if (Test-Path "frontend\.env") {
    Write-Host "   ✅ frontend\.env 파일 존재" -ForegroundColor Green
    
    $frontendEnv = Get-Content "frontend\.env" -Raw
    
    # PayPal Client ID 확인
    if ($frontendEnv -match "REACT_APP_PAYPAL_CLIENT_ID=") {
        Write-Host "   ✅ REACT_APP_PAYPAL_CLIENT_ID 설정됨" -ForegroundColor Green
    } else {
        Write-Host "   ❌ REACT_APP_PAYPAL_CLIENT_ID 설정되지 않음" -ForegroundColor Red
    }
    
    # 백엔드 URL 확인
    if ($frontendEnv -match "REACT_APP_BACKEND_URL=https://192\.168\.75\.39") {
        Write-Host "   ✅ REACT_APP_BACKEND_URL 설정됨" -ForegroundColor Green
    } else {
        Write-Host "   ❌ REACT_APP_BACKEND_URL 설정되지 않음" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ frontend\.env 파일이 존재하지 않음" -ForegroundColor Red
}

Write-Host ""

# 웹훅 엔드포인트 테스트
Write-Host "🧪 웹훅 엔드포인트 테스트:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/webhooks/paypal" -Method GET -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 405) {
        Write-Host "   ✅ 웹훅 엔드포인트 접근 가능 (405 Method Not Allowed는 정상 - POST만 허용)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ 웹훅 엔드포인트 접근 가능 (상태 코드: $($response.StatusCode))" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ 웹훅 엔드포인트 접근 불가" -ForegroundColor Red
}

Write-Host ""

# 웹훅 시뮬레이션 테스트
Write-Host "🎯 웹훅 시뮬레이션 테스트:" -ForegroundColor Yellow
try {
    $webhookData = @{
        event_type = "PAYMENT.CAPTURE.COMPLETED"
        id = "WH-TEST-1234567890"
        resource = @{
            id = "2GG3456789012345"
            status = "COMPLETED"
            amount = @{
                currency_code = "USD"
                value = "75.00"
            }
        }
    } | ConvertTo-Json -Depth 3

    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/webhooks/simulate" -Method POST -Body $webhookData -ContentType "application/json" -UseBasicParsing
    Write-Host "   ✅ 웹훅 시뮬레이션 성공" -ForegroundColor Green
    Write-Host "   📄 응답: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "   ❌ 웹훅 시뮬레이션 실패" -ForegroundColor Red
    Write-Host "   📄 오류: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ 웹훅 설정 확인 완료" -ForegroundColor Green
Write-Host ""
Write-Host "📚 추가 정보:" -ForegroundColor Cyan
Write-Host "   - 웹훅 설정 가이드: WEBHOOK_SETUP.md" -ForegroundColor White
Write-Host "   - 웹훅 시크릿 설정: PAYPAL_WEBHOOK_SECRET_SETUP.md" -ForegroundColor White
