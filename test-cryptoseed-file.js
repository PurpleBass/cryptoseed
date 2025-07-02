/**
 * Quick test for .cryptoseed file functionality
 * This tests the file encryption → JSON format → decryption workflow
 */

import { encryptFile, decryptFile } from './src/lib/encryptionV3.ts';

// Mock File object for testing
class MockFile {
  constructor(content, name) {
    this.content = content;
    this.name = name;
    this.size = content.length;
    this.type = 'text/plain';
  }

  async arrayBuffer() {
    const encoder = new TextEncoder();
    return encoder.encode(this.content).buffer;
  }

  async text() {
    return this.content;
  }
}

async function testCryptoSeedFileWorkflow() {
  console.log('Testing .cryptoseed file workflow...');
  
  const originalContent = 'This is a test file for .cryptoseed format';
  const password = 'test-password-123';
  const testFile = new MockFile(originalContent, 'test.txt');
  
  try {
    // 1. Encrypt file (should create .cryptoseed format)
    console.log('1. Encrypting file...');
    const { encryptedData, fileName } = await encryptFile(testFile, password);
    
    console.log('   Encrypted file name:', fileName);
    console.log('   Expected: test.txt.cryptoseed');
    
    // 2. Read encrypted data as JSON
    console.log('2. Reading encrypted data...');
    const encryptedText = await encryptedData.text();
    const cryptoSeedData = JSON.parse(encryptedText);
    
    console.log('   CryptoSeed format version:', cryptoSeedData.version);
    console.log('   Algorithm:', cryptoSeedData.algorithm);
    console.log('   KDF:', cryptoSeedData.kdf);
    console.log('   Original filename:', cryptoSeedData.originalFileName);
    
    // 3. Create a new file from the encrypted data to simulate download/upload
    const encryptedFile = new MockFile(encryptedText, fileName);
    
    // 4. Decrypt the file
    console.log('3. Decrypting file...');
    const { decryptedData, fileName: decryptedFileName } = await decryptFile(encryptedFile, password);
    
    // 5. Verify the result
    const decryptedText = await decryptedData.text();
    
    console.log('   Decrypted file name:', decryptedFileName);
    console.log('   Decrypted content:', decryptedText);
    console.log('   Original content: ', originalContent);
    console.log('   Content matches:', decryptedText === originalContent ? '✅ YES' : '❌ NO');
    
    if (decryptedText === originalContent && decryptedFileName === 'test.txt') {
      console.log('\n🎉 .cryptoseed file workflow test PASSED!');
      return true;
    } else {
      console.log('\n❌ .cryptoseed file workflow test FAILED!');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

// Run the test if this is executed directly
if (typeof window === 'undefined') {
  testCryptoSeedFileWorkflow();
}

export { testCryptoSeedFileWorkflow };
