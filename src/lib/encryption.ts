import { wipeBytes } from './secureWipe';
import { pbkdf2 } from './encryptionProcessing';

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
 * Encrypts data using AES-256-GCM.
 *
 * @param {Uint8Array} data The data to encrypt.
 * @param {string} password The password used to derive the encryption key.
 * @param {number} [timestamp] Optional timestamp to include in the encrypted data.
 * @returns {Promise<EncryptionResult>} An object containing the encrypted data, timestamp, and version.
 */
export async function encryptData(data: Uint8Array, password: string, timestamp: number = Date.now()): Promise<EncryptionResult> {
  const version = 1; // Encryption version
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);

  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);

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
    ['encrypt']
  );

  const aadLengthBuffer = new ArrayBuffer(4);
  const aadLengthView = new DataView(aadLengthBuffer);
  aadLengthView.setUint32(0, 8, false); // Length of timestamp + version (8 bytes)

  const aad = new Uint8Array(aadLengthBuffer.byteLength + 8);
  const aadView = new DataView(aad.buffer);
  aadView.setUint32(aadLengthBuffer.byteLength, timestamp, false); // Timestamp
  aadView.setUint32(aadLengthBuffer.byteLength + 4, version, false);     // Version

  const options = {
    name: 'AES-GCM',
    iv: iv,
    additionalData: aad,
    tagLength: 16,
  };

  const encrypted: ArrayBuffer = await crypto.subtle.encrypt(options, cryptoKey, data);
  const encryptedData = new Uint8Array(encrypted);

  // Create output array
  const output = new Uint8Array(1 + salt.byteLength + iv.byteLength + aad.byteLength - aadLengthBuffer.byteLength + encryptedData.byteLength);
  output[0] = version; // Version byte
  output.set(salt, 1); // Salt
  output.set(iv, 1 + salt.byteLength); // IV
  output.set(new Uint8Array(aad.buffer).subarray(aadLengthBuffer.byteLength), 1 + salt.byteLength + iv.byteLength); // Timestamp + Version
  output.set(encryptedData, 1 + salt.byteLength + iv.byteLength + aad.byteLength - aadLengthBuffer.byteLength); // Encrypted data

  // Securely wipe sensitive data
  wipeBytes(key);
  return { encryptedData: output, timestamp: timestamp, version: version };
}

/**
 * Decrypts data using AES-256-GCM.
 *
 * @param {Uint8Array} encryptedData The encrypted data to decrypt.
 * @param {string} password The password used to derive the decryption key.
 * @returns {Promise<DecryptionResult>} An object containing the decrypted data, timestamp, and version.
 */
export async function decryptData(encryptedData: Uint8Array, password: string): Promise<DecryptionResult> {
  const version = encryptedData[0];

  const salt = encryptedData.slice(1, 17);
  const iv = encryptedData.slice(17, 29);
  const aad = encryptedData.slice(29, 37);
  const encrypted = encryptedData.slice(37);

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
    tagLength: 16,
  };

  try {
    const decrypted: ArrayBuffer = await crypto.subtle.decrypt(options, cryptoKey, encrypted);
    const decryptedData = new Uint8Array(decrypted);

    // Securely wipe sensitive data
    wipeBytes(key);
    return { decryptedData: decryptedData, timestamp: timestamp, version: version };
  } catch (error) {
    // Securely wipe sensitive data
    wipeBytes(key);
    throw error;
  }
}
