
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { generateNonce } from "./src/lib/security";

// Generate nonces at build time
const styleNonce = generateNonce();
const scriptNonce = generateNonce();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Strict CSP with nonces and reporting
      'Content-Security-Policy': `
        default-src 'none';
        script-src 'self' https://cdn.gpteng.co 'nonce-${scriptNonce}';
        style-src 'self' 'nonce-${styleNonce}';
        img-src 'self';
        connect-src 'self' ws://localhost:* wss://localhost:*;
        font-src 'self';
        manifest-src 'self';
        frame-ancestors 'none';
        form-action 'self';
        base-uri 'self';
        object-src 'none';
        upgrade-insecure-requests;
        report-uri /api/csp-report;
        report-to default;
      `.replace(/\s+/g, ' ').trim(),
      
      // Report-To header for modern browsers
      'Report-To': '{"group":"default","max_age":31536000,"endpoints":[{"url":"/api/csp-report"}]}',
      
      // HSTS with preload for Chrome HSTS preload list inclusion
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // CORP
      'Cross-Origin-Resource-Policy': 'same-origin',
      
      // Strict CORS
      'Access-Control-Allow-Origin': 'https://cdn.gpteng.co',
      'Access-Control-Allow-Methods': 'GET',
      
      // Additional security headers
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
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
