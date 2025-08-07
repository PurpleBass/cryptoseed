/**
 * WASM-Only Encryption Tests
 * Tests the pure WASM implementation without JavaScript fallback
 */

import { jest } from '@jest/globals';

// Mock WASM modules for testing environment
const mockArgon2 = {
  ArgonType: { Argon2id: 2 },
  hash: jest.fn(() => Promise.resolve({
    hash: new Uint8Array(32).fill(1) // Mock 32-byte key
  }))
};

const mockSodium = {
  ready: Promise.resolve(),
  randombytes_buf: jest.fn((size: number) => {
    const buffer = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      buffer[i] = 2; // Fill with dummy data
    }
    return buffer;
  }),
  crypto_aead_chacha20poly1305_ietf_encrypt: jest.fn((plaintext: Uint8Array) => {
    // Mock encryption - just return plaintext with some padding for realism
    const result = new Uint8Array(plaintext.length + 16);
    result.set(plaintext);
    result.fill(3, plaintext.length); // Mock tag
    return result;
  }),
  crypto_aead_chacha20poly1305_ietf_decrypt: jest.fn((_, ciphertext: Uint8Array) => {
    // Mock decryption - extract original plaintext (remove 16-byte tag)
    return ciphertext.slice(0, -16);
  }),
  memzero: jest.fn()
};

// Mock browser environment and WASM imports
Object.defineProperty(global, 'window', {
  value: {
    document: {},
    btoa: (str: string) => Buffer.from(str, 'binary').toString('base64'),
    atob: (str: string) => Buffer.from(str, 'base64').toString('binary')
  }
});

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: jest.fn((array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    })
  }
});

Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now())
  }
});

// Mock dynamic imports
jest.mock('argon2-browser', () => ({
  default: mockArgon2
}), { virtual: true });

jest.mock('libsodium-wrappers', () => ({
  default: mockSodium
}), { virtual: true });

// Import the module under test
import {
  initializeEncryption,
  encrypt,
  decrypt,
  encryptMessage,
  decryptMessage,
  getEncryptionInfo,
  hasSecureMemory,
  getEncryptionVersion
} from '../lib/encryptionWasmOnly';

