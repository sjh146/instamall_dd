import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: '**/*.{jsx,js}',
    }),
  ],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.REACT_APP_BACKEND_URL': JSON.stringify(process.env.REACT_APP_BACKEND_URL || ''),
    'process.env.REACT_APP_BACKEND_PORT': JSON.stringify(process.env.REACT_APP_BACKEND_PORT || '5000'),
    'process.env.REACT_APP_PAYPAL_CLIENT_ID': JSON.stringify(process.env.REACT_APP_PAYPAL_CLIENT_ID || ''),
    'process.env.REACT_APP_PAYPAL_CLIENT_SECRET': JSON.stringify(process.env.REACT_APP_PAYPAL_CLIENT_SECRET || ''),
    'process.env.REACT_APP_PAYPAL_ENVIRONMENT': JSON.stringify(process.env.REACT_APP_PAYPAL_ENVIRONMENT || 'live'),
    'process.env.REACT_APP_PAYPAL_HOSTED_BUTTON_ID': JSON.stringify(process.env.REACT_APP_PAYPAL_HOSTED_BUTTON_ID || ''),
    'process.env.REACT_APP_PAYPAL_CONTAINER_ID': JSON.stringify(process.env.REACT_APP_PAYPAL_CONTAINER_ID || ''),
    'process.env.REACT_APP_PAYPAL_CURRENCY': JSON.stringify(process.env.REACT_APP_PAYPAL_CURRENCY || 'USD'),
    'process.env.REACT_APP_PRODUCT_NAME': JSON.stringify(process.env.REACT_APP_PRODUCT_NAME || ''),
    'process.env.REACT_APP_PRODUCT_DESCRIPTION': JSON.stringify(process.env.REACT_APP_PRODUCT_DESCRIPTION || ''),
    'process.env.REACT_APP_PRODUCT_PRICE': JSON.stringify(process.env.REACT_APP_PRODUCT_PRICE || ''),
    'process.env.REACT_APP_PRODUCT_KRW_PRICE': JSON.stringify(process.env.REACT_APP_PRODUCT_KRW_PRICE || ''),
  },
})

