import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";
import csp from "vite-plugin-csp";

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
            "Access-Control-Allow-Origin": "https://cdn.gpteng.co",
            "Access-Control-Allow-Methods": "GET",
            "X-Frame-Options": "SAMEORIGIN",
            "X-XSS-Protection": "1; mode=block",
            "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
          }
        : undefined
  },

  plugins: [
    react(),                                   // 1️⃣ React-SWC first

    mode !== "development" &&                  // 2️⃣ CSP only in prod
      csp({
        policy: {
          "default-src": ["self"],
          "script-src": ["self", "https://cdn.gpteng.co"],
          "style-src": ["self", "unsafe-inline"],
          "img-src": ["self", "https:", "data:", "blob:"],
          "connect-src": ["self"],
          "object-src": ["none"]
        } as const
      }),

    mode === "development" && componentTagger(),   // 3️⃣ Dev-only tagger

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
