import { useEffect } from 'react';
import PAYPAL_CONFIG from '../config/paypal';

const PayPalSDKLoader = () => {
  useEffect(() => {
    console.log('🔄 PayPalSDKLoader 초기화 시작');
    console.log('PayPal 설정:', {
      CLIENT_ID: PAYPAL_CONFIG.CLIENT_ID ? PAYPAL_CONFIG.CLIENT_ID.substring(0, 10) + '...' : 'Not set',
      ENVIRONMENT: PAYPAL_CONFIG.ENVIRONMENT,
      CURRENCY: PAYPAL_CONFIG.CURRENCY,
      isValid: PAYPAL_CONFIG.isValid()
    });

    // Guard to prevent duplicate loads (e.g., React StrictMode double-effect)
    if (window.__PAYPAL_SDK_LOADING__ || window.__PAYPAL_SDK_LOADED__) {
      console.log('⚠️ PayPal SDK 이미 로딩 중이거나 로드됨');
      return;
    }

    // PayPal 설정 검증
    if (!PAYPAL_CONFIG.isValid()) {
      console.error('❌ PayPal 설정이 유효하지 않음');
      window.__PAYPAL_SDK_ERROR__ = true;
      return;
    }

    // Set loading flag immediately to avoid race conditions from double-invocation
    window.__PAYPAL_SDK_LOADING__ = true;

    const sdkUrl = PAYPAL_CONFIG.getSDKUrl();
    console.log('📡 PayPal SDK URL:', sdkUrl);

    // Hard cleanup: remove ALL PayPal SDK scripts and PayPal iframes to avoid stale hosted-buttons instances
    try { delete window.paypal; } catch (_) { window.paypal = undefined; }
    Array.from(document.querySelectorAll('script[src*="paypal.com/sdk/js"]'))
      .forEach((s) => { try { s.parentNode && s.parentNode.removeChild(s); } catch (_) {} });
    Array.from(document.querySelectorAll('iframe[src*="paypal.com"], iframe[name*="__paypal__"]'))
      .forEach((f) => { try { f.parentNode && f.parentNode.removeChild(f); } catch (_) {} });

    const loadPayPalSDK = (url, attempt = 1) => {
      console.log(`📤 PayPal SDK 로드 시도 ${attempt}:`, url);
      
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-paypal-sdk', 'buttons');

      script.onload = () => {
        console.log('✅ PayPal SDK loaded successfully');
        console.log('Environment:', PAYPAL_CONFIG.ENVIRONMENT);
        console.log('Client ID:', PAYPAL_CONFIG.CLIENT_ID ? PAYPAL_CONFIG.CLIENT_ID.substring(0, 10) + '...' : 'Not set');
        console.log('PayPal object available:', !!window.paypal);
        window.__PAYPAL_SDK_LOADING__ = false;
        window.__PAYPAL_SDK_LOADED__ = true;
        window.__PAYPAL_SDK_ERROR__ = false;
      };

      script.onerror = (error) => {
        console.error(`❌ PayPal SDK 로드 실패 (시도 ${attempt}):`, error);
        
        if (attempt < 3) {
          // 다른 URL로 재시도
          const alternativeUrls = [
            'https://www.paypal.com/sdk/js?client-id=' + PAYPAL_CONFIG.CLIENT_ID + '&components=buttons&currency=' + PAYPAL_CONFIG.CURRENCY,
            'https://www.paypalobjects.com/api/checkout.js'
          ];
          
          setTimeout(() => {
            if (!window.__PAYPAL_SDK_LOADED__ && !window.__PAYPAL_SDK_LOADING__) {
              console.log(`🔁 PayPal SDK 재시도 ${attempt + 1}...`);
              window.__PAYPAL_SDK_LOADING__ = true;
              try { delete window.paypal; } catch (_) { window.paypal = undefined; }
              
              const retryUrl = alternativeUrls[attempt - 1] || PAYPAL_CONFIG.getSDKUrl();
              loadPayPalSDK(retryUrl, attempt + 1);
            }
          }, 2000 * attempt);
        } else {
          console.error('❌ 모든 PayPal SDK 로드 시도 실패');
          window.__PAYPAL_SDK_LOADING__ = false;
          window.__PAYPAL_SDK_ERROR__ = true;
        }
      };

      document.head.appendChild(script);
    };

    loadPayPalSDK(sdkUrl);

    // Do not remove the script on unmount to avoid tearing during HMR/route changes
    return () => {};
  }, []);

  return null;
};

export default PayPalSDKLoader;
