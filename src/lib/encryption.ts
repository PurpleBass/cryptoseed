
/**
 * AES-256 encryption functions for the Secure Nomad Encryptor
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
  // Convert password to ArrayBuffer
  const passwordBuffer = str2ab(password);
  
  // Import the password as a key
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  
  // Derive a key using PBKDF2
  return window.crypto.subtle.deriveKey(
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
}

// Encrypt a message using AES-GCM
export async function encryptMessage(message: string, password: string): Promise<string> {
  try {
    // Generate a random salt
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    
    // Generate a random IV (Initialization Vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Derive encryption key from password
    const key = await deriveKey(password, salt);
    
    // Encrypt the message
    const messageBuffer = str2ab(message);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      messageBuffer
    );
    
    // Combine salt + iv + encrypted data into a single buffer for ease of storage
    const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
    resultBuffer.set(salt, 0);
    resultBuffer.set(iv, salt.length);
    resultBuffer.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);
    
    // Convert to Base64 for easy storage/transmission
    return arrayBufferToBase64(resultBuffer);
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt message");
  }
}

// Decrypt a message using AES-GCM
export async function decryptMessage(encryptedMessage: string, password: string): Promise<string> {
  try {
    // Convert the Base64 encrypted message back to ArrayBuffer
    const encryptedBuffer = base64ToArrayBuffer(encryptedMessage);
    
    // Extract salt, iv, and encrypted data
    const salt = encryptedBuffer.slice(0, 16);
    const iv = encryptedBuffer.slice(16, 28);
    const data = encryptedBuffer.slice(28);
    
    // Derive the key from the password and salt
    const key = await deriveKey(password, new Uint8Array(salt));
    
    // Decrypt the message
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv)
      },
      key,
      data
    );
    
    // Convert back to string and return
    return ab2str(decryptedBuffer);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt message. The password may be incorrect or the data corrupted.");
  }
}

// Encrypt a file
export async function encryptFile(file: File, password: string): Promise<{ encryptedData: Blob, fileName: string }> {
  try {
    // Generate a random salt
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    
    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Derive encryption key from password
    const key = await deriveKey(password, salt);
    
    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // Encrypt the file data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      fileBuffer
    );
    
    // Combine salt + iv + encrypted data
    const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
    resultBuffer.set(salt, 0);
    resultBuffer.set(iv, salt.length);
    resultBuffer.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);
    
    // Create a Blob from the encrypted data
    const encryptedBlob = new Blob([resultBuffer], { type: 'application/octet-stream' });
    
    // Return the encrypted blob and original filename (so it can be restored later)
    return {
      encryptedData: encryptedBlob,
      fileName: `${file.name}.encrypted`
    };
  } catch (error) {
    console.error("File encryption error:", error);
    throw new Error("Failed to encrypt file");
  }
}

// Decrypt a file
export async function decryptFile(encryptedFile: File, password: string): Promise<{ decryptedData: Blob, fileName: string }> {
  try {
    // Read the encrypted file
    const encryptedBuffer = await encryptedFile.arrayBuffer();
    
    // Extract salt, iv, and encrypted data
    const salt = encryptedBuffer.slice(0, 16);
    const iv = encryptedBuffer.slice(16, 28);
    const data = encryptedBuffer.slice(28);
    
    // Derive the key from the password and salt
    const key = await deriveKey(password, new Uint8Array(salt));
    
    // Decrypt the file data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv)
      },
      key,
      data
    );
    
    // Create a Blob from the decrypted data
    const decryptedBlob = new Blob([decryptedBuffer]);
    
    // Remove .encrypted extension if present
    let fileName = encryptedFile.name;
    if (fileName.endsWith('.encrypted')) {
      fileName = fileName.substring(0, fileName.length - 10);
    }
    
    return {
      decryptedData: decryptedBlob,
      fileName
    };
  } catch (error) {
    console.error("File decryption error:", error);
    throw new Error("Failed to decrypt file. The password may be incorrect or the file corrupted.");
  }
}

// Check if the Web Crypto API is available
export function isWebCryptoSupported(): boolean {
  return window.crypto && typeof window.crypto.subtle !== 'undefined';
}
