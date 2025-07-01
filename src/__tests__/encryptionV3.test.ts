/**
 * Tests for CryptoSeed V3-Only Encryption
 * Tests the V3 (Argon2id + ChaCha20-Poly1305) encryption system
 */

import { describe, expect, test } from '@jest/globals';
import { 
  encryptMessage, 
  decryptMessage, 
  encryptData,
  decryptData,
  getEncryptionInfo,
  isWebCryptoSupported 
} from '../lib/encryptionV3';
import { 
  processSeedPhrase, 
  processText 
} from '../lib/encryptionProcessing';

describe('CryptoSeed V3 Encryption', () => {
  const testMessage = "This is a test message for V3 encryption! 🔐";
  const testPassword = "SecureTestPassword123!";

  test('should check WebCrypto support', () => {
    expect(isWebCryptoSupported()).toBe(true);
  });

  test('should encrypt and decrypt text messages', async () => {
    const encrypted = await encryptMessage(testMessage, testPassword);
    expect(encrypted).toBeTruthy();
    expect(typeof encrypted).toBe('string');
    
    const decrypted = await decryptMessage(encrypted, testPassword);
    expect(decrypted).toBe(testMessage);
  });

  test('should encrypt and decrypt binary data', async () => {
    const testData = new Uint8Array([1, 2, 3, 4, 5, 255, 0, 128]);
    const encrypted = await encryptData(testData, testPassword);
    
    expect(encrypted.encryptedData).toBeTruthy();
    expect(encrypted.version).toBe(3);
    
    const decrypted = await decryptData(encrypted.encryptedData, testPassword);
    expect(decrypted.decryptedData).toEqual(testData);
    expect(decrypted.version).toBe(3);
    expect(decrypted.algorithm).toBe('ChaCha20-Poly1305');
    expect(decrypted.kdf).toBe('Argon2id');
  });

  test('should provide correct encryption information', () => {
    const info = getEncryptionInfo();
    expect(info.algorithm).toBe('ChaCha20-Poly1305');
    expect(info.kdf).toBe('Argon2id');
    expect(info.version).toBe('V3');
    expect(info.securityLevel).toBe('future-proof');
  });

  test('should fail with wrong password', async () => {
    const encrypted = await encryptMessage(testMessage, testPassword);
    
    await expect(
      decryptMessage(encrypted, "wrongpassword")
    ).rejects.toThrow();
  });

  test('should handle empty strings', async () => {
    const emptyMessage = "";
    const encrypted = await encryptMessage(emptyMessage, testPassword);
    const decrypted = await decryptMessage(encrypted, testPassword);
    expect(decrypted).toBe(emptyMessage);
  });

  test('should generate different ciphertexts for same input', async () => {
    const encrypted1 = await encryptMessage(testMessage, testPassword);
    const encrypted2 = await encryptMessage(testMessage, testPassword);
    
    // Should be different due to random salt and nonce
    expect(encrypted1).not.toBe(encrypted2);
    
    // But both should decrypt to the same message
    const decrypted1 = await decryptMessage(encrypted1, testPassword);
    const decrypted2 = await decryptMessage(encrypted2, testPassword);
    expect(decrypted1).toBe(testMessage);
    expect(decrypted2).toBe(testMessage);
  });

  test('should handle special characters and Unicode', async () => {
    const specialMessage = "Special chars: 🔐 ñáéíóú 中文 русский عربي";
    const encrypted = await encryptMessage(specialMessage, testPassword);
    const decrypted = await decryptMessage(encrypted, testPassword);
    expect(decrypted).toBe(specialMessage);
  });
});

