#!/usr/bin/env node

// Comprehensive verification script
console.log('=== CryptoSeed URL Hash Verification Script ===\n');

console.log('STEP 1: Create encrypted content');
console.log('1. Open http://localhost:8081');
console.log('2. Make sure "Encrypt" toggle is ON');
console.log('3. Enter text: "Test message for hash verification"');
console.log('4. Enter password: "test123"');
console.log('5. Click "Encrypt"');
console.log('6. Copy the encrypted result (long base64 string)');
console.log('7. Note: it should start with something like "eyJ..."');

console.log('\nSTEP 2: Test URL sharing');
console.log('8. Create URL: http://localhost:8081/#<paste-encrypted-content-here>');
console.log('9. Open this URL in a NEW TAB/WINDOW');

console.log('\nSTEP 3: Verify prefill behavior');
console.log('Expected results when opening the hash URL:');
console.log('✅ Page loads in DECRYPT mode');
console.log('✅ Decrypt input box contains the encrypted content');
console.log('✅ Enter password "test123" and decrypt should work');

console.log('\nSTEP 4: Test clearing behavior');
console.log('10. Click the Encrypt toggle (switch to encrypt mode)');
console.log('✅ Text input should be EMPTY');
console.log('11. Click the Decrypt toggle (switch back to decrypt mode)');
console.log('✅ Text input should STAY EMPTY (not re-prefilled)');

console.log('\nSTEP 5: Test tab switching');
console.log('12. Load hash URL again in new tab');
console.log('13. Once content is prefilled, switch to "File" tab');
console.log('✅ Content should be cleared');
console.log('14. Switch back to "Text" tab');
console.log('✅ Content should stay empty');

console.log('\nDEBUGGING: Check browser console for these messages:');
console.log('- "Hash detected: ..."');
console.log('- "Prefill effect triggered: ..."');
console.log('- "Executing prefill after timeout"');
console.log('- "Setting textInput for decrypt mode"');

console.log('\nIf content is NOT appearing in decrypt input:');
console.log('1. Check browser console for error messages');
console.log('2. Verify the URL hash is not empty');
console.log('3. Try refreshing the page');
console.log('4. Check that the effect logs are appearing');

console.log('\nQuick test URL (base64, won\'t decrypt but should prefill):');
const testContent = 'Quick test for URL hash prefill';
const base64 = Buffer.from(testContent).toString('base64');
console.log(`http://localhost:8081/#${base64}`);
console.log(`Should show: "${testContent}" in decrypt input`);

console.log('\n=== Start testing now! ===');
