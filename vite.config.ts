
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
      // Content Security Policy
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://cdn.gpteng.co;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob: https:;
        connect-src 'self' ws: wss:;
        frame-ancestors 'self';
        form-action 'self';
        base-uri 'self';
      `.replace(/\s+/g, ' ').trim(),
      
      // HSTS
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // CORP
      'Cross-Origin-Resource-Policy': 'same-origin',
      
      // CORS
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
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
