
/**
 * AES-256 encryption functions with enhanced key derivation
 * 
 * This module uses the Web Crypto API (SubtleCrypto) to perform
 * secure client-side encryption and decryption with versioned
 * key derivation algorithms. No data is sent to any server.
 * 
 * @module encryption
 * @version 1.0.1
 */

import { wipeTypedArray, wipeString, wipeArrayBuffer, wipeEncryptionData } from "./secureWipe";

// Version flags for encryption algorithm
const VERSION_PBKDF2 = 1;
const CURRENT_VERSION = VERSION_PBKDF2;

/**
 * Converts a string to an ArrayBuffer for encryption processing
 * 
 * @param {string} str - String to convert to ArrayBuffer
 * @returns {ArrayBuffer} - ArrayBuffer representation of the string
 */
function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/**
 * Converts an ArrayBuffer back to a string after decryption
 * 
 * @param {ArrayBuffer} buf - ArrayBuffer to convert to string
 * @returns {string} - String representation of the ArrayBuffer
 */
function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}

/**
 * Converts an ArrayBuffer to a Base64 string for storage or transmission
 * 
 * @param {ArrayBuffer} buffer - ArrayBuffer to convert
 * @returns {string} - Base64 string representation of the ArrayBuffer
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Converts a Base64 string back to an ArrayBuffer for decryption
 * 
 * @param {string} base64 - Base64 string to convert
 * @returns {ArrayBuffer} - ArrayBuffer representation of the Base64 string
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generates a cryptographically secure key from a password using PBKDF2
 * Uses 600,000 iterations of SHA-256 for enhanced security against brute force attacks
 * 
 * @param {string} password - User-provided password
 * @param {Uint8Array} salt - Cryptographically secure salt
 * @returns {Promise<CryptoKey>} - Derived key for encryption/decryption
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  try {
    const passwordBuffer = str2ab(password);
    
    // Import the password as a raw key for use with PBKDF2
    const baseKey = await window.crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    
    // Using 600,000 iterations of SHA-256 for strong security
    // Higher iteration count increases security at the cost of performance
    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 600000, // 600k iterations provides substantial protection against brute force
        hash: "SHA-256"
      },
      baseKey,
      { name: "AES-GCM", length: 256 }, // AES-256-GCM provides authenticated encryption
      false,
      ["encrypt", "decrypt"]
    );

    // Clean up sensitive data from memory
    wipeArrayBuffer(passwordBuffer);
    return derivedKey;
  } catch (error) {
    throw error;
  }
}

/**
 * Encrypts a message using AES-GCM with versioned format
 * 
 * Format structure: [version (1 byte)][salt (16 bytes)][iv (12 bytes)][encrypted data]
 * The version byte allows for future algorithm improvements while maintaining backward compatibility
 * 
 * @param {string} message - Plaintext message to encrypt
 * @param {string} password - Password for encryption
 * @returns {Promise<string>} - Base64 encoded encrypted message with version, salt, and IV
 */
export async function encryptMessage(message: string, password: string): Promise<string> {
  let key: CryptoKey | null = null;
  let messageBuffer: ArrayBuffer | null = null;
  
  try {
    // Generate cryptographically secure random values for salt and IV
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const versionByte = new Uint8Array([CURRENT_VERSION]);
    
    // Derive encryption key from password and salt
    key = await deriveKey(password, salt);
    messageBuffer = str2ab(message);
    
    // Perform encryption using AES-GCM
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      messageBuffer
    );
    
    // Format: [version (1 byte)][salt (16 bytes)][iv (12 bytes)][encrypted data]
    const resultBuffer = new Uint8Array(versionByte.length + salt.length + iv.length + encryptedBuffer.byteLength);
    resultBuffer.set(versionByte, 0);
    resultBuffer.set(salt, versionByte.length);
    resultBuffer.set(iv, versionByte.length + salt.length);
    resultBuffer.set(new Uint8Array(encryptedBuffer), versionByte.length + salt.length + iv.length);
    
    const result = arrayBufferToBase64(resultBuffer);
    
    // Clean up sensitive data
    wipeTypedArray(salt);
    wipeTypedArray(iv);
    return result;
  } finally {
    // Ensure sensitive data is wiped from memory even if an error occurs
    if (messageBuffer) wipeArrayBuffer(messageBuffer);
    wipeEncryptionData(key, null, password);
  }
}

/**
 * Decrypts a message using AES-GCM with versioned format support
 * Supports both legacy (no version byte) and versioned formats
 * 
 * @param {string} encryptedMessage - Base64 encoded encrypted message
 * @param {string} password - Password for decryption
 * @returns {Promise<string>} - Decrypted plaintext message
 */
