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

  // 모바일 전용 컴포넌트
  const MobileView = () => (
    <div className="mobile-container">
      <div className="mobile-header">
        <div className="mobile-header-left">
          <div className="mobile-user-info">
            <div className="mobile-profile-pic">👤</div>
            <span className="mobile-username">dogunnny</span>
          </div>
        </div>
        
        <div className="mobile-header-center">
          <div className="instagram-logo" onClick={handleInstagramClick}>
            Instagram
          </div>
        </div>
        
        <div className="mobile-header-right">
          <div className="mobile-action-buttons">
            <button 
              className={`mobile-like-button ${isLiked ? 'liked' : ''}`}
              onClick={handleLikeClick}
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
            <button className="mobile-message-button">
              ✈️
            </button>
          </div>
        </div>
      </div>

      <div className="mobile-video-section">
        {isVideoPlaying ? (
          <video 
            src={product.videoUrl} 
            controls 
            autoPlay 
            className="mobile-video"
            onEnded={() => setIsVideoPlaying(false)}
          />
        ) : (
          <div className="mobile-image-container">
            <img src={product.imageUrl} alt="Post" className="mobile-image" />
            <button 
              className="mobile-video-play-button"
              onClick={handleVideoClick}
            >
              ▶️
            </button>
          </div>
        )}
      </div>

      <div className="mobile-payment-section">
        <div className="mobile-price-info">
          <span className="mobile-price">{product.krw_price}</span>
          <span className="mobile-usd-price">({PAYPAL_CONFIG.CURRENCY} ${product.price})</span>
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
        
        {process.env.NODE_ENV === 'development' && (
          <div className="dev-mode-info">
            <div>개발 모드</div>
            <div>백엔드 URL: {backendUrl}</div>
            <div>PayPal 환경: {PAYPAL_CONFIG.getEnvironmentDisplayName()}</div>
            <div>PayPal Client ID: {PAYPAL_CONFIG.CLIENT_ID ? PAYPAL_CONFIG.CLIENT_ID.substring(0, 10) + '...' : '설정되지 않음'}</div>
            <div>현재 호스트: {window.location.hostname}</div>
            <div>현재 프로토콜: {window.location.protocol}</div>
          </div>
        )}
        
        {isMobile && (
          <div className="mobile-network-status">
            <div>📱 모바일 모드</div>
            <div>백엔드: {backendUrl}</div>
            <div>연결 상태: {isLoading ? '확인 중...' : '연결됨'}</div>
            <div>네트워크: {navigator.onLine ? '온라인' : '오프라인'}</div>
            <div>결제 상태: {paymentStatus}</div>
          </div>
        )}
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