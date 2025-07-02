/**
 * CryptoSeed V3-Only Encryption Module
 * 
 * Security-first implementation using only Argon2id + ChaCha20-Poly1305
 * Eliminates all legacy vulnerabilities by removing V1 (PBKDF2) and V2 (scrypt)
 * 
 * Features:
 * - Argon2id key derivation (OWASP recommended, memory-hard)
 * - ChaCha20-Poly1305 authenticated encryption (constant-time)
 * - Future-proof security design
 * - Simplified codebase with single encryption standard
 */

import { argon2id } from '@noble/hashes/argon2';
import { chacha20poly1305 } from '@noble/ciphers/chacha';
import { randomBytes } from '@noble/hashes/utils';
import { wipeBytes } from './secureWipe';

// Browser/Node.js compatibility for base64 operations
const btoa = typeof window !== 'undefined' ? window.btoa : (str: string) => Buffer.from(str, 'binary').toString('base64');
const atob = typeof window !== 'undefined' ? window.atob : (str: string) => Buffer.from(str, 'base64').toString('binary');

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

/**
 * Check if Web Crypto API is supported
 */
export function isWebCryptoSupported(): boolean {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined' &&
         typeof crypto.getRandomValues !== 'undefined';
}

/**
 * Derive key using Argon2id (memory-hard, OWASP recommended)
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  
  const key = argon2id(passwordBytes, salt, {
    m: ARGON2ID_MEMORY,
    t: ARGON2ID_ITERATIONS, 
    p: ARGON2ID_PARALLELISM,
    dkLen: ARGON2ID_KEY_LENGTH
  });
  
  // Wipe password from memory
  wipeBytes(passwordBytes);
  
  return key;
}

/**
 * Core encryption function using ChaCha20-Poly1305 + Argon2id
 */
export async function encryptData(data: Uint8Array, password: string, timestamp: number = Date.now()): Promise<EncryptionResult> {
  if (!isWebCryptoSupported()) {
    throw new Error('Web Crypto API not supported');
  }

  // Generate random salt and nonce
  const salt = randomBytes(SALT_SIZE);
  const nonce = randomBytes(NONCE_SIZE);
  
  // Create additional authenticated data (AAD)
  const aad = new Uint8Array(AAD_SIZE);
  const view = new DataView(aad.buffer);
  view.setUint32(0, Math.floor(timestamp / 1000), false); // 32-bit timestamp (seconds)
  view.setUint32(4, ENCRYPTION_VERSION_V3, false); // 32-bit version
  
  // Derive encryption key using Argon2id
  const key = await deriveKey(password, salt);
  
  try {
    // Initialize ChaCha20-Poly1305 cipher
    const cipher = chacha20poly1305(key, nonce, aad);
    
    // Encrypt and authenticate
    const ciphertext = cipher.encrypt(data);
    
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
    // Securely wipe the key
    wipeBytes(key);
  }
}

/**
 * Core decryption function for V3 format
 */
