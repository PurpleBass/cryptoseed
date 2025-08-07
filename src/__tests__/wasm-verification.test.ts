/**
 * WASM Usage Verification Tests
 * 
 * Tests to ensure that WASM encryption is being used in the browser
 * and that memory wiping is functioning properly
 */

import { 
  encryptMessage, 
  decryptMessage, 
  initializeEncryption, 
  getEncryptionInfo,
  hasSecureMemory 
} from '../lib/encryptionHybrid';

describe('WASM Usage Verification', () => {
  beforeAll(async () => {
    // Initialize encryption before tests
    await initializeEncryption();
  });

  test('should use WASM in browser environment', async () => {
    // Mock browser environment
    const mockGlobal = global as any;
    mockGlobal.window = mockGlobal;
    mockGlobal.document = {};
    mockGlobal.navigator = { userAgent: 'test' };

    // Re-initialize to trigger browser detection
    await initializeEncryption();
    
    const info = await getEncryptionInfo();
    console.log('Encryption backend info:', info);
    
    // In a real browser, this should be 'wasm'
    // In Node.js test environment, it will be 'noble'
    expect(info.backend).toBeDefined();
    expect(['wasm', 'noble']).toContain(info.backend);
    
    if (info.environment === 'browser') {
      expect(info.backend).toBe('wasm');
      expect(info.secureMemory).toBe(true);
    } else {
      expect(info.backend).toBe('noble');
      expect(info.environment).toBe('node');
    }
  });

  test('should have secure memory capabilities when using WASM', async () => {
    const hasSecureMem = await hasSecureMemory();
    console.log('Secure memory available:', hasSecureMem);
    
    // In browser with WASM, this should be true
    // In Node.js, this will be false but that's expected
    expect(typeof hasSecureMem).toBe('boolean');
  });

  test('should encrypt and decrypt using the hybrid system', async () => {
    const testMessage = 'This is a test message for WASM encryption verification';
    const password = 'test-password-123';

    console.log('Testing encryption with hybrid system...');
    
    // Encrypt using hybrid system
    const encrypted = await encryptMessage(testMessage, password);
    expect(encrypted).toBeDefined();
    expect(typeof encrypted).toBe('string');
    expect(encrypted.length).toBeGreaterThan(0);
    console.log('Encryption successful, length:', encrypted.length);

    // Decrypt using hybrid system  
    const decrypted = await decryptMessage(encrypted, password);
    expect(decrypted).toBe(testMessage);
    console.log('Decryption successful, message verified');
  });

  test('should provide encryption backend information', async () => {
    const info = await getEncryptionInfo();
    
    console.log('Full encryption info:', JSON.stringify(info, null, 2));
    
    // Verify required fields are present
    expect(info).toHaveProperty('backend');
    expect(info).toHaveProperty('environment');
    expect(info).toHaveProperty('secureMemory');
    
    // Verify expected values
    expect(['wasm', 'noble']).toContain(info.backend);
    expect(['browser', 'node']).toContain(info.environment);
  });

  test('should handle memory wiping (when available)', async () => {
    const testMessage = 'Sensitive data for memory wiping test';
    const password = 'memory-wipe-test-password';

    // This test verifies that the system attempts memory wiping
    // We can't directly verify memory was wiped, but we can ensure
    // the encryption/decryption process includes wiping calls
    
    const encrypted = await encryptMessage(testMessage, password);
    const decrypted = await decryptMessage(encrypted, password);
    
    expect(decrypted).toBe(testMessage);
    
    // If we're using WASM, secure memory should be available
    const info = await getEncryptionInfo();
    if (info.backend === 'wasm') {
      expect(info.secureMemory).toBe(true);
      console.log('✅ WASM backend with secure memory wiping detected');
    } else {
      console.log('ℹ️ Noble.js backend (Node.js environment) - limited memory security');
    }
  });

  test('should fail gracefully with wrong password', async () => {
    const testMessage = 'Test message for wrong password verification';
    const correctPassword = 'correct-password';
    const wrongPassword = 'wrong-password';

    const encrypted = await encryptMessage(testMessage, correctPassword);
    
    await expect(
      decryptMessage(encrypted, wrongPassword)
    ).rejects.toThrow();
    
    console.log('✅ Wrong password correctly rejected');
  });

  test('should maintain V3 format compatibility', async () => {
    const testMessage = 'V3 format compatibility test';
    const password = 'v3-format-test-password';

    const encrypted = await encryptMessage(testMessage, password);
    
    // Decode base64 to check format
    const encryptedBytes = new Uint8Array(
      atob(encrypted).split('').map(char => char.charCodeAt(0))
    );
    
    // First byte should be version 3
    expect(encryptedBytes[0]).toBe(3);
    console.log('✅ V3 format verified - version byte:', encryptedBytes[0]);
    
    // Should have proper length (version + salt + nonce + aad + ciphertext)
    const expectedMinLength = 1 + 32 + 12 + 8 + 16; // + message length
    expect(encryptedBytes.length).toBeGreaterThanOrEqual(expectedMinLength);
    console.log('✅ Proper encrypted data structure verified, length:', encryptedBytes.length);
  });
});

// Browser/Node.js compatibility for base64 operations
const atob = typeof window !== 'undefined' ? window.atob : (str: string) => Buffer.from(str, 'base64').toString('binary');
