// PayPal Configuration
const PAYPAL_CONFIG = {
  // Environment settings
  ENVIRONMENT: process.env.REACT_APP_PAYPAL_ENVIRONMENT || 'live', // 'sandbox' or 'live'
  
  // Client credentials
  CLIENT_ID: process.env.REACT_APP_PAYPAL_CLIENT_ID || 'AZREWLa1aIlO5AJsS8LHGSQjInUK0ZH3fsLifMU-oPUV6eDqgR17kWFxpxv_8Rb65852p84b1u_1Tnt7',
  CLIENT_SECRET: process.env.REACT_APP_PAYPAL_CLIENT_SECRET || 'EBc2wFR6TGOorxPighDaT6u8ibbblW8Ku6mwrfsVYWjzWBhtyUWMG41OE1INZTmAezvIyXsbI2csrhNC',
  HOSTED_BUTTON_ID: process.env.REACT_APP_PAYPAL_HOSTED_BUTTON_ID || '7GXDQRX358EJC',
  
  // Container ID (configurable)
  CONTAINER_ID: process.env.REACT_APP_PAYPAL_CONTAINER_ID || 'paypal-button-container',
  
  // Currency settings
  CURRENCY: process.env.REACT_APP_PAYPAL_CURRENCY || 'USD',
  
  // Product settings
  PRODUCT: {
    NAME: process.env.REACT_APP_PRODUCT_NAME || 'MINI high-end camera',
    DESCRIPTION: process.env.REACT_APP_PRODUCT_DESCRIPTION || 'The ultimate camera for pros — unmatched precision, instant response.',
    PRICE: process.env.REACT_APP_PRODUCT_PRICE || '1.00',
    KRW_PRICE: process.env.REACT_APP_PRODUCT_KRW_PRICE || '1,000원'
  },
  
  // SDK URL based on environment
  getSDKUrl() {
    const baseUrl = 'https://www.paypal.com/sdk/js';
    const params = new URLSearchParams({
      'client-id': this.CLIENT_ID || 'AZREWLa1aIlO5AJsS8LHGSQjInUK0ZH3fsLifMU-oPUV6eDqgR17kWFxpxv_8Rb65852p84b1u_1Tnt7',
      // Load both smart buttons and hosted buttons so either can be used
      'components': 'buttons,hosted-buttons',
      'disable-funding': 'venmo',
      'currency': this.CURRENCY,
      'intent': 'capture',
      'commit': 'true',
      'integration-source': this.HOSTED_BUTTON_ID ? 'hosted-buttons' : 'smart-buttons',
      't': String(Date.now())
    });
    
    // Add environment parameter for sandbox
    if (this.ENVIRONMENT === 'sandbox') {
      params.append('env', 'sandbox');
    }
    
    const url = `${baseUrl}?${params.toString()}`;
    console.log('🔗 PayPal SDK URL:', url);
    return url;
  },
  
  // Validation
  isValid() {
    if (!this.CLIENT_ID) {
      console.error('❌ REACT_APP_PAYPAL_CLIENT_ID 환경 변수가 설정되지 않았습니다.');
      return false;
    }
    
    if (this.ENVIRONMENT === 'live' && !this.CLIENT_SECRET) {
      console.error('❌ REACT_APP_PAYPAL_CLIENT_SECRET 환경 변수가 설정되지 않았습니다. (라이브 모드에서는 필요)');
      return false;
    }
    
    return true;
  },
  
  // Get environment display name
  getEnvironmentDisplayName() {
    return this.ENVIRONMENT === 'live' ? '라이브' : '샌드박스';
  },
  

};

export default PAYPAL_CONFIG;
