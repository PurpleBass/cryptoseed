
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Content Security Policy with nonces and strict-dynamic
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'strict-dynamic' 'nonce-${generateNonce()}' https://cdn.gpteng.co;
        style-src 'self' 'nonce-${generateNonce()}';
        img-src 'self' data: https:;
        connect-src 'self' ws://localhost:* wss://localhost:*;
        frame-ancestors 'self';
        form-action 'self';
        base-uri 'self';
        object-src 'none';
        require-trusted-types-for 'script';
        report-uri /api/csp-report;
        report-to csp-endpoint;
      `.replace(/\s+/g, ' ').trim(),
      
      // HSTS with gradual rollout (1 day initially)
      'Strict-Transport-Security': 'max-age=86400; includeSubDomains',
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // CORP
      'Cross-Origin-Resource-Policy': 'same-origin',
      
      // More restrictive CORS
      'Access-Control-Allow-Origin': 'https://cdn.gpteng.co',
      'Access-Control-Allow-Methods': 'GET',
      
      // Report-To header for CSP reporting
      'Report-To': '{"group":"csp-endpoint","max_age":10886400,"endpoints":[{"url":"/api/csp-report"}]}',
      
      // Additional security headers
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

