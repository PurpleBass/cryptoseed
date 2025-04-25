/**
 * AES-256 encryption functions for CryptoSeed
 * 
 * This module uses the Web Crypto API (SubtleCrypto) to perform
 * secure client-side encryption and decryption. No data is sent
 * to any server at any point.
 */

// Convert string to ArrayBuffer for encryption
function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Convert ArrayBuffer to string after decryption
function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}

// Convert ArrayBuffer to Base64 string for storage/transmission
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 string back to ArrayBuffer for decryption
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate a cryptographically secure key from a password
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  try {
    const passwordBuffer = str2ab(password);
    
    const baseKey = await window.crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    
    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    wipeArrayBuffer(passwordBuffer);
    return derivedKey;
  } catch (error) {
    throw error;
  }
}

// Encrypt a message using AES-GCM
export async function encryptMessage(message: string, password: string): Promise<string> {
  let key: CryptoKey | null = null;
  let messageBuffer: ArrayBuffer | null = null;
  
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    key = await deriveKey(password, salt);
    messageBuffer = str2ab(message);
    
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      messageBuffer
    );
    
    const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
    resultBuffer.set(salt, 0);
    resultBuffer.set(iv, salt.length);
    resultBuffer.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);
    
    const result = arrayBufferToBase64(resultBuffer);
    
    wipeTypedArray(salt);
    wipeTypedArray(iv);
    return result;
  } finally {
    if (messageBuffer) wipeArrayBuffer(messageBuffer);
    wipeEncryptionData(key, null, password);
  }
}

// Decrypt a message using AES-GCM
export async function decryptMessage(encryptedMessage: string, password: string): Promise<string> {
  let key: CryptoKey | null = null;
  let decryptedBuffer: ArrayBuffer | null = null;
  
  try {
    const encryptedBuffer = base64ToArrayBuffer(encryptedMessage);
    
    const salt = encryptedBuffer.slice(0, 16);
    const iv = encryptedBuffer.slice(16, 28);
    const data = encryptedBuffer.slice(28);
    
    key = await deriveKey(password, new Uint8Array(salt));
    
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
    if (decryptedBuffer) wipeArrayBuffer(decryptedBuffer);
    wipeEncryptionData(key, null, password);
  }
}

// Encrypt a file
export async function encryptFile(file: File, password: string): Promise<{ encryptedData: Blob, fileName: string }> {
  let key: CryptoKey | null = null;
  let fileBuffer: ArrayBuffer | null = null;
  
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    key = await deriveKey(password, salt);
    fileBuffer = await file.arrayBuffer();
    
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      fileBuffer
    );
    
    const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
    resultBuffer.set(salt, 0);
    resultBuffer.set(iv, salt.length);
    resultBuffer.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);
    
    const encryptedBlob = new Blob([resultBuffer], { type: 'application/octet-stream' });
    
    wipeTypedArray(salt);
    wipeTypedArray(iv);
    
    return {
      encryptedData: encryptedBlob,
      fileName: `${file.name}.encrypted`
    };
  } finally {
    if (fileBuffer) wipeArrayBuffer(fileBuffer);
    wipeEncryptionData(key, null, password);
  }
}

// Decrypt a file
export async function decryptFile(encryptedFile: File, password: string): Promise<{ decryptedData: Blob, fileName: string }> {
  let key: CryptoKey | null = null;
  let decryptedBuffer: ArrayBuffer | null = null;
  
  try {
    const encryptedBuffer = await encryptedFile.arrayBuffer();
    
    const salt = encryptedBuffer.slice(0, 16);
    const iv = encryptedBuffer.slice(16, 28);
    const data = encryptedBuffer.slice(28);
    
    key = await deriveKey(password, new Uint8Array(salt));
    
    decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv)
      },
      key,
      data
    );
    
    const decryptedBlob = new Blob([decryptedBuffer]);
    
    let fileName = encryptedFile.name;
    if (fileName.endsWith('.encrypted')) {
      fileName = fileName.substring(0, fileName.length - 10);
    }
    
    return {
      decryptedData: decryptedBlob,
      fileName
    };
  } finally {
    if (decryptedBuffer) wipeArrayBuffer(decryptedBuffer);
    wipeEncryptionData(key, null, password);
  }
}

// Check if the Web Crypto API is available
export function isWebCryptoSupported(): boolean {
  return window.crypto && typeof window.crypto.subtle !== 'undefined';
}
