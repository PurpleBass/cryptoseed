/**
 * Tests for Enhanced Encryption Module (Version 2)
 * Tests ChaCha20-Poly1305 + scrypt encryption and backward compatibility
 */

import { describe, expect, test } from '@jest/globals';
import {
  encryptDataV2,
  decryptDataV2,
  encryptMessageV2,
  decryptMessageV2,
  decryptDataUniversal,
  getEncryptionInfo,
  ENCRYPTION_VERSION_V2,
  ENCRYPTION_VERSION_LEGACY
} from '../lib/encryptionV2';

describe('Enhanced Encryption (V2)', () => {
  const testMessage = "Hello, secure world! 🔐";
  const testPassword = "MySecurePassword123!";
  const weakPassword = "123";

  test('should encrypt and decrypt text successfully with V2', async () => {
    const encrypted = await encryptMessageV2(testMessage, testPassword);
    expect(encrypted).toBeTruthy();
    expect(typeof encrypted).toBe('string');
    
    const decrypted = await decryptMessageV2(encrypted, testPassword);
    expect(decrypted).toBe(testMessage);
  });

  test('should handle binary data correctly', async () => {
    const testData = new Uint8Array([1, 2, 3, 4, 5, 255, 0, 128]);
    const encrypted = await encryptDataV2(testData, testPassword);
    
    expect(encrypted.version).toBe(ENCRYPTION_VERSION_V2);
    expect(encrypted.algorithm).toBe('chacha20poly1305');
    expect(encrypted.kdf).toBe('scrypt');
    
    const decrypted = await decryptDataV2(encrypted.encryptedData, testPassword);
    expect(decrypted.decryptedData).toEqual(testData);
  });

  test('should fail with wrong password', async () => {
    const encrypted = await encryptMessageV2(testMessage, testPassword);
    
    await expect(
      decryptMessageV2(encrypted, "wrongpassword")
    ).rejects.toThrow();
  });

  test('should handle empty strings', async () => {
    const emptyMessage = "";
    const encrypted = await encryptMessageV2(emptyMessage, testPassword);
    const decrypted = await decryptMessageV2(encrypted, testPassword);
    expect(decrypted).toBe(emptyMessage);
  });

  test('should generate different ciphertexts for same input', async () => {
    const encrypted1 = await encryptMessageV2(testMessage, testPassword);
    const encrypted2 = await encryptMessageV2(testMessage, testPassword);
    
    // Should be different due to random nonce and salt
    expect(encrypted1).not.toBe(encrypted2);
    
    // But both should decrypt to the same message
    const decrypted1 = await decryptMessageV2(encrypted1, testPassword);
    const decrypted2 = await decryptMessageV2(encrypted2, testPassword);
    expect(decrypted1).toBe(testMessage);
    expect(decrypted2).toBe(testMessage);
  });

  test('should include timestamp in encrypted data', async () => {
    const beforeTime = Date.now();
    const result = await encryptDataV2(new TextEncoder().encode(testMessage), testPassword);
    const afterTime = Date.now();
    
    expect(result.timestamp).toBeGreaterThanOrEqual(beforeTime);
    expect(result.timestamp).toBeLessThanOrEqual(afterTime);
    
    const decrypted = await decryptDataV2(result.encryptedData, testPassword);
    expect(decrypted.timestamp).toBe(result.timestamp);
  });

  test('should reject corrupted data', async () => {
    const encrypted = await encryptDataV2(new TextEncoder().encode(testMessage), testPassword);
    
    // Corrupt the data
    const corrupted = new Uint8Array(encrypted.encryptedData);
    corrupted[corrupted.length - 1] ^= 1; // Flip last bit
    
    await expect(
      decryptDataV2(corrupted, testPassword)
    ).rejects.toThrow();
  });

  test('should reject data that is too short', async () => {
    const tooShort = new Uint8Array([2, 1, 2, 3]); // Version 2 but too short (need 73+ bytes)
    
    await expect(
      decryptDataV2(tooShort, testPassword)
    ).rejects.toThrow("too short");
  });

  test('should work with weak passwords (but warn about security)', async () => {
    // The system should work with weak passwords but they're not recommended
    const encrypted = await encryptMessageV2(testMessage, weakPassword);
    const decrypted = await decryptMessageV2(encrypted, weakPassword);
    expect(decrypted).toBe(testMessage);
  });
});

describe('Universal Decryption (Backward Compatibility)', () => {
  const testMessage = "Test backward compatibility";
  const testPassword = "TestPassword123";

  test('should decrypt V2 format through universal function', async () => {
    const encrypted = await encryptMessageV2(testMessage, testPassword);
    const encryptedData = base64ToUint8(encrypted);
    
    const result = await decryptDataUniversal(encryptedData, testPassword);
    expect(new TextDecoder().decode(result.decryptedData)).toBe(testMessage);
    expect(result.algorithm).toBe('chacha20poly1305');
    expect(result.kdf).toBe('scrypt');
  });

  test('should provide encryption information', () => {
    const v1Info = getEncryptionInfo(ENCRYPTION_VERSION_LEGACY);
    expect(v1Info.algorithm).toBe('AES-256-GCM');
    expect(v1Info.kdf).toBe('PBKDF2');
    expect(v1Info.securityLevel).toBe('legacy');

    const v2Info = getEncryptionInfo(ENCRYPTION_VERSION_V2);
    expect(v2Info.algorithm).toBe('ChaCha20-Poly1305');
    expect(v2Info.kdf).toBe('scrypt');
    expect(v2Info.securityLevel).toBe('enhanced');
  });

  test('should handle unknown versions gracefully', () => {
    const unknownInfo = getEncryptionInfo(99);
    expect(unknownInfo.securityLevel).toBe('future');
    expect(unknownInfo.algorithm).toBe('Unknown');
  });
});

describe('Security Properties', () => {
  const testData = new Uint8Array([1, 2, 3, 4, 5]);
  const password = "SecureTestPassword2024!";

  test('should use strong cryptographic parameters', async () => {
    const result = await encryptDataV2(testData, password);
    
    // Check that we're using the expected version
    expect(result.version).toBe(ENCRYPTION_VERSION_V2);
    
    // Encrypted data should be significantly larger than input due to:
    // - Version byte (1)
    // - Salt (32 bytes)
    // - Nonce (12 bytes) 
    // - AAD (12 bytes)
    // - Authentication tag (16 bytes)
    // Total overhead: 73 bytes
    expect(result.encryptedData.length).toBe(testData.length + 73);
  });

  test('should generate unique salts and nonces', async () => {
    const results = await Promise.all([
      encryptDataV2(testData, password),
      encryptDataV2(testData, password),
      encryptDataV2(testData, password)
    ]);

    // Extract salts (bytes 1-32) and nonces (bytes 33-44) from each result
    const salts = results.map(r => r.encryptedData.slice(1, 33));
    const nonces = results.map(r => r.encryptedData.slice(33, 45));

    // All salts should be different
    expect(salts[0]).not.toEqual(salts[1]);
    expect(salts[1]).not.toEqual(salts[2]);
    expect(salts[0]).not.toEqual(salts[2]);

    // All nonces should be different
    expect(nonces[0]).not.toEqual(nonces[1]);
    expect(nonces[1]).not.toEqual(nonces[2]);
    expect(nonces[0]).not.toEqual(nonces[2]);
  });
});

// Helper function for tests
function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
