import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import PAYPAL_CONFIG from './config/paypal';

// 상품 정보를 객체로 관리합니다.
const product = {
  name: PAYPAL_CONFIG.PRODUCT.NAME,
  description: PAYPAL_CONFIG.PRODUCT.DESCRIPTION,
  price: PAYPAL_CONFIG.PRODUCT.PRICE,
  krw_price: PAYPAL_CONFIG.PRODUCT.KRW_PRICE,
  imageUrl: "/S7e8223771d9643b290de7b81268d8d4dd.jpg_220x220q75.jpg_.avif",
  videoUrl: "/output_fixed.mp4"
};

// PayPal 설정 검증
if (!PAYPAL_CONFIG.isValid()) {
  console.error('❌ PayPal 설정이 올바르지 않습니다.');
  console.error('   frontend/.env 파일을 확인해주세요.');
}

// 배포 환경에 따른 백엔드 URL 설정
const getBackendUrl = () => {
  console.log('🔍 백엔드 URL 결정 중...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL);
  
  // 개발 환경에서는 항상 localhost 사용
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    console.log('✅ 개발 환경 감지 - localhost 사용');
    return 'http://localhost:5000';
  }
  
  // 환경 변수에서 백엔드 URL 가져오기 (프로덕션에서만)
  if (process.env.REACT_APP_BACKEND_URL) {
    console.log('✅ 환경 변수 REACT_APP_BACKEND_URL 사용:', process.env.REACT_APP_BACKEND_URL);
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  // 프로덕션 환경에서는 현재 호스트의 백엔드 포트 사용
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = process.env.REACT_APP_BACKEND_PORT || '5000';
  const url = `${protocol}//${hostname}:${port}`;
  console.log('✅ 현재 호스트 기반 URL 생성:', url);
  return url;
};

function App() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [backendUrl, setBackendUrl] = useState(getBackendUrl());
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('ready');

  // 결제 금액 포맷터 (PayPal 요구사항에 맞춘 2자리 소수점 문자열)
  const formatPaypalAmount = (value) => {
    if (value == null) return '0.00';
    const numeric = String(value).replace(/[^0-9.]/g, '');
    const amount = Number(numeric);
    if (!isFinite(amount)) return '0.00';
    return amount.toFixed(2);
  };

  // 모바일 감지 함수
  const checkMobile = () => {
    const mobileBreakpoint = 768;
    const isMobileDevice = window.innerWidth <= mobileBreakpoint || 
                          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);
  };

  // 백엔드 연결 테스트
  const testBackendConnection = async () => {
    try {
      console.log('백엔드 연결 테스트 시작:', backendUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('✅ 백엔드 연결 성공:', backendUrl);
      } else {
        console.warn('⚠️ 백엔드 응답 오류:', response.status);
      }
    } catch (error) {
      console.error('❌ 백엔드 연결 실패:', error);
      
      if (backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1')) {
        const currentHost = window.location.hostname;
        const currentProtocol = window.location.protocol;
        const fallbackUrl = `${currentProtocol}//${currentHost}:5000`;
        
        if (fallbackUrl !== backendUrl) {
          console.log('🔄 대체 백엔드 URL 시도:', fallbackUrl);
          setBackendUrl(fallbackUrl);
          
          setTimeout(() => {
            testBackendConnection();
          }, 1000);
          return;
        }
      }
      
      console.error('모든 백엔드 연결 시도 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 전역 에러 핸들러
  useEffect(() => {
    const handleError = (event) => {
      console.error('🚨 전역 에러 발생:', event.error);
    };

    const handleUnhandledRejection = (event) => {
      console.error('🚨 처리되지 않은 Promise 거부:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    console.log('🔄 컴포넌트 초기화 시작');
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    testBackendConnection();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // PayPal 버튼 초기화 (새로운 단일 버튼)
  useEffect(() => {
    console.log('🔄 새로운 PayPal 단일 버튼 초기화');
  }, []);

  const handleVideoClick = () => {
    setIsVideoPlaying(true);
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com', '_blank');
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="loading-container">
        <div>
          <div className="loading-text">로딩 중...</div>
          <div className="loading-subtext">
            백엔드 연결 확인 중: {backendUrl}
          </div>
        </div>
      </div>
    );
  }

  // 모바일 전용 컴포넌트 (design.jsx 스타일 적용)
  const MobileView = () => (
    <div style={{width: '100vw', minHeight: '100vh', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: '#CECAC0', overflow: 'auto', padding: '10px 0'}}>
      {/* 휴대폰 프레임 */}
      <div style={{width: '100%', maxWidth: '457.75px', minHeight: '100vh', position: 'relative', margin: '0 auto'}}>
        {/* 휴대폰 화면 배경 - 반응형 */}
        <div style={{width: 'calc(100% - 4px)', minHeight: '100vh', left: '2px', top: 0, position: 'absolute', background: '#B4AD98', borderRadius: '20px', boxShadow: '0px 0px 1.39px 2.09px rgba(0, 0, 0, 0.30) inset'}} />
        <div style={{width: 'calc(100% - 16px)', minHeight: 'calc(100vh - 12px)', left: '8px', top: '6px', position: 'absolute', background: 'black', borderRadius: '15px', boxShadow: '0px -0.70px 2.43px 2.09px rgba(220, 236, 255, 0.61)'}} />
        <div style={{width: 'calc(100% - 16px)', minHeight: 'calc(100vh - 12px)', left: '8px', top: '6px', position: 'absolute', borderRadius: '15px', border: '0.70px rgba(255, 255, 255, 0.80) solid', filter: 'blur(1.74px)', pointerEvents: 'none'}} />
        
        {/* 메인 콘텐츠 영역 - 반응형 및 스크롤 가능 */}
        <div style={{width: 'calc(100% - 26px)', minHeight: 'calc(100vh - 84px)', paddingTop: '45px', paddingBottom: '20px', left: '13px', top: '42px', position: 'absolute', background: 'white', overflow: 'visible', borderRadius: '15px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
          {/* 상단 헤더 */}
          <div style={{alignSelf: 'stretch', paddingTop: 12.52, paddingBottom: 12.52, paddingLeft: 6.26, paddingRight: 12.52, justifyContent: 'flex-start', alignItems: 'center', gap: 16.70, display: 'flex', flexShrink: 0}}>
            <div style={{width: 25.25, height: 25.25, position: 'relative', cursor: 'pointer'}}>
              <div style={{width: 8.49, height: 16.76, left: 8.38, top: 4.24, position: 'absolute', outline: '2.09px black solid', outlineOffset: '-1.04px'}} />
            </div>
            <div style={{flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex'}}>
              <div style={{width: 201.97, height: 25.53, textAlign: 'center', color: '#262626', fontSize: 16.70, fontFamily: 'Inter', fontWeight: '600', lineHeight: 21.71, wordWrap: 'break-word', cursor: 'pointer'}} onClick={handleInstagramClick}>
                joengn.design
              </div>
            </div>
            <div style={{width: 25.25, height: 25.25, position: 'relative', cursor: 'pointer'}}>
              <div style={{width: 3.16, height: 3.16, left: 11.05, top: 11.05, position: 'absolute', background: 'black'}} />
              <div style={{width: 3.16, height: 3.16, left: 4.79, top: 11, position: 'absolute', background: 'black'}} />
              <div style={{width: 3.16, height: 3.16, left: 17.31, top: 11.10, position: 'absolute', background: 'black'}} />
            </div>
          </div>

          {/* 프로필 섹션 */}
          <div style={{alignSelf: 'stretch', paddingLeft: 16.70, paddingRight: 16.70, justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex', flexShrink: 0}}>
            <div style={{padding: 6.26, borderRadius: 1042.47, outline: '1.99px #A8A8A8 solid', outlineOffset: '-1.99px', justifyContent: 'flex-start', alignItems: 'center', gap: 8.35, display: 'flex'}}>
              <div style={{width: 94.69, height: 94.69, position: 'relative', overflow: 'hidden', borderRadius: 138.45}}>
                <div style={{width: 94.69, height: 94.69, left: 0, top: 0, position: 'absolute', background: '#121714'}} />
                <img 
                  src="/youtuber.png" 
                  alt="Profile" 
                  style={{width: 94.69, height: 94.69, objectFit: 'cover'}}
                  onError={(e) => {
                    console.error('이미지 로드 실패:', e.target.src);
                    e.target.src = '/youtuber.png';
                  }}
                />
              </div>
            </div>
            <div style={{justifyContent: 'flex-start', alignItems: 'flex-start', gap: 2.98, display: 'flex'}}>
              <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 2.09, display: 'inline-flex'}}>
                <div style={{width: 76.73, height: 24.49, textAlign: 'center', color: '#262626', fontSize: 17.89, fontFamily: 'Inter', fontWeight: '600', lineHeight: 23.26, wordWrap: 'break-word'}}>102</div>
                <div style={{width: 83.60, textAlign: 'center', color: '#262626', fontSize: 12.92, fontFamily: 'Inter', fontWeight: '400', lineHeight: 12.92, letterSpacing: 0.13, wordWrap: 'break-word'}}>posts</div>
              </div>
              <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 2.09, display: 'inline-flex'}}>
                <div style={{width: 76.73, height: 24.49, textAlign: 'center', color: '#262626', fontSize: 17.89, fontFamily: 'Inter', fontWeight: '600', lineHeight: 23.26, wordWrap: 'break-word'}}>5,413</div>
                <div style={{width: 83.60, textAlign: 'center', color: '#262626', fontSize: 12.92, fontFamily: 'Inter', fontWeight: '400', lineHeight: 12.92, letterSpacing: 0.13, wordWrap: 'break-word'}}>followers</div>
              </div>
            </div>
          </div>

          {/* 프로필 정보 */}
          <div style={{alignSelf: 'stretch', paddingLeft: 16.70, paddingRight: 16.70, paddingTop: 8.35, paddingBottom: 8.35, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 2.09, display: 'flex', flexShrink: 0}}>
            <div style={{alignSelf: 'stretch', height: 23, color: '#262626', fontSize: 14.61, fontFamily: 'Inter', fontWeight: '500', lineHeight: 18.99, wordWrap: 'break-word'}}>{product.name}</div>
            <div style={{alignSelf: 'stretch', color: '#262626', fontSize: 14.61, fontFamily: 'Inter', fontWeight: '400', lineHeight: 18.99, wordWrap: 'break-word'}}>{product.description}</div>
            <div style={{alignSelf: 'stretch', color: '#00386F', fontSize: 14.61, fontFamily: 'Inter', fontWeight: '400', lineHeight: 18.99, wordWrap: 'break-word'}}>www.instagram.com/joengn</div>
          </div>

          {/* 상품 사진 그리드 섹션 - 프로필 바로 아래 세로 배치 */}
          <div style={{alignSelf: 'stretch', paddingLeft: 16.70, paddingRight: 16.70, paddingTop: 12.52, paddingBottom: 12.52, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 1.04, display: 'flex', flexShrink: 0}}>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 1.04}}>
              <div style={{width: '100%', position: 'relative', overflow: 'hidden', background: '#FF5210'}}>
                <div style={{width: '100%', paddingTop: '100%', position: 'relative'}}>
                  <img 
                    src="/watch.png" 
                    alt="Watch" 
                    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                </div>
              </div>
              <div style={{width: '100%', position: 'relative', overflow: 'hidden', background: '#FF5210'}}>
                <div style={{width: '100%', paddingTop: '100%', position: 'relative'}}>
                  <img 
                    src="/perfum.png" 
                    alt="Perfume" 
                    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                </div>
              </div>
              <div style={{width: '100%', position: 'relative', overflow: 'hidden', background: '#FF5210'}}>
                <div style={{width: '100%', paddingTop: '100%', position: 'relative'}}>
                  <img 
                    src="/cosmetic.png" 
                    alt="Cosmetic" 
                    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                </div>
              </div>
              <div style={{width: '100%', position: 'relative', overflow: 'hidden', background: '#FF5210'}}>
                <div style={{width: '100%', paddingTop: '100%', position: 'relative'}}>
                  <img 
                    src="/camera.png" 
                    alt="Camera" 
                    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 섹션 */}
          <div style={{alignSelf: 'stretch', paddingLeft: 16.70, paddingRight: 16.70, paddingTop: 12.52, paddingBottom: 12.52, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 2.09, display: 'flex', flexShrink: 0}}>
            <div style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 6.26, display: 'inline-flex'}}>
              <button 
                style={{flex: '1 1 0', alignSelf: 'stretch', paddingLeft: 20.87, paddingRight: 20.87, paddingTop: 8.35, paddingBottom: 8.35, background: '#EFEFEF', borderRadius: 7.95, justifyContent: 'center', alignItems: 'center', gap: 8.35, display: 'flex', border: 'none', cursor: 'pointer'}}
                onClick={handleLikeClick}
              >
                <div style={{color: '#262626', fontSize: 14.61, fontFamily: 'Inter', fontWeight: '600', lineHeight: 18.99, wordWrap: 'break-word'}}>
                  {isLiked ? '❤️ Liked' : '🤍 Like'}
                </div>
              </button>
              <button 
                style={{flex: '1 1 0', alignSelf: 'stretch', paddingLeft: 20.87, paddingRight: 20.87, paddingTop: 8.35, paddingBottom: 8.35, background: '#EFEFEF', borderRadius: 7.95, justifyContent: 'center', alignItems: 'center', gap: 4.17, display: 'flex', border: 'none', cursor: 'pointer'}}
                onClick={() => window.open('https://www.paypal.com/ncp/payment/8W32WPWG2HFRU', '_blank')}
              >
                <div style={{color: '#262626', fontSize: 14.61, fontFamily: 'Inter', fontWeight: '600', lineHeight: 18.99, wordWrap: 'break-word'}}>구매</div>
              </button>
            </div>
          </div>

          {/* 가격 및 결제 섹션 */}
          <div style={{alignSelf: 'stretch', paddingLeft: 16.70, paddingRight: 16.70, paddingTop: 8.35, paddingBottom: 8.35, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8.35, display: 'flex', flexShrink: 0}}>
            <div style={{alignSelf: 'stretch', color: '#262626', fontSize: 18, fontFamily: 'Inter', fontWeight: '600', lineHeight: 24, wordWrap: 'break-word'}}>
              {product.krw_price} ({PAYPAL_CONFIG.CURRENCY} ${product.price})
            </div>
            <div style={{alignSelf: 'stretch', padding: 12.52, background: '#F5F5F5', borderRadius: 7.95, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8.35, display: 'flex'}}>
              <div style={{color: '#262626', fontSize: 14.61, fontFamily: 'Inter', fontWeight: '600', lineHeight: 18.99, wordWrap: 'break-word'}}>💳 PayPal 결제</div>
              <div style={{color: '#262626', fontSize: 12.52, fontFamily: 'Inter', fontWeight: '400', lineHeight: 16.28, wordWrap: 'break-word'}}>안전한 결제가 진행됩니다</div>
              <button 
                style={{alignSelf: 'stretch', padding: 12.52, background: '#0070BA', borderRadius: 7.95, color: 'white', fontSize: 14.61, fontFamily: 'Inter', fontWeight: '600', border: 'none', cursor: 'pointer'}}
                onClick={() => window.open('https://www.paypal.com/ncp/payment/8W32WPWG2HFRU', '_blank')}
              >
                바로 구매하기
              </button>
              <div style={{alignSelf: 'stretch', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4.17, marginTop: 4.17}}>
                <img src="https://www.paypalobjects.com/images/Debit_Credit.svg" alt="cards" style={{height: 20}} />
              </div>
            </div>
          </div>

          {/* 비디오/이미지 섹션 */}
          <div style={{alignSelf: 'stretch', paddingLeft: 16.70, paddingRight: 16.70, paddingTop: 12.52, paddingBottom: 12.52, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 2.09, display: 'flex', flexShrink: 0}}>
            <div style={{width: '100%', position: 'relative', borderRadius: 7.95, overflow: 'hidden', background: '#000'}}>
              {isVideoPlaying ? (
                <video 
                  src={product.videoUrl} 
                  controls 
                  autoPlay 
                  style={{width: '100%', height: 'auto', display: 'block'}}
                  onEnded={() => setIsVideoPlaying(false)}
                />
              ) : (
                <div style={{position: 'relative', width: '100%', paddingTop: '100%', background: '#000'}}>
                  <img 
                    src={product.imageUrl} 
                    alt="Post" 
                    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                  <button 
                    style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 60, height: 60, borderRadius: '50%', background: 'rgba(0, 0, 0, 0.6)', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 24}}
                    onClick={handleVideoClick}
                  >
                    ▶️
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 하단 네비게이션 */}
          <div style={{width: '100%', marginTop: 'auto', paddingTop: 12.52, paddingBottom: 16.70, borderTop: '1px solid #EFEFEF', flexShrink: 0}}>
            <div style={{alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex'}}>
              <div style={{flex: '1 1 0', padding: 12.52, justifyContent: 'center', alignItems: 'center', gap: 8.35, display: 'flex'}}>
                <div style={{width: 25.25, height: 25.25, position: 'relative'}}>
                  <div style={{width: 21.04, height: 21.04, left: 2.10, top: 2.10, position: 'absolute', outline: '2.09px black solid', outlineOffset: '-1.04px'}} />
                </div>
              </div>
              <div style={{flex: '1 1 0', padding: 12.52, justifyContent: 'center', alignItems: 'center', gap: 8.35, display: 'flex'}}>
                <div style={{width: 25.25, height: 25.25, position: 'relative'}}>
                  <div style={{width: 17.89, height: 17.89, left: 2.13, top: 2.10, position: 'absolute', outline: '2.09px black solid', outlineOffset: '-1.04px'}} />
                  <div style={{width: 5.78, height: 5.78, left: 17.25, top: 17.37, position: 'absolute', outline: '2.09px black solid', outlineOffset: '-1.04px'}} />
                </div>
              </div>
              <div style={{flex: '1 1 0', padding: 12.52, justifyContent: 'center', alignItems: 'center', gap: 8.35, display: 'flex'}}>
                <div style={{width: 25.25, height: 25.25, position: 'relative'}}>
                  <div style={{width: 21.04, height: 21.04, left: 2.10, top: 2.10, position: 'absolute', borderRadius: 6.26, outline: '2.09px black solid', outlineOffset: '-1.04px'}} />
                  <div style={{width: 0.09, height: 10.43, left: 12.80, top: 7.63, position: 'absolute', outline: '2.09px black solid', outlineOffset: '-1.04px'}} />
                  <div style={{width: 0.09, height: 10.43, left: 18.06, top: 12.80, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '2.09px black solid', outlineOffset: '-1.04px'}} />
                </div>
              </div>
              <div style={{flex: '1 1 0', padding: 12.52, justifyContent: 'center', alignItems: 'center', gap: 8.35, display: 'flex'}}>
                <div style={{width: 25.25, height: 25.25, position: 'relative'}}>
                  <div style={{width: 20.77, height: 0.17, left: 2.29, top: 7.32, position: 'absolute', outline: '2.09px black solid', outlineOffset: '-1.04px'}} />
                  <div style={{width: 3.03, height: 5.24, left: 14.24, top: 2.20, position: 'absolute', outline: '2.09px black solid', outlineOffset: '-1.04px'}} />
                  <div style={{width: 2.96, height: 5.13, left: 7.67, top: 2.26, position: 'absolute', outline: '2.09px black solid', outlineOffset: '-1.04px'}} />
                  <div style={{width: 21.04, height: 21.04, left: 2.10, top: 2.10, position: 'absolute', outline: '2.09px black solid', outlineOffset: '-1.04px'}} />
                  <div style={{width: 6.70, height: 7.43, left: 9.77, top: 11.27, position: 'absolute', background: 'black'}} />
                </div>
              </div>
              <div style={{flex: '1 1 0', padding: 12.52, justifyContent: 'center', alignItems: 'center', gap: 8.35, display: 'flex'}}>
                <div style={{overflow: 'hidden', borderRadius: 1042.47, outline: '1.57px #262626 solid', outlineOffset: '-1.57px', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
                  <div style={{width: 25.25, height: 25.25, position: 'relative', overflow: 'hidden', borderRadius: 138.45}}>
                    <div style={{width: 25.25, height: 25.25, left: 0, top: 0, position: 'absolute', background: '#121714'}} />
                    <img 
                      src="/youtuber.png" 
                      alt="Profile" 
                      style={{width: 25.25, height: 25.25, objectFit: 'cover'}}
                      onError={(e) => {
                        console.error('이미지 로드 실패:', e.target.src);
                        e.target.src = '/youtuber.png';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 상태 표시줄 - 모바일에서는 숨김 */}
        <div style={{display: 'none', width: 'calc(100% - 12px)', height: 49.32, left: '6px', top: 0, position: 'absolute', overflow: 'hidden'}}>
          <div style={{width: 56.53, height: 22.38, left: 28.44, top: 12.76, position: 'absolute', borderRadius: 25.04}}>
            <div style={{width: 56.52, height: 21.34, left: 0, top: 1.04, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 17.74, fontFamily: 'SF Pro Text', fontWeight: '600', lineHeight: 22.96, wordWrap: 'break-word'}}>9:41</div>
          </div>
          <div style={{width: 26.20, height: 13.78, left: 353.59, top: 20.67, position: 'absolute', opacity: 0.35, borderRadius: 4.17, border: '1.10px black solid'}} />
          <div style={{width: 1.50, height: 4.42, left: 380.75, top: 26.11, position: 'absolute', opacity: 0.40, background: 'black'}} />
          <div style={{width: 21.99, height: 9.57, left: 355.69, top: 22.78, position: 'absolute', background: 'black', borderRadius: 2.09}} />
          <div style={{width: 18.89, height: 12.68, left: 301.41, top: 21.28, position: 'absolute', background: 'black'}} />
        </div>
      </div>
    </div>
  );

  // 데스크톱 전용 컴포넌트
  const DesktopView = () => (
    <div className="container">
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="logo">Instagram</div>
          <nav className="nav">
            <div className="nav-item">
              <span className="nav-icon">🏠</span>
              <span className="nav-text">홈</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">🔍</span>
              <span className="nav-text">검색</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">📱</span>
              <span className="nav-text">탐색 탭</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">🎬</span>
              <span className="nav-text">릴스</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">💬</span>
              <span className="nav-text">메시지</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">🔔</span>
              <span className="nav-text">알림</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">➕</span>
              <span className="nav-text">만들기</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">📊</span>
              <span className="nav-text">대시보드</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">👤</span>
              <span className="nav-text">프로필</span>
            </div>
          </nav>
        </div>
      </div>

      <div className="main-content">
        <div className="stories-section">
          <div className="stories-container">
            <div className="story-item">
              <div className="story-avatar">📸</div>
              <span className="story-username">_hy_n</span>
            </div>
            <div className="story-item">
              <div className="story-avatar">👤</div>
              <span className="story-username">gnaranha</span>
            </div>
            <div className="story-item">
              <div className="story-avatar">👤</div>
              <span className="story-username">_ycwon</span>
            </div>
            <div className="story-item">
              <div className="story-avatar">👤</div>
              <span className="story-username">carpenter_...</span>
            </div>
            <div className="story-item">
              <div className="story-avatar">👤</div>
              <span className="story-username">baskinrob...</span>
            </div>
            <div className="story-item">
              <div className="story-avatar">👤</div>
              <span className="story-username">satgotloco</span>
            </div>
          </div>
        </div>

        <div className="post-card">
          <div className="post-header">
            <div className="user-info">
              <div className="profile-pic">👤</div>
              <div className="user-details">
                <span className="username">dogunnny</span>
              </div>
            </div>
            <span className="more-button">⋯</span>
          </div>

          <div className="image-section">
            {isVideoPlaying ? (
              <video 
                src={product.videoUrl} 
                controls 
                autoPlay 
                className="post-video"
                onEnded={() => setIsVideoPlaying(false)}
              />
            ) : (
              <div className="image-container">
                <img src={product.imageUrl} alt="Post" className="post-image" />
                <button 
                  className="video-play-button"
                  onClick={handleVideoClick}
                >
                  ▶️
                </button>
              </div>
            )}
            <div className="image-navigation">
              <div className="pagination-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <span className="next-button">›</span>
            </div>
          </div>
          
          <div className="post-actions">
            <div className="action-buttons">
              <span className="action-icon">❤️</span>
              <span className="action-icon">💬</span>
              <span className="action-icon">📤</span>
              <span className="action-icon">🔖</span>
            </div>
            
            <div className="likes">좋아요 6개</div>
            
            <div className="caption">
              <span className="username">dogunnny</span> [0802,+835] 성주 물맑은펜션 😊
            </div>
            
            <div className="comments">
              <div className="view-comments">댓글 0개 모두 보기</div>
            </div>
            
            <div className="timestamp">10시간</div>
          </div>
          
          <div className="comment-input">
            <span className="emoji-button">😊</span>
            <input 
              type="text" 
              placeholder="댓글 달기..." 
              className="comment-field"
            />
            <button className="post-button">게시</button>
          </div>
          
          <div className="payment-section">
            <div className="price-info">
              <span className="price">{product.krw_price}</span>
              <span className="usd-price">({PAYPAL_CONFIG.CURRENCY} ${product.price})</span>
            </div>
            
            <div className="paypal-payment-section">
              <div className="paypal-title">
                💳 PayPal 결제
              </div>
              <div className="paypal-subtitle">바로 구매</div>
              <div className="paypal-note">아래 버튼으로 결제하세요.</div>
              
              <div className="paypal-single-button-container">
                <button 
                  className="pp-8W32WPWG2HFRU"
                  onClick={() => {
                    window.open('https://www.paypal.com/ncp/payment/8W32WPWG2HFRU', '_blank');
                  }}
                >
                  바로 구매
                </button>
                <div className="paypal-branding">
                  <img src="https://www.paypalobjects.com/images/Debit_Credit.svg" alt="cards" />
                  <div className="paypal-provider">
                    제공: <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="paypal" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="payment-info-section">
              <div className="payment-info-title">💳 결제 시스템</div>
              <div>안전한 결제가 진행됩니다</div>
              <div className="payment-info-note">
                * 실제 결제가 진행되는 환경입니다
              </div>
            </div>
          </div>
        </div>

        <div className="next-post-preview">
          <div className="next-post-header">
            <div className="next-post-user-info">
              <div className="next-post-profile-pic">👤</div>
              <span className="next-post-username">yunandnora</span>
            </div>
            <span className="next-post-time">1주</span>
          </div>
        </div>
      </div>

      <div className="right-sidebar">
        <div className="current-user">
          <div className="current-user-pic">👤</div>
          <div className="current-user-info">
            <span className="current-username">hangot146</span>
            <span className="current-user-name">Bea Gy Dduck</span>
          </div>
          <button className="switch-button">전환</button>
        </div>

        <div className="suggestions-section">
          <div className="suggestions-header">
            <span className="suggestions-title">회원님을 위한 추천</span>
            <button className="see-all-button">모두 보기</button>
          </div>
          
          <div className="suggestion-item">
            <div className="suggestion-pic">👤</div>
            <div className="suggestion-info">
              <span className="suggestion-username">user1</span>
              <span className="suggestion-desc">회원님을 위한 추천</span>
            </div>
            <button className="follow-button">팔로우</button>
          </div>
          
          <div className="suggestion-item">
            <div className="suggestion-pic">👤</div>
            <div className="suggestion-info">
              <span className="suggestion-username">user2</span>
              <span className="suggestion-desc">user3님이 팔로우함</span>
            </div>
            <button className="follow-button">팔로우</button>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-row">
            <a href="#" className="footer-link">소개</a>
            <a href="#" className="footer-link">도움말</a>
            <a href="#" className="footer-link">API</a>
          </div>
          <div className="footer-row">
            <a href="#" className="footer-link">채용 정보</a>
            <a href="#" className="footer-link">개인정보처리방침</a>
            <a href="#" className="footer-link">약관</a>
          </div>
          <div className="footer-row">
            <a href="#" className="footer-link">위치</a>
            <a href="#" className="footer-link">언어</a>
            <a href="#" className="footer-link">Meta Verified</a>
          </div>
          <div className="copyright">© 2025 INSTAGRAM FROM META</div>
        </div>
      </div>

      <div className="floating-message">
        <span className="message-icon">💬</span>
      </div>
    </div>
  );

  return (
    <div className="App">
      {/* PayPalSDKLoader 제거됨 - 새로운 단일 버튼 사용 */}
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}

export default App;