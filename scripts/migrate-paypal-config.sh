#!/bin/bash

# PayPal 설정 마이그레이션 스크립트
# 하드코딩된 PayPal 설정을 환경 변수 기반 설정으로 마이그레이션

echo "🔄 PayPal 설정 마이그레이션 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 프론트엔드 환경 파일 생성
echo -e "${BLUE}📝 프론트엔드 환경 파일 생성 중...${NC}"

if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}frontend/.env 파일이 없습니다. env.example을 복사합니다.${NC}"
    cp frontend/env.example frontend/.env
    echo -e "${GREEN}✅ frontend/.env 파일이 생성되었습니다.${NC}"
else
    echo -e "${GREEN}✅ frontend/.env 파일이 이미 존재합니다.${NC}"
fi

# 백엔드 환경 파일 생성
echo -e "${BLUE}📝 백엔드 환경 파일 생성 중...${NC}"

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}backend/.env 파일이 없습니다. env.example을 복사합니다.${NC}"
    cp backend/env.example backend/.env
    echo -e "${GREEN}✅ backend/.env 파일이 생성되었습니다.${NC}"
else
    echo -e "${GREEN}✅ backend/.env 파일이 이미 존재합니다.${NC}"
fi

# 설정 확인
echo -e "${BLUE}🔍 현재 설정 확인 중...${NC}"

# 프론트엔드 설정 확인
if [ -f "frontend/.env" ]; then
    echo -e "${BLUE}📋 프론트엔드 설정:${NC}"
    grep -E "REACT_APP_PAYPAL|REACT_APP_PRODUCT" frontend/.env | while read line; do
        if [[ $line == *"CLIENT_ID"* ]]; then
            echo -e "  ${YELLOW}PayPal Client ID: ${line#*=}${NC}"
        elif [[ $line == *"ENVIRONMENT"* ]]; then
            echo -e "  ${YELLOW}PayPal Environment: ${line#*=}${NC}"
        else
            echo -e "  ${line}"
        fi
    done
fi

# 백엔드 설정 확인
if [ -f "backend/.env" ]; then
    echo -e "${BLUE}📋 백엔드 설정:${NC}"
    grep -E "PAYPAL_" backend/.env | while read line; do
        if [[ $line == *"CLIENT_ID"* ]]; then
            echo -e "  ${YELLOW}PayPal Client ID: ${line#*=}${NC}"
        elif [[ $line == *"MODE"* ]]; then
            echo -e "  ${YELLOW}PayPal Mode: ${line#*=}${NC}"
        else
            echo -e "  ${line}"
        fi
    done
fi

echo -e "${BLUE}📋 마이그레이션 완료!${NC}"
echo -e "${YELLOW}⚠️  다음 단계를 수행하세요:${NC}"
echo -e "  1. frontend/.env 파일에서 PayPal Client ID를 실제 값으로 교체"
echo -e "  2. backend/.env 파일에서 PayPal Client ID와 Secret을 실제 값으로 교체"
echo -e "  3. 라이브 모드 사용 시 PAYPAL_ENVIRONMENT=live로 설정"
echo -e "  4. 앱 재시작"

echo -e "${GREEN}✅ 마이그레이션이 완료되었습니다!${NC}"