export async function decryptData(encryptedData: Uint8Array, password: string): Promise<DecryptionResult> {
  if (!isWebCryptoSupported()) {
    throw new Error('Web Crypto API not supported');
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
  const aadView = new DataView(aad.buffer, aad.byteOffset);
  const timestamp = aadView.getUint32(0, false) * 1000; // Convert back to milliseconds
  
  // Derive decryption key
  const key = await deriveKey(password, salt);
  
  try {
    // Initialize ChaCha20-Poly1305 cipher for decryption
    const cipher = chacha20poly1305(key, nonce, aad);
    
    // Decrypt and authenticate
    const decryptedData = cipher.decrypt(ciphertext);
    
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
    // Securely wipe the key
    wipeBytes(key);
  }
}

/**
 * High-level text encryption using V3 format
 */
export async function encryptMessage(
  message: string, 
  password: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (onProgress) onProgress(0);
  
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  if (onProgress) onProgress(50);
  
  const result = await encryptData(data, password);
  
  if (onProgress) onProgress(100);
  
  // Convert to base64 for text representation
  return uint8ToBase64(result.encryptedData);
}

/**
 * High-level text decryption for V3 format
 */
export async function decryptMessage(
  encryptedMessage: string, 
  password: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (onProgress) onProgress(0);
  
  const encryptedData = base64ToUint8(encryptedMessage);
  
  if (onProgress) onProgress(50);
  
  const result = await decryptData(encryptedData, password);
  
  if (onProgress) onProgress(100);
  
  const decoder = new TextDecoder();
  return decoder.decode(result.decryptedData);
}

/**
 * File encryption using V3 format - creates .cryptoseed files
 */
export async function encryptFile(
  file: File, 
  password: string,
  onProgress?: (progress: number) => void
): Promise<{ encryptedData: Blob; fileName: string }> {
  if (onProgress) onProgress(0);
  
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  
  if (onProgress) onProgress(30);
  
  const result = await encryptData(data, password);
  
  if (onProgress) onProgress(70);
  
  // Create .cryptoseed file format
  const base64Content = btoa(String.fromCharCode(...result.encryptedData));
  const cryptoSeedData = {
    version: "3.0",
    algorithm: "ChaCha20-Poly1305",
    kdf: "Argon2id",
    encrypted: true,
    timestamp: new Date().toISOString(),
    originalFileName: file.name,
    content: base64Content,
    app: "CryptoSeed"
  };
  
  if (onProgress) onProgress(90);
  
  const jsonContent = JSON.stringify(cryptoSeedData, null, 2);
  const encryptedBlob = new Blob([jsonContent], { type: 'application/json' });
  const fileName = `${file.name}.cryptoseed`;
  
  if (onProgress) onProgress(100);
  
  return { encryptedData: encryptedBlob, fileName };
}

/**
 * File decryption for V3 format - handles .cryptoseed files
 */
export async function decryptFile(
  file: File, 
  password: string,
  onProgress?: (progress: number) => void
): Promise<{ decryptedData: Blob; fileName: string }> {
  if (onProgress) onProgress(0);
  
  const fileContent = await file.text();
  
  if (onProgress) onProgress(20);
  
  try {
    // Parse .cryptoseed file format
    const cryptoSeedData = JSON.parse(fileContent);
    
    // Validate the structure
    if (!cryptoSeedData.version || !cryptoSeedData.content || !cryptoSeedData.encrypted) {
      throw new Error("Invalid .cryptoseed file format");
    }
    
    if (!cryptoSeedData.app || cryptoSeedData.app !== "CryptoSeed") {
      throw new Error("This file was not created by CryptoSeed");
    }
    
    if (onProgress) onProgress(40);
    
    // Convert base64 content back to Uint8Array
    const base64Content = cryptoSeedData.content;
    const binaryString = atob(base64Content);
    const encryptedData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      encryptedData[i] = binaryString.charCodeAt(i);
    }
    
    if (onProgress) onProgress(60);
    
    const result = await decryptData(encryptedData, password);
    
    if (onProgress) onProgress(90);
    
    const decryptedBlob = new Blob([result.decryptedData]);
    let fileName = cryptoSeedData.originalFileName || 'decrypted-file';
    
    // Fallback: remove .cryptoseed extension if no originalFileName
    if (!cryptoSeedData.originalFileName && file.name.endsWith('.cryptoseed')) {
      fileName = file.name.slice(0, -11); // Remove .cryptoseed
    }
    
    if (onProgress) onProgress(100);
    
    return { decryptedData: decryptedBlob, fileName };
  } catch (error) {
    // Fallback for old .encrypted files (legacy support during transition)
    if (onProgress) onProgress(30);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const encryptedData = new Uint8Array(arrayBuffer);
      
      if (onProgress) onProgress(60);
      
      const result = await decryptData(encryptedData, password);
      
      if (onProgress) onProgress(90);
      
      const decryptedBlob = new Blob([result.decryptedData]);
      let fileName = file.name;
      
      // Remove .encrypted extension if present
      if (fileName.endsWith('.encrypted')) {
        fileName = fileName.slice(0, -10);
      }
      
      if (onProgress) onProgress(100);
      
      return { decryptedData: decryptedBlob, fileName };
    } catch (fallbackError) {
      throw new Error(`Failed to decrypt file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Get encryption information for V3
 */
export function getEncryptionInfo() {
  return {
    version: 'V3',
    algorithm: 'ChaCha20-Poly1305',
    kdf: 'Argon2id',
    securityLevel: 'future-proof' as const,
    description: 'Next-generation encryption with memory-hard key derivation',
    keyDerivation: {
      algorithm: 'Argon2id',
      memory: `${ARGON2ID_MEMORY} KB`,
      iterations: ARGON2ID_ITERATIONS,
      parallelism: ARGON2ID_PARALLELISM
    },
    encryption: {
      algorithm: 'ChaCha20-Poly1305',
      keySize: '256 bits',
      nonceSize: '96 bits',
      authenticatedEncryption: true
    }
  };
}

// Browser-safe base64 encoding/decoding helpers
function uint8ToBase64(bytes: Uint8Array): string {
  const binaryString = String.fromCharCode(...Array.from(bytes));
  return btoa(binaryString);
}

function base64ToUint8(base64: string): Uint8Array {
  const binaryString = atob(base64);
  return new Uint8Array(binaryString.split('').map(char => char.charCodeAt(0)));
}