export async function decryptMessage(encryptedMessage: string, password: string): Promise<string> {
  let key: CryptoKey | null = null;
  let decryptedBuffer: ArrayBuffer | null = null;
  
  try {
    const encryptedBuffer = base64ToArrayBuffer(encryptedMessage);
    const dataView = new DataView(encryptedBuffer);
    
    // Check for versioned format or legacy format
    // Version byte is the first byte in the newer format
    let version = dataView.getUint8(0);
    let dataOffset;
    
    // If version is not recognized, assume legacy format (no version byte)
    if (version !== VERSION_PBKDF2) {
      version = VERSION_PBKDF2;
      dataOffset = 0;
    } else {
      dataOffset = 1; // Skip version byte
    }
    
    // Extract salt, IV, and encrypted data from the formatted buffer
    const salt = encryptedBuffer.slice(dataOffset, dataOffset + 16);
    const iv = encryptedBuffer.slice(dataOffset + 16, dataOffset + 16 + 12);
    const data = encryptedBuffer.slice(dataOffset + 16 + 12);
    
    // Derive decryption key using the extracted salt
    key = await deriveKey(password, new Uint8Array(salt));
    
    // Perform decryption with AES-GCM
    decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv)
      },
      key,
      data
    );
    
    const result = ab2str(decryptedBuffer);
    return result;
  } finally {
    // Ensure sensitive data is wiped from memory even if an error occurs
    if (decryptedBuffer) wipeArrayBuffer(decryptedBuffer);
    wipeEncryptionData(key, null, password);
  }
}

/**
 * Encrypts a file with versioned format
 * 
 * @param {File} file - File to encrypt
 * @param {string} password - Password for encryption
 * @returns {Promise<{ encryptedData: Blob, fileName: string }>} - Encrypted file data and suggested filename
 */
export async function encryptFile(file: File, password: string): Promise<{ encryptedData: Blob, fileName: string }> {
  let key: CryptoKey | null = null;
  let fileBuffer: ArrayBuffer | null = null;
  
  try {
    // Generate cryptographically secure random values for salt and IV
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const versionByte = new Uint8Array([CURRENT_VERSION]);
    
    // Derive encryption key from password and salt
    key = await deriveKey(password, salt);
    fileBuffer = await file.arrayBuffer();
    
    // Perform encryption using AES-GCM
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      fileBuffer
    );
    
    // Format: [version (1 byte)][salt (16 bytes)][iv (12 bytes)][encrypted data]
    const resultBuffer = new Uint8Array(versionByte.length + salt.length + iv.length + encryptedBuffer.byteLength);
    resultBuffer.set(versionByte, 0);
    resultBuffer.set(salt, versionByte.length);
    resultBuffer.set(iv, versionByte.length + salt.length);
    resultBuffer.set(new Uint8Array(encryptedBuffer), versionByte.length + salt.length + iv.length);
    
    const encryptedBlob = new Blob([resultBuffer], { type: 'application/octet-stream' });
    
    // Clean up sensitive data
    wipeTypedArray(salt);
    wipeTypedArray(iv);
    
    return {
      encryptedData: encryptedBlob,
      fileName: `${file.name}.encrypted`
    };
  } finally {
    // Ensure sensitive data is wiped from memory even if an error occurs
    if (fileBuffer) wipeArrayBuffer(fileBuffer);
    wipeEncryptionData(key, null, password);
  }
}

/**
 * Decrypts a file with versioned format support
 * Supports both legacy (no version byte) and versioned formats
 * 
 * @param {File} encryptedFile - Encrypted file
 * @param {string} password - Password for decryption
 * @returns {Promise<{ decryptedData: Blob, fileName: string }>} - Decrypted file data and suggested filename
 */
export async function decryptFile(encryptedFile: File, password: string): Promise<{ decryptedData: Blob, fileName: string }> {
  let key: CryptoKey | null = null;
  let decryptedBuffer: ArrayBuffer | null = null;
  
  try {
    const encryptedBuffer = await encryptedFile.arrayBuffer();
    const dataView = new DataView(encryptedBuffer);
    
    // Check for versioned format or legacy format
    let version = dataView.getUint8(0);
    let dataOffset;
    
    // If version is not recognized, assume legacy format
    if (version !== VERSION_PBKDF2) {
      version = VERSION_PBKDF2;
      dataOffset = 0;
    } else {
      dataOffset = 1; // Skip version byte
    }
    
    // Extract salt, IV, and encrypted data from the formatted buffer
    const salt = encryptedBuffer.slice(dataOffset, dataOffset + 16);
    const iv = encryptedBuffer.slice(dataOffset + 16, dataOffset + 16 + 12);
    const data = encryptedBuffer.slice(dataOffset + 16 + 12);
    
    // Derive decryption key using the extracted salt
    key = await deriveKey(password, new Uint8Array(salt));
    
    // Perform decryption with AES-GCM
    decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv)
      },
      key,
      data
    );
    
    const decryptedBlob = new Blob([decryptedBuffer]);
    
    // Remove ".encrypted" extension if present
    let fileName = encryptedFile.name;
    if (fileName.endsWith('.encrypted')) {
      fileName = fileName.substring(0, fileName.length - 10);
    }
    
    return {
      decryptedData: decryptedBlob,
      fileName
    };
  } finally {
    // Ensure sensitive data is wiped from memory even if an error occurs
    if (decryptedBuffer) wipeArrayBuffer(decryptedBuffer);
    wipeEncryptionData(key, null, password);
  }
}

/**
 * Checks if the Web Crypto API is available
 * Used to verify browser compatibility before attempting encryption operations
 * 
 * @returns {boolean} - Whether the Web Crypto API is supported
 */
export function isWebCryptoSupported(): boolean {
  return window.crypto && typeof window.crypto.subtle !== 'undefined';
}
