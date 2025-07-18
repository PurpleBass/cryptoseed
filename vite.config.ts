import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import analyzer from "rollup-plugin-analyzer";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers:
      mode === "development"
        ? {
            "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "X-Content-Type-Options": "nosniff",
            "Cross-Origin-Resource-Policy": "same-origin",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
          }
        : undefined
  },

  build: {
    // Reduce chunk size warning limit
    chunkSizeWarningLimit: 600,
    
    // Additional optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn'], // Additional pure functions to remove
        passes: 2, // Multiple passes for better compression
      },
      mangle: {
        safari10: true, // Safari 10 compatibility
      },
    },
    
    // Enable tree shaking
    rollupOptions: {
      plugins: [
        // Bundle analyzer for development analysis
        mode === "development" && analyzer({ summaryOnly: true })
      ].filter(Boolean),
      
      output: {
        // Ensure React loads first by controlling chunk names (alphabetical loading)
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'react-core') return 'assets/01-react-core-[hash].js';
          if (chunkInfo.name === 'react-dom') return 'assets/02-react-dom-[hash].js';
          if (chunkInfo.name === 'react-router') return 'assets/03-react-router-[hash].js';
          return 'assets/[name]-[hash].js';
        },
        
        // Manual chunking strategy with function approach for better control
        manualChunks(id) {
          // React core - highest priority, loads first
          if (id.includes('node_modules/react/') && !id.includes('react-dom') && !id.includes('react-router')) {
            return 'react-core';
          }
          
          // React DOM - second priority
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom';
          }
          
          // React ecosystem (router, etc.) - third priority
          if (id.includes('node_modules/react-router')) {
            return 'react-router';
          }
          
          // TanStack Query - separate chunk for caching/state management
          if (id.includes('@tanstack/')) {
            return 'tanstack-vendor';
          }
          
          // Noble crypto libraries - keep separate for security
          if (id.includes('@noble/')) {
            return 'crypto-vendor';
          }
          
          // Radix UI components - split into smaller chunks
          if (id.includes('@radix-ui/react-tabs') || id.includes('@radix-ui/react-switch') || 
              id.includes('@radix-ui/react-accordion')) {
            return 'radix-core';
          }
          
          if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-popover') || 
              id.includes('@radix-ui/react-toast')) {
            return 'radix-overlays';
          }
          
          if (id.includes('@radix-ui/')) {
            return 'radix-utils';
          }
          
          // Lucide icons - separate chunk since it's large
          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }
          
          // Utility libraries
          if (id.includes('clsx') || id.includes('tailwind-merge') || 
              id.includes('date-fns') || id.includes('zod') || id.includes('class-variance-authority')) {
            return 'utils-vendor';
          }
          
          // Large third-party libraries (after React core)
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        }
      }
    }
  },

  plugins: [
    react(),                                   // 1️⃣ React-SWC first

    // 2️⃣ CSP handled by _headers file instead of plugin


    VitePWA({                                      // 4️⃣ PWA
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg}"]
      },
      manifest: {
        name: "Crypto Seed",
        short_name: "CryptoSeed",
        description: "Secure Seed Phrase Encryption",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
          { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/pwa-maskable-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/pwa-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      }
    })
  ].filter(Boolean),

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  }
}));
