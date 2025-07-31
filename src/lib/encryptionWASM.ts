/**
 * CryptoSeed WASM Encryption Module
 * 
 * WebAssembly-based implementation using Argon2id + ChaCha20-Poly1305
 * Addresses JavaScript memory vulnerabilities through WASM memory management
 * 
 * Features:
 * - WASM-based Argon2id key derivation (secure memory handling)
 * - WASM-based ChaCha20-Poly1305 authenticated encryption
 * - Secure memory wiping capabilities
 * - Future-proof security design
 */

// @ts-ignore - argon2-browser doesn't have proper TypeScript definitions
import argon2 from 'argon2-browser';
import sodium from 'libsodium-wrappers';

export interface EncryptionResult {
  encryptedData: Uint8Array;
  timestamp: number;
  version: number;
}

export interface DecryptionResult {
  decryptedData: Uint8Array;
  timestamp: number;
  version: number;
  algorithm: string;
  kdf: string;
}

// V3 constants
const ENCRYPTION_VERSION_V3 = 3;
const SALT_SIZE = 32; // 256 bits
const NONCE_SIZE = 12; // 96 bits for ChaCha20-Poly1305
const AAD_SIZE = 8; // 64 bits (timestamp + version)

// Argon2id parameters - configurable for testing
const isTestEnvironment = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
const ARGON2ID_MEMORY = isTestEnvironment ? 256 : 65536; // 256KB for tests, 64MB for production
const ARGON2ID_ITERATIONS = isTestEnvironment ? 1 : 3; // Faster for tests
const ARGON2ID_PARALLELISM = isTestEnvironment ? 1 : 4; // Less parallel for tests
const ARGON2ID_KEY_LENGTH = 32; // 256 bits

// Initialize libsodium
let sodiumReady = false;

/**
 * Initialize WASM modules
 */
export async function initializeWASM(): Promise<void> {
  if (!sodiumReady) {
    await sodium.ready;
    sodiumReady = true;
  }
}

/**
 * Check if WASM crypto is supported
 */
export function isWASMCryptoSupported(): boolean {
  return sodiumReady && typeof argon2 !== 'undefined';
}

/**
 * Derive key using Argon2id WASM implementation
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  await initializeWASM();
  
  const derivedKey = await (argon2 as any).hash({
    pass: password,
    salt: salt,
    type: (argon2 as any).ArgonType.Argon2id,
    mem: ARGON2ID_MEMORY,
    time: ARGON2ID_ITERATIONS,
    parallelism: ARGON2ID_PARALLELISM,
    hashLen: ARGON2ID_KEY_LENGTH,
  });
  
  return new Uint8Array(derivedKey.hash);
}

/**
 * Generate cryptographically secure random bytes using libsodium
 */
function generateRandomBytes(size: number): Uint8Array {
  return sodium.randombytes_buf(size);
}

/**
 * Securely wipe memory using libsodium
 */
function secureWipe(data: Uint8Array): void {
  sodium.memzero(data);
}

/**
 * Core encryption function using WASM ChaCha20-Poly1305 + Argon2id
 */
export async function encryptData(data: Uint8Array, password: string, timestamp: number = Date.now()): Promise<EncryptionResult> {
  await initializeWASM();
  
  if (!isWASMCryptoSupported()) {
    throw new Error('WASM crypto not supported');
  }

  // Generate random salt and nonce using libsodium
  const salt = generateRandomBytes(SALT_SIZE);
  const nonce = generateRandomBytes(NONCE_SIZE);
  
  // Create additional authenticated data (AAD)
  const aad = new Uint8Array(AAD_SIZE);
  const view = new DataView(aad.buffer);
  view.setUint32(0, Math.floor(timestamp / 1000), false); // 32-bit timestamp (seconds)
  view.setUint32(4, ENCRYPTION_VERSION_V3, false); // 32-bit version
  
  // Derive encryption key using WASM Argon2id
  const key = await deriveKey(password, salt);
  
  try {
    // Encrypt using libsodium ChaCha20-Poly1305
    const ciphertext = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(
      data,
      aad, // Additional authenticated data
      null, // No secret nonce
      nonce,
      key
    );
    
    // Construct final encrypted data: version|salt|nonce|aad|ciphertext
    const encryptedData = new Uint8Array(
      1 + salt.length + nonce.length + aad.length + ciphertext.length
    );
    
    let offset = 0;
    encryptedData[offset++] = ENCRYPTION_VERSION_V3;
    encryptedData.set(salt, offset); offset += salt.length;
    encryptedData.set(nonce, offset); offset += nonce.length;
    encryptedData.set(aad, offset); offset += aad.length;
    encryptedData.set(ciphertext, offset);
    
    return {
      encryptedData,
      timestamp,
      version: ENCRYPTION_VERSION_V3
    };
    
  } finally {
    // Securely wipe sensitive data from memory
    secureWipe(key);
    secureWipe(salt);
    secureWipe(nonce);
  }
}

