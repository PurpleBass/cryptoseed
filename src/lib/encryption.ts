import { wipeBytes } from './secureWipe';

export interface EncryptionResult {
  encryptedData: Uint8Array;
  timestamp: number;
  version: number;
}

export interface DecryptionResult {
  decryptedData: Uint8Array;
  timestamp?: number;
  version?: number;
}

/**
 * PBKDF2 key derivation function
 */
export async function pbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number,
  keyLength: number,
  hash: string
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const importedKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: hash
    },
    importedKey,
    keyLength * 8
  );
  
  return new Uint8Array(derivedBits);
}

/**
 * Check if Web Crypto API is supported
 */
export function isWebCryptoSupported(): boolean {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined' &&
         typeof crypto.getRandomValues !== 'undefined';
}

/**
 * Encrypts a text message using AES-256-GCM
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
  
  // Convert to base64 using Buffer (Node compatibility)
  return Buffer.from(result.encryptedData).toString('base64');
}

/**
 * Decrypts a text message using AES-256-GCM
 */
export async function decryptMessage(
  encryptedMessage: string, 
  password: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (onProgress) onProgress(0);
  
  // Convert from base64 using Buffer
  const encryptedData = Uint8Array.from(Buffer.from(encryptedMessage, 'base64'));
  
  if (onProgress) onProgress(50);
  
  const result = await decryptData(encryptedData, password);
  
  if (onProgress) onProgress(100);
  
  const decoder = new TextDecoder();
  return decoder.decode(result.decryptedData);
}

/**
 * Encrypts a file using AES-256-GCM
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
  
  if (onProgress) onProgress(80);
  
  const encryptedBlob = new Blob([result.encryptedData], { type: 'application/octet-stream' });
  const fileName = `${file.name}.encrypted`;
  
  if (onProgress) onProgress(100);
  
  return { encryptedData: encryptedBlob, fileName };
}

/**
 * Decrypts a file using AES-256-GCM
 */
export async function decryptFile(
  file: File, 
  password: string,
  onProgress?: (progress: number) => void
): Promise<{ decryptedData: Blob; fileName: string }> {
  if (onProgress) onProgress(0);
  
  const arrayBuffer = await file.arrayBuffer();
  const encryptedData = new Uint8Array(arrayBuffer);
  
  if (onProgress) onProgress(30);
  
  const result = await decryptData(encryptedData, password);
  
  if (onProgress) onProgress(80);
  
  const decryptedBlob = new Blob([result.decryptedData]);
  let fileName = file.name;
  
  // Remove .encrypted extension if present
  if (fileName.endsWith('.encrypted')) {
    fileName = fileName.slice(0, -10);
  }
  
  if (onProgress) onProgress(100);
  
  return { decryptedData: decryptedBlob, fileName };
}

/**
 * Encrypts data using AES-256-GCM.
 * This revised version uses a simple AAD structure: 8 bytes (4 bytes timestamp, 4 bytes version).
 */
export async function encryptData(data: Uint8Array, password: string, timestamp: number = Date.now()): Promise<EncryptionResult> {
  const version = 1;
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);

  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);

  const key = await pbkdf2(password, salt, 600000, 32, 'SHA-256');

  // Create AAD: 4 bytes for timestamp and 4 bytes for version.
  const aad = new Uint8Array(8);
  const aadView = new DataView(aad.buffer);
  aadView.setUint32(0, timestamp, false);
  aadView.setUint32(4, version, false);

  const alg = {
    name: 'AES-GCM',
    iv: iv,
  };

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    alg,
    false,
    ['encrypt']
  );

  const options = {
    name: 'AES-GCM',
    iv: iv,
    additionalData: aad,
    tagLength: 128,
  };

  const encrypted: ArrayBuffer = await crypto.subtle.encrypt(options, cryptoKey, data);
  const encryptedData = new Uint8Array(encrypted);

  // Output structure: version (1 byte), salt (16 bytes), iv (12 bytes), aad (8 bytes), then ciphertext.
  const output = new Uint8Array(1 + salt.byteLength + iv.byteLength + aad.byteLength + encryptedData.byteLength);
  let offset = 0;
  output[offset++] = version;
  output.set(salt, offset);
  offset += salt.byteLength;
  output.set(iv, offset);
  offset += iv.byteLength;
  output.set(aad, offset);
  offset += aad.byteLength;
  output.set(encryptedData, offset);

  wipeBytes(key);
  return { encryptedData: output, timestamp: timestamp, version: version };
}

/**
 * Decrypts data using AES-256-GCM.
 * Expects the output structure: version (1 byte), salt (16 bytes), iv (12 bytes), aad (8 bytes), then ciphertext.
 */
export async function decryptData(encryptedData: Uint8Array, password: string): Promise<DecryptionResult> {
  // Minimum length: 1 (version) + 16 (salt) + 12 (iv) + 8 (aad) + 16 (tag) = 53 bytes
  if (encryptedData.length < 53) {
    throw new Error("Ciphertext too short or corrupted");
  }
  let offset = 0;
  const version = encryptedData[offset++];

  const salt = encryptedData.slice(offset, offset + 16);
  offset += 16;
  const iv = encryptedData.slice(offset, offset + 12);
  offset += 12;
  const aad = encryptedData.slice(offset, offset + 8);
  offset += 8;
  const ciphertext = encryptedData.slice(offset);

  const aadView = new DataView(aad.buffer);
  const timestamp = aadView.getUint32(0, false);

  const key = await pbkdf2(password, salt, 600000, 32, 'SHA-256');

  const alg = {
    name: 'AES-GCM',
    iv: iv,
  };

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    alg,
    false,
    ['decrypt']
  );

  const options = {
    name: 'AES-GCM',
    iv: iv,
    additionalData: aad,
    tagLength: 128,
  };

  try {
    const decrypted: ArrayBuffer = await crypto.subtle.decrypt(options, cryptoKey, ciphertext);
    const decryptedData = new Uint8Array(decrypted);

    wipeBytes(key);
    return { decryptedData: decryptedData, timestamp: timestamp, version: version };
  } catch (error) {
    wipeBytes(key);
    throw error;
  }
}