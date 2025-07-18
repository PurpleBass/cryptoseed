#!/usr/bin/env node

// Create a test with properly encrypted content
console.log('=== Encrypted Content Test Generator ===');

const testMessage = "This is a test message for URL hash verification";
const testPassword = "test123";

console.log('1. Go to: http://localhost:8081');
console.log('2. Make sure you are in ENCRYPT mode');
console.log('3. Enter this text:', testMessage);
console.log('4. Enter this password:', testPassword);
console.log('5. Click Encrypt');
console.log('6. Copy the encrypted result');
console.log('7. Create a URL like: http://localhost:8081/#<encrypted-result>');
console.log('8. Open that URL in a new tab');
console.log('9. Verify the encrypted content appears in decrypt mode');
console.log('10. Enter the password and verify it decrypts to:', testMessage);

console.log('\nExpected behavior:');
console.log('✅ URL loads in decrypt mode with content prefilled');
console.log('✅ Switching to encrypt mode clears the content');
console.log('✅ Switching back to decrypt stays empty');

// For immediate testing with base64
const base64Test = Buffer.from(testMessage).toString('base64');
console.log('\nFor immediate visual test (base64, not encrypted):');
console.log('http://localhost:8081/#' + base64Test);
console.log('Content should appear in decrypt input (but won\'t decrypt properly)');

console.log('\nTo verify fix, check browser console for these log messages:');
console.log('- "Hash detected: ..."');
console.log('- "Prefill effect triggered: ..."');
console.log('- "Setting initial cipher: ..."');
console.log('- "Executing prefill after timeout"');
console.log('- "Setting textInput for decrypt mode"');