describe('WASM-Only Encryption', () => {
  beforeAll(async () => {
    await initializeEncryption();
  });

  describe('Initialization', () => {
    test('should initialize WASM encryption successfully', async () => {
      const result = await initializeEncryption();
      expect(result.backend).toBe('wasm');
      expect(result.secureMemory).toBe(true);
    });

    test('should provide WASM encryption info', () => {
      const info = getEncryptionInfo();
      expect(info.backend).toBe('wasm');
      expect(info.environment).toBe('browser');
      expect(info.secureMemory).toBe(true);
      expect(info.algorithm).toBe('ChaCha20-Poly1305');
      expect(info.kdf).toBe('Argon2id');
      expect(info.version).toBe('V3');
      expect(info.securityLevel).toBe('maximum');
      expect(info.memoryProtection).toBe('native-wasm-wiping');
    });

    test('should report secure memory capability', () => {
      expect(hasSecureMemory()).toBe(true);
    });
  });

  describe('Core Encryption/Decryption', () => {
    test('should encrypt and decrypt a message correctly', async () => {
      const message = 'Test secret message';
      const password = 'strong-password-123';

      const encrypted = await encrypt(message, password);
      expect(encrypted.version).toBe(3);
      expect(encrypted.encryptedData.length).toBeGreaterThan(0);

      const decrypted = await decrypt(encrypted.encryptedData, password);
      expect(decrypted.version).toBe(3);
      expect(decrypted.algorithm).toBe('ChaCha20-Poly1305');
      expect(decrypted.kdf).toBe('Argon2id');
      
      const decryptedMessage = new TextDecoder().decode(decrypted.decryptedData);
      expect(decryptedMessage).toBe(message);
    });

    test('should fail to decrypt with wrong password', async () => {
      const message = 'Secret data';
      const correctPassword = 'correct-password';
      const wrongPassword = 'wrong-password';

      const encrypted = await encrypt(message, correctPassword);
      
      await expect(decrypt(encrypted.encryptedData, wrongPassword))
        .rejects.toThrow('Decryption failed');
    });

    test('should handle empty messages', async () => {
      const message = '';
      const password = 'test-password';

      const encrypted = await encrypt(message, password);
      const decrypted = await decrypt(encrypted.encryptedData, password);
      
      const decryptedMessage = new TextDecoder().decode(decrypted.decryptedData);
      expect(decryptedMessage).toBe(message);
    });

    test('should handle unicode messages', async () => {
      const message = '🔒 Crypto Seed 🌱 Unicode Test 中文 🚀';
      const password = 'unicode-password-测试';

      const encrypted = await encrypt(message, password);
      const decrypted = await decrypt(encrypted.encryptedData, password);
      
      const decryptedMessage = new TextDecoder().decode(decrypted.decryptedData);
      expect(decryptedMessage).toBe(message);
    });

    test('should produce different ciphertexts for the same message', async () => {
      const message = 'Same message';
      const password = 'same-password';

      const encrypted1 = await encrypt(message, password);
      const encrypted2 = await encrypt(message, password);

      expect(encrypted1.encryptedData).not.toEqual(encrypted2.encryptedData);
      
      // But both should decrypt to the same message
      const decrypted1 = await decrypt(encrypted1.encryptedData, password);
      const decrypted2 = await decrypt(encrypted2.encryptedData, password);
      
      const message1 = new TextDecoder().decode(decrypted1.decryptedData);
      const message2 = new TextDecoder().decode(decrypted2.decryptedData);
      
      expect(message1).toBe(message);
      expect(message2).toBe(message);
    });

    test('should handle binary data', async () => {
      const binaryData = new Uint8Array([1, 2, 3, 4, 5, 255, 0, 128]);
      const password = 'binary-password';

      const encrypted = await encrypt(binaryData, password);
      const decrypted = await decrypt(encrypted.encryptedData, password);

      expect(decrypted.decryptedData).toEqual(binaryData);
    });
  });

  describe('High-Level API', () => {
    test('should encrypt and decrypt messages as strings', async () => {
      const message = 'High-level API test message';
      const password = 'api-test-password';

      const encryptedString = await encryptMessage(message, password);
      expect(typeof encryptedString).toBe('string');
      expect(encryptedString.length).toBeGreaterThan(0);

      const decryptedMessage = await decryptMessage(encryptedString, password);
      expect(decryptedMessage).toBe(message);
    });

    test('should handle special characters in passwords', async () => {
      const message = 'Message with special password';
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      const encryptedString = await encryptMessage(message, password);
      const decryptedMessage = await decryptMessage(encryptedString, password);
      
      expect(decryptedMessage).toBe(message);
    });

    test('should handle long messages', async () => {
      const message = 'A'.repeat(10000); // 10KB message
      const password = 'long-message-password';

      const encryptedString = await encryptMessage(message, password);
      const decryptedMessage = await decryptMessage(encryptedString, password);
      
      expect(decryptedMessage).toBe(message);
    });
  });

  describe('Version Detection', () => {
    test('should detect V3 format correctly', async () => {
      const message = 'Version test message';
      const password = 'version-password';

      const encrypted = await encrypt(message, password);
      const version = getEncryptionVersion(encrypted.encryptedData);
      
      expect(version).toBe(3);
    });

    test('should return null for empty data', () => {
      const version = getEncryptionVersion(new Uint8Array(0));
      expect(version).toBeNull();
    });
  });

  describe('Error Handling', () => {
    test('should require password for encryption', async () => {
      await expect(encrypt('test', ''))
        .rejects.toThrow('Password is required');
    });

    test('should require password for decryption', async () => {
      const dummyData = new Uint8Array([3, 1, 2, 3]); // V3 format
      await expect(decrypt(dummyData, ''))
        .rejects.toThrow('Password is required');
    });

    test('should reject data that is too short', async () => {
      const shortData = new Uint8Array([3, 1, 2]); // Too short for V3 format
      await expect(decrypt(shortData, 'password'))
        .rejects.toThrow('Invalid encrypted data: too short');
    });
  });

  describe('WASM-Specific Features', () => {
    test('should call secure memory wiping functions', async () => {
      const message = 'Memory wipe test';
      const password = 'wipe-password';

      await encrypt(message, password);
      
      // Verify that memzero was called for secure wiping
      expect(mockSodium.memzero).toHaveBeenCalled();
    });

    test('should use WASM-specific random generation', async () => {
      const message = 'Random test';
      const password = 'random-password';

      await encrypt(message, password);
      
      // Verify that WASM randombytes_buf was called
      expect(mockSodium.randombytes_buf).toHaveBeenCalled();
    });

    test('should use Argon2id for key derivation', async () => {
      const message = 'Argon2 test';
      const password = 'argon2-password';

      await encrypt(message, password);
      
      // Verify Argon2id was called with correct parameters
      expect(mockArgon2.hash).toHaveBeenCalledWith(
        expect.objectContaining({
          pass: password,
          time: 3,
          mem: 65536,
          parallelism: 4,
          type: mockArgon2.ArgonType.Argon2id,
          hashLen: 32
        })
      );
    });
  });
});
