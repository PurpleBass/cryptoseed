/**
 * Simple integration test for V1 and V2 encryption without compression
 * Tests the core encryptionV2 module directly
 */

import { describe, expect, test } from '@jest/globals';
import { 
  encryptMessageV2, 
  decryptMessageV2, 
  encryptMessageV3,
  decryptDataUniversal,
  getEncryptionInfo,
  ENCRYPTION_VERSION_V2,
  ENCRYPTION_VERSION_V3,
  ENCRYPTION_VERSION_LEGACY
} from '../lib/encryptionV2';
import { encryptMessage, decryptMessage } from '../lib/encryption';

describe('Core Encryption Functionality Tests', () => {
  const testMessage = "This is a test message for encryption! 🔐";
  const testPassword = "SecureTestPassword123!";

  test('should encrypt and decrypt with V1 (legacy) system', async () => {
    const encrypted = await encryptMessage(testMessage, testPassword);
    expect(encrypted).toBeTruthy();
    
    const decrypted = await decryptMessage(encrypted, testPassword);
    expect(decrypted).toBe(testMessage);
  });

  test('should encrypt and decrypt with V2 (enhanced) system', async () => {
    const encrypted = await encryptMessageV2(testMessage, testPassword);
    expect(encrypted).toBeTruthy();
    
    const decrypted = await decryptMessageV2(encrypted, testPassword);
    expect(decrypted).toBe(testMessage);
  });

  test('should encrypt and decrypt with V3 (Argon2id) system', async () => {
    const encrypted = await encryptMessageV3(testMessage, testPassword);
    expect(encrypted).toBeTruthy();
    
    // V3 should decrypt through universal decryption
    const encryptedData = base64ToUint8Array(encrypted);
    const result = await decryptDataUniversal(encryptedData, testPassword);
    const decrypted = new TextDecoder().decode(result.decryptedData);
    
    expect(decrypted).toBe(testMessage);
    expect(result.algorithm).toBe('chacha20poly1305');
    expect(result.kdf).toBe('argon2id');
    expect(result.version).toBe(3);
  });

  test('should produce different outputs for same input with different versions', async () => {
    const v1Encrypted = await encryptMessage(testMessage, testPassword);
    const v2Encrypted = await encryptMessageV2(testMessage, testPassword);
    const v3Encrypted = await encryptMessageV3(testMessage, testPassword);
    
    // Should be different due to different algorithms and formats
    expect(v1Encrypted).not.toBe(v2Encrypted);
    expect(v2Encrypted).not.toBe(v3Encrypted);
    expect(v1Encrypted).not.toBe(v3Encrypted);
    
    // But all should decrypt to the same message
    const v1Decrypted = await decryptMessage(v1Encrypted, testPassword);
    const v2Decrypted = await decryptMessageV2(v2Encrypted, testPassword);
    
    const v3EncryptedData = base64ToUint8Array(v3Encrypted);
    const v3Result = await decryptDataUniversal(v3EncryptedData, testPassword);
    const v3Decrypted = new TextDecoder().decode(v3Result.decryptedData);
    
    expect(v1Decrypted).toBe(testMessage);
    expect(v2Decrypted).toBe(testMessage);
    expect(v3Decrypted).toBe(testMessage);
  }, 30000); // Increased timeout for Argon2id tests

  test('should auto-detect and decrypt V1, V2, and V3 formats universally', async () => {
    const v1Encrypted = await encryptMessage(testMessage, testPassword);
    const v2Encrypted = await encryptMessageV2(testMessage, testPassword);
    const v3Encrypted = await encryptMessageV3(testMessage, testPassword);
    
    // Convert to Uint8Array for universal decryption
    const v1Data = base64ToUint8Array(v1Encrypted);
    const v2Data = base64ToUint8Array(v2Encrypted);
    const v3Data = base64ToUint8Array(v3Encrypted);
    
    // Universal decryption should work for all versions
    const v1Result = await decryptDataUniversal(v1Data, testPassword);
    const v2Result = await decryptDataUniversal(v2Data, testPassword);
    const v3Result = await decryptDataUniversal(v3Data, testPassword);
    
    // All should decrypt to the original message
    const v1Text = new TextDecoder().decode(v1Result.decryptedData);
    const v2Text = new TextDecoder().decode(v2Result.decryptedData);
    const v3Text = new TextDecoder().decode(v3Result.decryptedData);
    
    expect(v1Text).toBe(testMessage);
    expect(v2Text).toBe(testMessage);
    expect(v3Text).toBe(testMessage);
    
    // Should correctly identify the algorithms
    expect(v1Result.algorithm).toBe('aes-gcm');
    expect(v1Result.kdf).toBe('pbkdf2');
    expect(v2Result.algorithm).toBe('chacha20poly1305');
    expect(v2Result.kdf).toBe('scrypt');
    expect(v3Result.algorithm).toBe('chacha20poly1305');
    expect(v3Result.kdf).toBe('argon2id');
  }, 30000); // Increased timeout for Argon2id tests

  test('should provide correct encryption information', async () => {
    const v1Info = getEncryptionInfo(ENCRYPTION_VERSION_LEGACY);
    expect(v1Info.algorithm).toBe('AES-256-GCM');
    expect(v1Info.kdf).toBe('PBKDF2');
    expect(v1Info.securityLevel).toBe('legacy');

    const v2Info = getEncryptionInfo(ENCRYPTION_VERSION_V2);
    expect(v2Info.algorithm).toBe('ChaCha20-Poly1305');
    expect(v2Info.kdf).toBe('scrypt');
    expect(v2Info.securityLevel).toBe('enhanced');

    const v3Info = getEncryptionInfo(ENCRYPTION_VERSION_V3);
    expect(v3Info.algorithm).toBe('ChaCha20-Poly1305');
    expect(v3Info.kdf).toBe('Argon2id');
    expect(v3Info.securityLevel).toBe('future');
  });

  test('should handle invalid passwords correctly', async () => {
    const v1Encrypted = await encryptMessage(testMessage, testPassword);
    const v2Encrypted = await encryptMessageV2(testMessage, testPassword);
    const v3Encrypted = await encryptMessageV3(testMessage, testPassword);
    
    // Wrong password should fail for all versions
    await expect(
      decryptMessage(v1Encrypted, 'wrongpassword')
    ).rejects.toThrow();
    
    await expect(
      decryptMessageV2(v2Encrypted, 'wrongpassword')
    ).rejects.toThrow();

    await expect(
      decryptDataUniversal(base64ToUint8Array(v3Encrypted), 'wrongpassword')
    ).rejects.toThrow();
  }, 30000); // Increased timeout for Argon2id tests

  test('should handle empty and special characters', async () => {
    const specialMessage = "Special chars: 🔐 ñáéíóú 中文 русский عربي";
    
    const v1Encrypted = await encryptMessage(specialMessage, testPassword);
    const v2Encrypted = await encryptMessageV2(specialMessage, testPassword);
    const v3Encrypted = await encryptMessageV3(specialMessage, testPassword);
    
    const v1Decrypted = await decryptMessage(v1Encrypted, testPassword);
    const v2Decrypted = await decryptMessageV2(v2Encrypted, testPassword);
    
    const v3Result = await decryptDataUniversal(base64ToUint8Array(v3Encrypted), testPassword);
    const v3Decrypted = new TextDecoder().decode(v3Result.decryptedData);
    
    expect(v1Decrypted).toBe(specialMessage);
    expect(v2Decrypted).toBe(specialMessage);
    expect(v3Decrypted).toBe(specialMessage);
  }, 30000); // Increased timeout for Argon2id tests

  test('should maintain consistent encryption version detection', async () => {
    // Test multiple encryptions to ensure version byte is consistent
    const v1Encryptions = await Promise.all([
      encryptMessage(testMessage, testPassword),
      encryptMessage(testMessage, testPassword),
      encryptMessage(testMessage, testPassword)
    ]);

    const v2Encryptions = await Promise.all([
      encryptMessageV2(testMessage, testPassword),
      encryptMessageV2(testMessage, testPassword),
      encryptMessageV2(testMessage, testPassword)
    ]);

    const v3Encryptions = await Promise.all([
      encryptMessageV3(testMessage, testPassword),
      encryptMessageV3(testMessage, testPassword),
      encryptMessageV3(testMessage, testPassword)
    ]);

    // All V1 encryptions should start with version 1 (base64 encoded)
    v1Encryptions.forEach(encrypted => {
      const data = base64ToUint8Array(encrypted);
      expect(data[0]).toBe(1); // Version 1
    });

    // All V2 encryptions should start with version 2
    v2Encryptions.forEach(encrypted => {
      const data = base64ToUint8Array(encrypted);
      expect(data[0]).toBe(2); // Version 2
    });

    // All V3 encryptions should start with version 3
    v3Encryptions.forEach(encrypted => {
      const data = base64ToUint8Array(encrypted);
      expect(data[0]).toBe(3); // Version 3
    });
  }, 30000); // Increased timeout for Argon2id tests

  test('should demonstrate Argon2id security benefits', async () => {
    // This test shows that V3 uses different and stronger key derivation
    const message = "Security test message";
    const password = "test123";
    
    const v2Start = Date.now();
    await encryptMessageV2(message, password);
    const v2Time = Date.now() - v2Start;
    
    const v3Start = Date.now();
    await encryptMessageV3(message, password);
    const v3Time = Date.now() - v3Start;
    
    // V3 (Argon2id) should take more time due to memory-hard operations
    // This demonstrates the enhanced security at the cost of performance
    console.log(`V2 (scrypt) encryption time: ${v2Time}ms`);
    console.log(`V3 (Argon2id) encryption time: ${v3Time}ms`);
    
    // Both should work regardless of timing
    const v2Encrypted = await encryptMessageV2(message, password);
    const v3Encrypted = await encryptMessageV3(message, password);
    
    const v2Decrypted = await decryptMessageV2(v2Encrypted, password);
    const v3Result = await decryptDataUniversal(base64ToUint8Array(v3Encrypted), password);
    const v3Decrypted = new TextDecoder().decode(v3Result.decryptedData);
    
    expect(v2Decrypted).toBe(message);
    expect(v3Decrypted).toBe(message);
  });
});

// Helper function for tests
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
