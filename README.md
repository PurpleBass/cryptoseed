

# CryptoSeed

CryptoSeed.org – A secure, local browser-based AES-256 encryptor. Protect your sensitive data with military-grade encryption, all without sending anything online. Fast, private, and easy to use.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Progressive Web App](#progressive-web-app)
- [Security Features](#security-features)
- [Contributing](#contributing)
- [License](#license)

## Introduction

CryptoSeed is a secure, browser-based AES-256 encryptor. This tool helps you protect your sensitive data with military-grade encryption, ensuring that your data remains private and secure without the need to send anything online. CryptoSeed is designed to be fast, private, and easy to use.

## Features

- **AES-256 Encryption**: Uses Advanced Encryption Standard (AES) with a 256-bit key length for strong encryption.
- **Enhanced Key Derivation**: Implements PBKDF2 with 600,000 iterations of SHA-256 for secure password-based key generation.
- **Local Encryption**: Performs all encryption and decryption operations locally in your browser, ensuring that no data is ever sent online.
- **Versioned Format**: Uses a versioned encryption format for backward compatibility with future security improvements.
- **Secure Memory Handling**: Implements memory wiping to protect sensitive data after use.
- **User-Friendly Interface**: Simple and intuitive interface for easy encryption and decryption of files and text.
- **Cross-Platform**: Works on any device with a modern web browser.
- **Progressive Web App**: Can be installed as a standalone application and works offline.

## Installation

To run CryptoSeed locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/PurpleBass/cryptoseed.git
    cd cryptoseed
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    bun install
    ```

3. Start the development server:
    ```bash
    npm run dev
    # or
    bun dev
    ```

4. Open your browser and navigate to `http://localhost:5173`.

## Usage

1. Open CryptoSeed in your browser.
2. Choose whether you want to encrypt text, a file, or a cryptocurrency seed phrase.
3. Enter your password (create a strong one!) and the data you wish to encrypt.
4. Click the encrypt button to generate encrypted output.
5. For decryption, paste the encrypted text or select the encrypted file, enter your password, and click decrypt.

## Progressive Web App

CryptoSeed can be installed as a Progressive Web App (PWA) for offline use:

1. Visit the CryptoSeed website in a supported browser (Chrome, Edge, Safari, etc.)
2. Look for the installation prompt in the address bar or menu
3. Click "Install" to add CryptoSeed to your device
4. Once installed, CryptoSeed will work completely offline

## Security Features

- **AES-256-GCM**: Industry-standard authenticated encryption with 256-bit keys
- **PBKDF2**: Password-Based Key Derivation Function with 600,000 iterations of SHA-256
- **Zero Network Activity**: No API calls, analytics, or data collection
- **Memory Protection**: Sensitive data is wiped from memory after use
- **Versioned Format**: Future-proof encryption with format version tracking
- **Open Source**: All code is available for security review

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your forked repository.
5. Open a pull request to the main repository.

Please make sure to follow the [code of conduct](CODE_OF_CONDUCT.md) and adhere to the [contributing guidelines](CONTRIBUTING.md).

## License

This project is licensed under the GNU General Public License v3. See the [LICENSE](LICENSE) file for details.