describe('CryptoSeed V3 Processing Integration', () => {
  const testMessage = "Integration test message for V3 processing 🔐";
  const testSeedPhrase = "secure seed phrase for comprehensive integration testing";
  const testPassword = "SecureIntegrationPassword123!";

  test('should process text encryption and decryption', async () => {
    // Test encryption
    const encryptResult = await processText(testMessage, testPassword, true);
    expect(encryptResult.result).toBeTruthy();
    expect(encryptResult.successMessage).toContain('Argon2id');
    
    // Test decryption
    const decryptResult = await processText(encryptResult.result, testPassword, false);
    expect(decryptResult.result).toBe(testMessage);
    expect(decryptResult.successMessage).toContain('Argon2id');
  }, 5000); // Reduced timeout for test environment

  test('should process seed phrase encryption and decryption', async () => {
    // Test encryption
    const encryptResult = await processSeedPhrase(testSeedPhrase, testPassword, true);
    expect(encryptResult.result).toBeTruthy();
    expect(encryptResult.successMessage).toContain('Argon2id');
    
    // Test decryption
    const decryptResult = await processSeedPhrase(encryptResult.result, testPassword, false);
    expect(decryptResult.result).toBe(testSeedPhrase);
    expect(decryptResult.successMessage).toContain('Argon2id');
  }, 5000); // Reduced timeout for test environment

  test('should handle wrong passwords correctly', async () => {
    const encryptResult = await processText(testMessage, testPassword, true);
    
    await expect(
      processText(encryptResult.result, 'wrongpassword', false)
    ).rejects.toThrow();
  }, 15000); // Timeout for Argon2id operations

  test('should provide encryption information in results', async () => {
    const result = await processText(testMessage, testPassword, true);
    expect(result.encryptionInfo).toBeDefined();
    expect(result.encryptionInfo.algorithm).toBe('ChaCha20-Poly1305');
    expect(result.encryptionInfo.kdf).toBe('Argon2id');
    expect(result.encryptionInfo.version).toBe('V3');
    expect(result.encryptionInfo.securityLevel).toBe('future-proof');
  }, 15000); // Timeout for Argon2id operations
});

describe('Security Properties', () => {
  const testData = new Uint8Array([1, 2, 3, 4, 5]);
  const password = "SecureTestPassword2024!";

  test('should use strong cryptographic parameters', async () => {
    const result = await encryptData(testData, password);
    
    // Check that we're using V3
    expect(result.version).toBe(3);
    
    // Encrypted data should be significantly larger than input due to:
    // - Version byte (1)
    // - Salt (32 bytes)
    // - Nonce (12 bytes) 
    // - AAD (8 bytes)
    // - Authentication tag (16 bytes)
    // Total overhead: 69 bytes
    expect(result.encryptedData.length).toBe(testData.length + 69);
  });

  test('should generate unique salts and nonces', async () => {
    const results = await Promise.all([
      encryptData(testData, password),
      encryptData(testData, password),
      encryptData(testData, password)
    ]);

    // Extract salts (bytes 1-32) and nonces (bytes 33-44) from each result
    const salts = results.map(r => r.encryptedData.slice(1, 33));
    const nonces = results.map(r => r.encryptedData.slice(33, 45));

    // Ensure all salts are unique
    expect(salts[0]).not.toEqual(salts[1]);
    expect(salts[1]).not.toEqual(salts[2]);
    expect(salts[0]).not.toEqual(salts[2]);

    // Ensure all nonces are unique
    expect(nonces[0]).not.toEqual(nonces[1]);
    expect(nonces[1]).not.toEqual(nonces[2]);
    expect(nonces[0]).not.toEqual(nonces[2]);
  });

  test('should demonstrate Argon2id memory-hard properties', async () => {
    // This test shows that V3 uses Argon2id which is memory-hard
    const message = "Memory-hard security test";
    const weakPassword = "test123";
    
    const start = Date.now();
    await encryptMessage(message, weakPassword);
    const encryptTime = Date.now() - start;
    
    // Argon2id should take meaningful time even with weak passwords
    // due to memory-hard properties
    expect(encryptTime).toBeGreaterThan(10); // At least 10ms
  }, 30000); // Increased timeout for Argon2id

  test('should maintain consistent version detection', async () => {
    // Test multiple encryptions to ensure version byte is consistent
    const encryptions = await Promise.all([
      encryptMessage(testData.toString(), password),
      encryptMessage(testData.toString(), password),
      encryptMessage(testData.toString(), password)
    ]);

    // All encryptions should start with version 3 (when base64 decoded)
    encryptions.forEach(encrypted => {
      // Decode base64 to check the version byte
      const decoded = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
      expect(decoded[0]).toBe(3); // Version 3
    });
  });

  test('should reject corrupted data', async () => {
    const encrypted = await encryptData(testData, password);
    
    // Corrupt the data
    const corrupted = new Uint8Array(encrypted.encryptedData);
    corrupted[corrupted.length - 1] ^= 1; // Flip last bit
    
    await expect(
      decryptData(corrupted, password)
    ).rejects.toThrow();
  });

  test('should reject data that is too short', async () => {
    const tooShort = new Uint8Array([3, 1, 2, 3]); // Version 3 but too short
    
    await expect(
      decryptData(tooShort, password)
    ).rejects.toThrow();
  });
});
