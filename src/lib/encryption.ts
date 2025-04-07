
/**
 * ChaCha20-Poly1305 encryption functions for the Secure Nomad Encryptor
 * 
 * This module uses libsodium-wrappers to perform
 * secure client-side encryption and decryption. No data is sent
 * to any server at any point.
 */

import sodium from 'libsodium-wrappers';

// Convert string to Uint8Array
function strToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert Uint8Array to string
function uint8ArrayToStr(array: Uint8Array): string {
  return new TextDecoder().decode(array);
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

// Generate a secure key from a password using Argon2id (via libsodium)
async function deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  await sodium.ready;
  
  // Convert password string to Uint8Array
  const passwordBytes = strToUint8Array(password);
  
  // Derive a key using Argon2id (more secure than PBKDF2 for post-quantum)
  return sodium.crypto_pwhash(
    sodium.crypto_secretbox_KEYBYTES,
    passwordBytes,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_ARGON2ID13
  );
}

// Encrypt a message using ChaCha20-Poly1305
export async function encryptMessage(message: string, password: string): Promise<string> {
  try {
    await sodium.ready;
    
    // Generate a random salt for key derivation
    const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
    
    // Generate a random nonce for ChaCha20-Poly1305
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    
    // Derive encryption key from password
    const key = await deriveKey(password, salt);
    
    // Convert message to Uint8Array
    const messageBytes = strToUint8Array(message);
    
    // Encrypt the message with ChaCha20-Poly1305
    const ciphertext = sodium.crypto_secretbox_easy(messageBytes, nonce, key);
    
    // Combine salt + nonce + encrypted data into a single array for storage
    const resultArray = new Uint8Array(salt.length + nonce.length + ciphertext.length);
    resultArray.set(salt, 0);
    resultArray.set(nonce, salt.length);
    resultArray.set(ciphertext, salt.length + nonce.length);
    
    // Convert to Base64 for easy storage/transmission
    return arrayBufferToBase64(resultArray);
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt message");
  }
}

// Decrypt a message using ChaCha20-Poly1305
export async function decryptMessage(encryptedMessage: string, password: string): Promise<string> {
  try {
    await sodium.ready;
    
    // Convert the Base64 encrypted message back to ArrayBuffer
    const encryptedBuffer = base64ToArrayBuffer(encryptedMessage);
    const encryptedArray = new Uint8Array(encryptedBuffer);
    
    // Extract salt, nonce, and encrypted data
    const salt = encryptedArray.slice(0, sodium.crypto_pwhash_SALTBYTES);
    const nonce = encryptedArray.slice(
      sodium.crypto_pwhash_SALTBYTES, 
      sodium.crypto_pwhash_SALTBYTES + sodium.crypto_secretbox_NONCEBYTES
    );
    const ciphertext = encryptedArray.slice(
      sodium.crypto_pwhash_SALTBYTES + sodium.crypto_secretbox_NONCEBYTES
    );
    
    // Derive the key from the password and salt
    const key = await deriveKey(password, salt);
    
    // Decrypt the message
    const messageBytes = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
    
    // Convert back to string and return
    return uint8ArrayToStr(messageBytes);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt message. The password may be incorrect or the data corrupted.");
  }
}

// Encrypt a file
export async function encryptFile(file: File, password: string): Promise<{ encryptedData: Blob, fileName: string }> {
  try {
    await sodium.ready;
    
    // Generate a random salt for key derivation
    const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
    
    // Generate a random nonce for ChaCha20-Poly1305
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    
    // Derive encryption key from password
    const key = await deriveKey(password, salt);
    
    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // Encrypt the file data with ChaCha20-Poly1305
    const ciphertext = sodium.crypto_secretbox_easy(new Uint8Array(fileBuffer), nonce, key);
    
    // Combine salt + nonce + encrypted data
    const resultArray = new Uint8Array(salt.length + nonce.length + ciphertext.length);
    resultArray.set(salt, 0);
    resultArray.set(nonce, salt.length);
    resultArray.set(ciphertext, salt.length + nonce.length);
    
    // Create a Blob from the encrypted data
    const encryptedBlob = new Blob([resultArray], { type: 'application/octet-stream' });
    
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
    await sodium.ready;
    
    // Read the encrypted file
    const encryptedBuffer = await encryptedFile.arrayBuffer();
    const encryptedArray = new Uint8Array(encryptedBuffer);
    
    // Extract salt, nonce, and encrypted data
    const salt = encryptedArray.slice(0, sodium.crypto_pwhash_SALTBYTES);
    const nonce = encryptedArray.slice(
      sodium.crypto_pwhash_SALTBYTES, 
      sodium.crypto_pwhash_SALTBYTES + sodium.crypto_secretbox_NONCEBYTES
    );
    const ciphertext = encryptedArray.slice(
      sodium.crypto_pwhash_SALTBYTES + sodium.crypto_secretbox_NONCEBYTES
    );
    
    // Derive the key from the password and salt
    const key = await deriveKey(password, salt);
    
    // Decrypt the file data
    const decryptedBytes = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
    
    // Create a Blob from the decrypted data
    const decryptedBlob = new Blob([decryptedBytes]);
    
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

// Check if the necessary cryptographic libraries are available
export function isWebCryptoSupported(): boolean {
  return typeof sodium !== 'undefined' && sodium.ready;
}
