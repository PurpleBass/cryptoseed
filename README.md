# CryptoSeed

**CryptoSeed** is a modern, open-source web application for encrypting and decrypting hi---

## Getting Startedtive information—especially cryptocurrency seed phrases and wallet recovery codes. Built with React and Vite, it features a security-first design with ChaCha20-Poly1305 encryption and Argon2id key derivation for maximum privacy, security, and ease of use.

---

## ⭐️ Latest Security Status (July 2025)
- **Mozilla Observatory Score:** A+ (130/100)
- **ChaCha20-Poly1305 Encryption:** Modern authenticated encryption with Argon2id key derivation (OWASP recommended)
- **Strict Content Security Policy (CSP):**
  - `default-src 'none'` (deny by default)
  - No `'unsafe-inline'` in `style-src` (no inline styles allowed)
  - Only explicitly allowed sources for scripts, styles, images, fonts, and connections
- **All major security headers set:**
  - HSTS, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, and more
- **No third-party scripts, analytics, or trackers**
- **Offline-ready:** Can be run locally or from a USB stick with real-time offline detection

---

## What Does CryptoSeed Do?
- **Encrypts and Decrypts Seed Phrases:**
  - Securely encrypt and store your wallet recovery phrases or any sensitive text using ChaCha20-Poly1305 encryption.
- **Simple Text Encryption:**
  - Clean, straightforward text encryption with textarea input for maximum compatibility and security.
  - Focus on security over formatting - plain text approach eliminates potential attack vectors.
- **Zero-Knowledge:**
  - All encryption and decryption happen locally in your browser. No data ever leaves your device.
- **Military-Grade Security:**
  - Uses ChaCha20-Poly1305 authenticated encryption with Argon2id key derivation (OWASP recommended) and secure memory handling.
- **File Export/Import:**
  - Download encrypted content as `.cryptoseed` files with metadata and compression.
  - Load `.cryptoseed` files for seamless decryption workflow.
- **Optimized Output:**
  - Gzip compression before encryption reduces file sizes significantly.
- **Smart Offline Detection:**
  - Real-time offline indicator with usage recommendations for maximum security.
- **Clipboard Auto-Wipe & Session Timeout:**
  - Prevents sensitive data from lingering in memory or clipboard.
- **Password Strength Meter:**
  - Helps you choose strong, secure passwords.
- **No Tracking, No Analytics, No Ads:**
  - 100% privacy-focused.

---

## 🎉 Latest User Experience Improvements (December 2024 - July 2025)

### Streamlined Text Interface
- **Security-First Design:** Replaced rich text editor with secure textarea input for maximum security and compatibility
- **Universal Compatibility:** Plain text approach works across all devices and browsers without complex dependencies
- **Attack Surface Reduction:** Eliminates potential vulnerabilities associated with rich text editors
- **Focus on Content:** Clean, distraction-free interface puts encryption functionality first

### Enhanced Encryption Workflow
- **File Export:** Download encrypted content as structured `.cryptoseed` files with metadata
- **File Import:** Drag & drop or browse to load `.cryptoseed` files for decryption
- **Compression:** Gzip compression before encryption reduces output size by ~60-80%
- **Copy Functionality:** Simple copy/paste workflow for encrypted content

### Improved User Interface
- **Professional Design:** Clean, modern interface with consistent Montserrat typography
- **Responsive Layout:** Optimized for both desktop and mobile devices with proper word wrapping
- **Smart Indicators:** Real-time offline detection with user guidance
- **Brand Positioning:** Slogan "Plant privacy. Sprout Freedom." prominently placed in header
- **Technical Accuracy:** Updated encryption to show complete "ChaCha20-Poly1305 + Argon2id" specification

### V3-Only Security Implementation
- **Simplified Codebase:** Removed legacy V1 (PBKDF2) and V2 (scrypt) support for reduced attack surface
- **Argon2id Key Derivation:** Memory-hard, ASIC/GPU resistant key derivation (OWASP recommended)
- **ChaCha20-Poly1305:** Constant-time authenticated encryption resistant to timing attacks
- **Future-Proof Design:** Single encryption standard designed for next 10+ years

### Bug Fixes & Polish
- **Stack Overflow Fix:** Resolved file encryption issues with large files using chunked processing
- **Test Suite Cleanup:** Organized automated tests and removed outdated dependencies
- **Visual Consistency:** Unified clear button styling across all components
- **Performance:** Optimized encryption processing and memory management

---

## Why Should People Trust It?
- **Open Source:**
  - The entire codebase is public and auditable. Anyone can verify there are no backdoors or data leaks.
- **No Server-Side Processing:**
  - All cryptographic operations are performed in the browser. The app never sends your data anywhere.
- **A+ Security Headers:**
  - Hardened with industry-best HTTP security headers, including a strict CSP, HSTS, X-Frame-Options, and more.
- **No Third-Party Scripts:**
  - No external analytics, trackers, or ad scripts. Only essential resources are loaded.
- **Offline-Ready:**
  - The app can be run locally or from a USB stick, and works even without an internet connection.
- **Tested and Verified:**
  - Passes Mozilla Observatory and other security tests with an A+ score, meeting or exceeding the highest web security standards.

---

## Who is it for?
- **Crypto users** who want to protect their wallet recovery phrases.
- **Anyone** who needs to encrypt and store sensitive information securely, without trusting a third party.
- **Security-conscious individuals** who want full control and transparency over their tools.

---

## Why is it Unique?
- **No trust required:** You don’t have to trust a company or server—just the open-source code.
- **Maximum security:** With a strict CSP and no inline scripts/styles, it’s extremely resistant to XSS and other web attacks.
- **User-friendly:** Clean, modern UI with helpful features like password strength feedback and session auto-wipe.

---

## Getting Started

1. **Clone the repo:**
   ```sh
   git clone https://github.com/PurpleBass/cryptoseed.git
   cd cryptoseed
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run locally:**
   ```sh
   npm run dev
   ```
4. **Build for production:**
   ```sh
   npm run build
   ```
5. **Serve the build locally (optional):**
   ```sh
   npx serve dist
   ```

---

## License
MIT

---

## Credits
- Built by [Lovable](https://lovable.dev)
- Security and code improvements by the open-source community

---

## 🖥️ Demo

Live: https://cryptoseed.org

---

**You can trust CryptoSeed for your most sensitive secrets.**

