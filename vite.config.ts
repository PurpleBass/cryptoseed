
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Content Security Policy with CSP reporting and nonce support
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'nonce-{NONCE}' https://cdn.gpteng.co;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob: https:;
        connect-src 'self' ws://localhost:* wss://localhost:*;
        frame-ancestors 'self';
        form-action 'self';
        base-uri 'self';
        object-src 'none';
        report-uri /api/csp-report;
        report-to endpoint-1;
      `.replace(/\s+/g, ' ').trim(),
      
      // Report-To header for CSP reporting
      'Report-To': '{"group":"endpoint-1","max_age":10886400,"endpoints":[{"url":"/api/csp-report"}]}',
      
      // HSTS with 2 year duration (63072000 seconds)
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // CORP
      'Cross-Origin-Resource-Policy': 'same-origin',
      
      // More restrictive CORS
      'Access-Control-Allow-Origin': 'https://cdn.gpteng.co',
      'Access-Control-Allow-Methods': 'GET',
      
      // Additional security headers
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    }
  },
  plugins: [
    react({
      // Basic configuration without @emotion references
      // Just using the default React SWC configuration
    }),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
      },
      manifest: {
        name: 'Crypto Seed',
        short_name: 'CryptoSeed',
        description: 'Secure Seed Phrase Encryption',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '48x48',
            type: 'image/x-icon',
            purpose: 'any'
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'apple-touch-icon'
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