/**
 * Core decryption function for V3 format using WASM
 */
export async function decryptData(encryptedData: Uint8Array, password: string): Promise<DecryptionResult> {
  await initializeWASM();
  
  if (!isWASMCryptoSupported()) {
    throw new Error('WASM crypto not supported');
  }

  if (encryptedData.length < 1 + SALT_SIZE + NONCE_SIZE + AAD_SIZE + 16) {
    throw new Error('Invalid encrypted data: too short');
  }

  // Parse encrypted data structure
  let offset = 0;
  const version = encryptedData[offset++];
  
  if (version !== ENCRYPTION_VERSION_V3) {
    throw new Error(`Unsupported encryption version: ${version}. This app only supports V3 (Argon2id) encryption.`);
  }
  
  const salt = encryptedData.slice(offset, offset + SALT_SIZE);
  offset += SALT_SIZE;
  
  const nonce = encryptedData.slice(offset, offset + NONCE_SIZE);
  offset += NONCE_SIZE;
  
  const aad = encryptedData.slice(offset, offset + AAD_SIZE);
  offset += AAD_SIZE;
  
  const ciphertext = encryptedData.slice(offset);
  
  // Extract timestamp from AAD
  const aadView = new DataView(aad.buffer);
  const timestamp = aadView.getUint32(0, false) * 1000; // Convert back to milliseconds
  
  // Derive decryption key using WASM Argon2id
  const key = await deriveKey(password, salt);
  
  try {
    // Decrypt using libsodium ChaCha20-Poly1305
    const decryptedData = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
      null, // No secret nonce
      ciphertext,
      aad, // Additional authenticated data
      nonce,
      key
    );
    
    return {
      decryptedData: new Uint8Array(decryptedData),
      timestamp,
      version: ENCRYPTION_VERSION_V3,
      algorithm: 'ChaCha20-Poly1305',
      kdf: 'Argon2id'
    };
    
  } catch (error) {
    throw new Error('Decryption failed: Invalid password or corrupted data');
  } finally {
    // Securely wipe sensitive data from memory
    secureWipe(key);
  }
}

/**
 * High-level encrypt message function
 */
export async function encryptMessage(message: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const messageBytes = encoder.encode(message);
  
  const result = await encryptData(messageBytes, password);
  
  // Convert to base64 for storage/transmission
  return btoa(String.fromCharCode(...result.encryptedData));
}

/**
 * High-level decrypt message function
 */
export async function decryptMessage(encryptedMessage: string, password: string): Promise<string> {
  // Convert from base64
  const encryptedBytes = new Uint8Array(
    atob(encryptedMessage).split('').map(char => char.charCodeAt(0))
  );
  
  const result = await decryptData(encryptedBytes, password);
  
  const decoder = new TextDecoder();
  return decoder.decode(result.decryptedData);
}

// Browser/Node.js compatibility for base64 operations
const btoa = typeof window !== 'undefined' ? window.btoa : (str: string) => Buffer.from(str, 'binary').toString('base64');
const atob = typeof window !== 'undefined' ? window.atob : (str: string) => Buffer.from(str, 'base64').toString('binary');
