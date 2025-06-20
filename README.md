# CryptoSeed

**CryptoSeed** is a modern, open-source web application for encrypting and decrypting highly sensitive information—especially cryptocurrency seed phrases and wallet recovery codes. Built with React and Vite, it is designed for maximum privacy, security, and ease of use.

---

## ⭐️ Latest Security Status (June 2025)
- **Mozilla Observatory Score:** A+ (130/100)
- **Strict Content Security Policy (CSP):**
  - `default-src 'none'` (deny by default)
  - No `'unsafe-inline'` in `style-src` (no inline styles allowed)
  - Only explicitly allowed sources for scripts, styles, images, fonts, and connections
- **All major security headers set:**
  - HSTS, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, and more
- **No third-party scripts, analytics, or trackers**
- **Offline-ready:** Can be run locally or from a USB stick

---

## What Does CryptoSeed Do?
- **Encrypts and Decrypts Seed Phrases:**
  - Securely encrypt and store your wallet recovery phrases or any sensitive text using AES-256 encryption.
- **Zero-Knowledge:**
  - All encryption and decryption happen locally in your browser. No data ever leaves your device.
- **Military-Grade Security:**
  - Uses strong password-based key derivation and secure memory handling.
- **Clipboard Auto-Wipe & Session Timeout:**
  - Prevents sensitive data from lingering in memory or clipboard.
- **Password Strength Meter:**
  - Helps you choose strong, secure passwords.
- **No Tracking, No Analytics, No Ads:**
  - 100% privacy-focused.

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

