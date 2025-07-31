/**
 * CryptoSeed Hybrid Encryption Module
 * 
 * Browser-first WASM implementation with fallback to Noble libraries
 * Addresses JavaScript memory vulnerabilities in browsers while maintaining compatibility
 * 
 * Features:
 * - WASM-based encryption in browsers (secure memory handling)
 * - Noble libraries fallback for Node.js/testing
 * - Environment detection and automatic selection
 * - Secure memory wiping where possible
 */

import { EncryptionResult, DecryptionResult } from './encryptionV3';

// Environment detection
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// Dynamic imports for browser-only WASM libraries
let argon2: any = null;
let sodium: any = null;

// Fallback to Noble libraries for Node.js/testing
let nobleArgon2: any = null;
let nobleChacha: any = null;
let nobleUtils: any = null;

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

// Initialization flags
let wasmInitialized = false;
let nobleInitialized = false;

/**
 * Initialize WASM modules for browser environment
 */
async function initializeWASM(): Promise<boolean> {
  if (wasmInitialized) return true;
  
  if (!isBrowser) return false;
  
  try {
    // Dynamic import for browser-only libraries (with type ignoring)
    const [argon2Module, sodiumModule] = await Promise.all([
      // @ts-ignore - Dynamic import in try-catch, types handled at runtime
      import('argon2-browser').catch(() => null),
      import('libsodium-wrappers').catch(() => null)
    ]);
    
    if (argon2Module && sodiumModule) {
      argon2 = argon2Module.default || argon2Module;
      sodium = sodiumModule.default || sodiumModule;
      
      // Initialize libsodium
      await sodium.ready;
      
      wasmInitialized = true;
      console.log('✅ WASM encryption initialized (secure memory handling enabled)');
      return true;
    }
  } catch (error) {
    console.warn('⚠️ WASM initialization failed, falling back to Noble libraries:', error);
  }
  
  return false;
}

/**
 * Initialize Noble libraries for Node.js/fallback
 */
async function initializeNoble(): Promise<void> {
  if (nobleInitialized) return;
  
  try {
    const [argon2Module, chachaModule, utilsModule] = await Promise.all([
      import('@noble/hashes/argon2'),
      import('@noble/ciphers/chacha'),
      import('@noble/hashes/utils')
    ]);
    
    nobleArgon2 = argon2Module.argon2id;
    nobleChacha = chachaModule.chacha20poly1305;
    nobleUtils = utilsModule;
    
    nobleInitialized = true;
    console.log('✅ Noble encryption initialized (JavaScript fallback)');
  } catch (error) {
    throw new Error(`Failed to initialize Noble libraries: ${error}`);
  }
}

/**
 * Initialize the appropriate encryption backend
 */
export async function initializeEncryption(): Promise<{ backend: 'wasm' | 'noble'; secureMemory: boolean }> {
  // Try WASM first in browser
  if (isBrowser) {
    const wasmSuccess = await initializeWASM();
    if (wasmSuccess) {
      return { backend: 'wasm', secureMemory: true };
    }
  }
  
  // Fallback to Noble libraries
  await initializeNoble();
  return { backend: 'noble', secureMemory: false };
}

/**
 * Check if secure memory handling is available
 */
export function hasSecureMemory(): boolean {
  return wasmInitialized && isBrowser;
}

/**
 * Get current encryption backend info
 */
export function getEncryptionInfo(): { backend: 'wasm' | 'noble'; environment: string; secureMemory: boolean } {
  return {
    backend: wasmInitialized ? 'wasm' : 'noble',
    environment: isBrowser ? 'browser' : 'node',
    secureMemory: hasSecureMemory()
  };
}

/**
 * Generate cryptographically secure random bytes
 */
function generateRandomBytes(size: number): Uint8Array {
  if (wasmInitialized && sodium) {
    return sodium.randombytes_buf(size);
  }
  
  // Fallback to Noble/Web Crypto
  if (nobleUtils) {
    return nobleUtils.randomBytes(size);
  }
  
  // Last resort - Web Crypto API
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint8Array(size));
  }
  
  throw new Error('No secure random number generator available');
}

/**
 * Securely wipe memory (WASM only)
 */
function secureWipe(data: Uint8Array): void {
  if (wasmInitialized && sodium) {
    sodium.memzero(data);
  } else {
    // Best effort - fill with zeros (limited effectiveness in JS)
    data.fill(0);
  }
}

/**
 * Derive key using appropriate backend
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  if (wasmInitialized && argon2) {
    // WASM Argon2id implementation
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
  } else if (nobleInitialized && nobleArgon2) {
    // Noble Argon2id implementation
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);
    
    const key = nobleArgon2(passwordBytes, salt, {
      m: ARGON2ID_MEMORY,
      t: ARGON2ID_ITERATIONS,
      p: ARGON2ID_PARALLELISM,
      dkLen: ARGON2ID_KEY_LENGTH
    });
    
    // Attempt to wipe password from memory
    passwordBytes.fill(0);
    
    return key;
  } else {
    throw new Error('No key derivation backend available');
  }
}

/**
 * Core encryption function with hybrid backend
 */
export async function encryptData(data: Uint8Array, password: string, timestamp: number = Date.now()): Promise<EncryptionResult> {
  const backend = await initializeEncryption();
  
  // Generate random salt and nonce
  const salt = generateRandomBytes(SALT_SIZE);
  const nonce = generateRandomBytes(NONCE_SIZE);
  
  // Create additional authenticated data (AAD)
  const aad = new Uint8Array(AAD_SIZE);
  const view = new DataView(aad.buffer);
  view.setUint32(0, Math.floor(timestamp / 1000), false); // 32-bit timestamp (seconds)
  view.setUint32(4, ENCRYPTION_VERSION_V3, false); // 32-bit version
  
  // Derive encryption key
  const key = await deriveKey(password, salt);
  
  try {
    let ciphertext: Uint8Array;
    
    if (backend.backend === 'wasm' && sodium) {
      // WASM ChaCha20-Poly1305 implementation
      ciphertext = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(
        data,
        aad, // Additional authenticated data
        null, // No secret nonce
        nonce,
        key
      );
    } else if (backend.backend === 'noble' && nobleChacha) {
      // Noble ChaCha20-Poly1305 implementation
      const cipher = nobleChacha(key, nonce, aad);
      ciphertext = cipher.encrypt(data);
    } else {
      throw new Error('No encryption backend available');
    }
    
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
 * Core decryption function with hybrid backend
 */
export async function decryptData(encryptedData: Uint8Array, password: string): Promise<DecryptionResult> {
  const backend = await initializeEncryption();
  
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
  
  // Derive decryption key
  const key = await deriveKey(password, salt);
  
  try {
    let decryptedData: Uint8Array;
    
    if (backend.backend === 'wasm' && sodium) {
      // WASM ChaCha20-Poly1305 implementation
      decryptedData = new Uint8Array(
        sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
          null, // No secret nonce
          ciphertext,
          aad, // Additional authenticated data
          nonce,
          key
        )
      );
    } else if (backend.backend === 'noble' && nobleChacha) {
      // Noble ChaCha20-Poly1305 implementation
      const cipher = nobleChacha(key, nonce, aad);
      decryptedData = cipher.decrypt(ciphertext);
    } else {
      throw new Error('No decryption backend available');
    }
    
    return {
      decryptedData,
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
