
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
      // Content Security Policy with CSP reporting
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' https://cdn.gpteng.co;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob: https:;
        connect-src 'self' ws://localhost:* wss://localhost:*;
        frame-ancestors 'self';
        form-action 'self';
        base-uri 'self';
        report-uri /csp-report;
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
      
      // Additional security headers
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
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
