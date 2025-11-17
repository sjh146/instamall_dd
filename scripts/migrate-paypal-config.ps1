# PayPal 설정 마이그레이션 스크립트 (PowerShell)
# 하드코딩된 PayPal 설정을 환경 변수 기반 설정으로 마이그레이션

Write-Host "🔄 PayPal 설정 마이그레이션 시작..." -ForegroundColor Blue

# 프론트엔드 환경 파일 생성
Write-Host "📝 프론트엔드 환경 파일 생성 중..." -ForegroundColor Blue

if (-not (Test-Path "frontend\.env")) {
    Write-Host "frontend\.env 파일이 없습니다. env.example을 복사합니다." -ForegroundColor Yellow
    Copy-Item "frontend\env.example" "frontend\.env"
    Write-Host "✅ frontend\.env 파일이 생성되었습니다." -ForegroundColor Green
} else {
    Write-Host "✅ frontend\.env 파일이 이미 존재합니다." -ForegroundColor Green
}

# 백엔드 환경 파일 생성
Write-Host "📝 백엔드 환경 파일 생성 중..." -ForegroundColor Blue

if (-not (Test-Path "backend\.env")) {
    Write-Host "backend\.env 파일이 없습니다. env.example을 복사합니다." -ForegroundColor Yellow
    Copy-Item "backend\env.example" "backend\.env"
    Write-Host "✅ backend\.env 파일이 생성되었습니다." -ForegroundColor Green
} else {
    Write-Host "✅ backend\.env 파일이 이미 존재합니다." -ForegroundColor Green
}

# 설정 확인
Write-Host "🔍 현재 설정 확인 중..." -ForegroundColor Blue

# 프론트엔드 설정 확인
if (Test-Path "frontend\.env") {
    Write-Host "📋 프론트엔드 설정:" -ForegroundColor Blue
    $frontendEnv = Get-Content "frontend\.env"
    foreach ($line in $frontendEnv) {
        if ($line -match "REACT_APP_PAYPAL|REACT_APP_PRODUCT") {
            if ($line -match "CLIENT_ID") {
                Write-Host "  PayPal Client ID: $($line.Split('=')[1])" -ForegroundColor Yellow
            } elseif ($line -match "ENVIRONMENT") {
                Write-Host "  PayPal Environment: $($line.Split('=')[1])" -ForegroundColor Yellow
            } else {
                Write-Host "  $line" -ForegroundColor White
            }
        }
    }
}

# 백엔드 설정 확인
if (Test-Path "backend\.env") {
    Write-Host "📋 백엔드 설정:" -ForegroundColor Blue
    $backendEnv = Get-Content "backend\.env"
    foreach ($line in $backendEnv) {
        if ($line -match "PAYPAL_") {
            if ($line -match "CLIENT_ID") {
                Write-Host "  PayPal Client ID: $($line.Split('=')[1])" -ForegroundColor Yellow
            } elseif ($line -match "MODE") {
                Write-Host "  PayPal Mode: $($line.Split('=')[1])" -ForegroundColor Yellow
            } else {
                Write-Host "  $line" -ForegroundColor White
            }
        }
    }
}

Write-Host "📋 마이그레이션 완료!" -ForegroundColor Blue
Write-Host "⚠️  다음 단계를 수행하세요:" -ForegroundColor Yellow
Write-Host "  1. frontend\.env 파일에서 PayPal Client ID를 실제 값으로 교체" -ForegroundColor White
Write-Host "  2. backend\.env 파일에서 PayPal Client ID와 Secret을 실제 값으로 교체" -ForegroundColor White
Write-Host "  3. 라이브 모드 사용 시 PAYPAL_ENVIRONMENT=live로 설정" -ForegroundColor White
Write-Host "  4. REACT_APP_PAYPAL_HOSTED_BUTTON_ID를 실제 Hosted Button ID로 설정" -ForegroundColor White
Write-Host "  5. 앱 재시작" -ForegroundColor White

Write-Host "✅ 마이그레이션이 완료되었습니다!" -ForegroundColor Green
