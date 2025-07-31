import { 
  encryptMessage, 
  decryptMessage, 
  initializeEncryption, 
  hasSecureMemory, 
  getEncryptionInfo 
} from '../lib/encryptionHybrid';

describe('Hybrid Encryption', () => {
  beforeAll(async () => {
    await initializeEncryption();
  });

  it('should initialize encryption backend successfully', async () => {
    const backend = await initializeEncryption();
    expect(backend).toBeDefined();
    expect(['wasm', 'noble']).toContain(backend.backend);
    expect(typeof backend.secureMemory).toBe('boolean');
  });

  it('should provide encryption info', () => {
    const info = getEncryptionInfo();
    expect(info).toBeDefined();
    expect(['wasm', 'noble']).toContain(info.backend);
    expect(['browser', 'node']).toContain(info.environment);
    expect(typeof info.secureMemory).toBe('boolean');
    
    console.log('Encryption backend info:', info);
  });

  it('should encrypt and decrypt a message correctly', async () => {
    const message = 'Hello, hybrid encryption!';
    const password = 'test-password-123';

    const encrypted = await encryptMessage(message, password);
    expect(encrypted).toBeDefined();
    expect(typeof encrypted).toBe('string');
    expect(encrypted.length).toBeGreaterThan(0);

    const decrypted = await decryptMessage(encrypted, password);
    expect(decrypted).toBe(message);
  });

  it('should fail to decrypt with wrong password', async () => {
    const message = 'Secret message';
    const password = 'correct-password';
    const wrongPassword = 'wrong-password';

    const encrypted = await encryptMessage(message, password);
    
    await expect(decryptMessage(encrypted, wrongPassword)).rejects.toThrow('Decryption failed');
  });

  it('should handle empty messages', async () => {
    const message = '';
    const password = 'test-password';

    const encrypted = await encryptMessage(message, password);
    const decrypted = await decryptMessage(encrypted, password);
    
    expect(decrypted).toBe(message);
  });

  it('should handle unicode messages', async () => {
    const message = '🔐 Unicode test with émojis and spëcial chars! 中文';
    const password = 'unicode-password-测试';

    const encrypted = await encryptMessage(message, password);
    const decrypted = await decryptMessage(encrypted, password);
    
    expect(decrypted).toBe(message);
  });

  it('should produce different ciphertexts for the same message', async () => {
    const message = 'Same message';
    const password = 'same-password';

    const encrypted1 = await encryptMessage(message, password);
    const encrypted2 = await encryptMessage(message, password);
    
    expect(encrypted1).not.toBe(encrypted2); // Should be different due to random salt/nonce
    
    const decrypted1 = await decryptMessage(encrypted1, password);
    const decrypted2 = await decryptMessage(encrypted2, password);
    
    expect(decrypted1).toBe(message);
    expect(decrypted2).toBe(message);
  });

  it('should handle long messages', async () => {
    const message = 'A'.repeat(10000); // 10KB message
    const password = 'long-message-password';

    const encrypted = await encryptMessage(message, password);
    const decrypted = await decryptMessage(encrypted, password);
    
    expect(decrypted).toBe(message);
    expect(decrypted.length).toBe(10000);
  });

  it('should report secure memory capability correctly', () => {
    const hasSecure = hasSecureMemory();
    const info = getEncryptionInfo();
    
    expect(hasSecure).toBe(info.secureMemory);
    
    // In Node.js test environment, should use Noble backend without secure memory
    expect(info.environment).toBe('node');
    expect(info.backend).toBe('noble');
    expect(hasSecure).toBe(false);
  });

  it('should handle special characters in passwords', async () => {
    const message = 'Test message';
    const specialPasswords = [
      'password with spaces',
      'pàssw©rd-wïth-spéciál-chàrs',
      '密码测试',
      '🔑🔐🛡️',
      'pass\nwith\nnewlines',
      'pass\twith\ttabs'
    ];

    for (const password of specialPasswords) {
      const encrypted = await encryptMessage(message, password);
      const decrypted = await decryptMessage(encrypted, password);
      expect(decrypted).toBe(message);
    }
  });

  it('should maintain format compatibility with V3', async () => {
    const message = 'Format compatibility test';
    const password = 'test-password';

    const encrypted = await encryptMessage(message, password);
    
    // Decode base64 to check format
    const encryptedBytes = new Uint8Array(
      atob(encrypted).split('').map(char => char.charCodeAt(0))
    );
    
    // Check version byte
    expect(encryptedBytes[0]).toBe(3); // V3 format
    
    // Check minimum size (version + salt + nonce + aad + ciphertext + auth tag)
    expect(encryptedBytes.length).toBeGreaterThan(1 + 32 + 12 + 8 + 16);
  });
});

// Browser/Node.js compatibility for base64 operations
const atob = typeof window !== 'undefined' ? window.atob : (str: string) => Buffer.from(str, 'base64').toString('binary');
