import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import csp from "vite-plugin-csp";
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
      },
    },
    
    rollupOptions: {
      plugins: [
        // Bundle analyzer for development analysis
        mode === "development" && analyzer({ summaryOnly: true })
      ].filter(Boolean),
      
      output: {
        // Manual chunking strategy with function approach for better control
        manualChunks(id) {
          // React ecosystem
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          
          // Tiptap rich text editor
          if (id.includes('@tiptap/')) {
            return 'editor-vendor';
          }
          
          // Noble crypto libraries
          if (id.includes('@noble/')) {
            return 'crypto-vendor';
          }
          
          // Radix UI components
          if (id.includes('@radix-ui/')) {
            return 'ui-vendor';
          }
          
          // Utility libraries
          if (id.includes('lucide-react') || id.includes('clsx') || id.includes('tailwind-merge') || 
              id.includes('date-fns') || id.includes('zod') || id.includes('class-variance-authority')) {
            return 'utils-vendor';
          }
          
          // Large third-party libraries
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
