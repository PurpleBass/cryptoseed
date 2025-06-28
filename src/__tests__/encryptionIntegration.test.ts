/**
 * Integration test for both V1 and V2 encryption systems
 * Tests the encryptionProcessing module with both versions
 */

import { describe, expect, test } from '@jest/globals';
import { 
  processSeedPhrase, 
  processText, 
  setDefaultEncryptionVersion
} from '../lib/encryptionProcessing';

describe('Encryption Processing Integration Tests', () => {
  const testMessage = "This is a test message for encryption! 🔐";
  const testSeedPhrase = "test seed phrase with multiple words for comprehensive testing";
  const testPassword = "SecureTestPassword123!";

  test('should process text with V1 encryption and decrypt correctly', async () => {
    // Test V1 encryption
    const encryptResult = await processText(testMessage, testPassword, true, undefined, 'v1');
    expect(encryptResult.result).toBeTruthy();
    expect(encryptResult.successMessage).toContain('AES-256-GCM + PBKDF2');
    
    // Test V1 decryption (should auto-detect)
    const decryptResult = await processText(encryptResult.result, testPassword, false, undefined, 'v1');
    expect(decryptResult.result).toBe(testMessage);
    expect(decryptResult.successMessage).toContain('AES-256-GCM + PBKDF2');
  });

  test('should process text with V2 encryption and decrypt correctly', async () => {
    // Test V2 encryption
    const encryptResult = await processText(testMessage, testPassword, true, undefined, 'v2');
    expect(encryptResult.result).toBeTruthy();
    expect(encryptResult.successMessage).toContain('ChaCha20-Poly1305 + scrypt');
    
    // Test V2 decryption (should auto-detect)
    const decryptResult = await processText(encryptResult.result, testPassword, false, undefined, 'v2');
    expect(decryptResult.result).toBe(testMessage);
    expect(decryptResult.successMessage).toContain('ChaCha20-Poly1305 + scrypt');
  });

  test('should process seed phrase with both encryption versions', async () => {
    // Test V1 encryption
    const v1Encrypt = await processSeedPhrase(testSeedPhrase, testPassword, true, undefined, 'v1');
    expect(v1Encrypt.result).toBeTruthy();
    
    // Test V2 encryption
    const v2Encrypt = await processSeedPhrase(testSeedPhrase, testPassword, true, undefined, 'v2');
    expect(v2Encrypt.result).toBeTruthy();
    
    // Results should be different (different algorithms/formats)
    expect(v1Encrypt.result).not.toBe(v2Encrypt.result);
    
    // Both should decrypt to the same original
    const v1Decrypt = await processSeedPhrase(v1Encrypt.result, testPassword, false);
    const v2Decrypt = await processSeedPhrase(v2Encrypt.result, testPassword, false);
    
    expect(v1Decrypt.result).toBe(testSeedPhrase);
    expect(v2Decrypt.result).toBe(testSeedPhrase);
  });

  test('should auto-detect encryption version during decryption', async () => {
    // Encrypt with V1
    const v1Encrypted = await processText(testMessage, testPassword, true, undefined, 'v1');
    
    // Encrypt with V2  
    const v2Encrypted = await processText(testMessage, testPassword, true, undefined, 'v2');
    
    // Decrypt both without specifying version (should auto-detect)
    const v1Decrypted = await processText(v1Encrypted.result, testPassword, false);
    const v2Decrypted = await processText(v2Encrypted.result, testPassword, false);
    
    expect(v1Decrypted.result).toBe(testMessage);
    expect(v2Decrypted.result).toBe(testMessage);
    
    // Should correctly identify the algorithms used
    expect(v1Decrypted.successMessage).toContain('AES-256-GCM + PBKDF2');
    expect(v2Decrypted.successMessage).toContain('ChaCha20-Poly1305 + scrypt');
  });

  test('should handle encryption version defaults', async () => {
    // Set default to V2
    setDefaultEncryptionVersion('v2');
    
    // Encrypt without specifying version (should use V2)
    const encryptResult = await processText(testMessage, testPassword, true);
    expect(encryptResult.successMessage).toContain('ChaCha20-Poly1305 + scrypt');
    
    // Set default to V1
    setDefaultEncryptionVersion('v1');
    
    // Encrypt without specifying version (should use V1)
    const encryptResultV1 = await processText(testMessage, testPassword, true);
    expect(encryptResultV1.successMessage).toContain('AES-256-GCM + PBKDF2');
    
    // Reset to V2 for other tests
    setDefaultEncryptionVersion('v2');
  });

  test('should provide encryption information', async () => {
    const v2Result = await processText(testMessage, testPassword, true, undefined, 'v2');
    expect(v2Result.encryptionInfo).toBeDefined();
    expect(v2Result.encryptionInfo.algorithm).toBe('ChaCha20-Poly1305');
    expect(v2Result.encryptionInfo.kdf).toBe('scrypt');
    expect(v2Result.encryptionInfo.securityLevel).toBe('enhanced');
  });

  test('should handle wrong passwords correctly for both versions', async () => {
    const v1Encrypted = await processText(testMessage, testPassword, true, undefined, 'v1');
    const v2Encrypted = await processText(testMessage, testPassword, true, undefined, 'v2');
    
    // Wrong password should fail for both versions
    await expect(
      processText(v1Encrypted.result, 'wrongpassword', false)
    ).rejects.toThrow();
    
    await expect(
      processText(v2Encrypted.result, 'wrongpassword', false)
    ).rejects.toThrow();
  });
});
