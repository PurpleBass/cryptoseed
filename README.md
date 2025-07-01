# CryptoSeed

**CryptoSeed** is a modern, open-source web application for encrypting and decryptin## Why is it Unique?
- **No trust required:** You don't have to trust a company or server—just the open-source code.
- **Maximum security:** With a strict CSP and no inline scripts/styles, it's extremely resistant to XSS and other web attacks.
- **Rich text encryption:** First-class support for formatted text encryption with a privacy-focused editor.
- **Professional workflow:** Export/import `.cryptoseed` files with compression and metadata for seamless collaboration.
- **User-friendly:** Clean, modern UI with helpful features like password strength feedback, session auto-wipe, and real-time offline detection.
- **Mobile-optimized:** Responsive design that works perfectly on all devices.ghly sensitive information—especially cryptocurrency seed phrases and wallet recovery codes. Built with React and Vite, it is designed for maximum privacy, security, and ease of use.

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
- **Rich Text Encryption:**
  - Advanced rich text editor with formatting support (bold, italic, underline, lists, checklists, text alignment).
  - Privacy-focused Tiptap editor that works completely offline.
- **Zero-Knowledge:**
  - All encryption and decryption happen locally in your browser. No data ever leaves your device.
- **Military-Grade Security:**
  - Uses AES-256-GCM encryption with strong password-based key derivation (PBKDF2, 600,000 iterations) and secure memory handling.
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

## 🎉 Latest User Experience Improvements (December 2024 - June 2025)

### Rich Text Editor
- **Secure Rich Text Editing:** Privacy-first Tiptap editor with comprehensive formatting toolbar
- **Formatting Options:** Bold, italic, underline, strikethrough, bullet lists, numbered lists, checklists, text alignment, horizontal rules
- **Keyboard Shortcuts:** Full keyboard shortcut support with collapsible help panel
- **Bubble Menu:** Context-aware formatting menu appears when text is selected
- **Auto-focus Control:** Page loads from top (no auto-scroll to editor) while preserving click-to-focus functionality

### Enhanced Encryption Workflow
- **File Export:** Download encrypted content as structured `.cryptoseed` files with metadata
- **File Import:** Drag & drop or browse to load `.cryptoseed` files for decryption
- **Compression:** Gzip compression before encryption reduces output size by ~60-80%
- **Copy Formatting:** Copy decrypted content preserves rich text formatting (HTML + plain text)

### Improved User Interface
- **Professional Design:** Clean, modern interface with consistent Montserrat typography
- **Responsive Layout:** Optimized for both desktop and mobile devices with proper word wrapping
- **Smart Indicators:** Real-time offline detection with user guidance
- **Brand Positioning:** Slogan "Plant privacy. Sprout Freedom." prominently placed in header
- **Technical Accuracy:** Updated encryption badges to show complete "AES-256-GCM" specification

### Bug Fixes & Polish
- **Word Wrapping:** Fixed text expansion issues in editors and textareas
- **Seed Phrase Accuracy:** Resolved extra word display bug in seed phrase decryption
- **Visual Consistency:** Standardized placeholders, button styling, and color schemes
- **Performance:** Optimized editor rendering and focus management

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

