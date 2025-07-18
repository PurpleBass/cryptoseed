#!/usr/bin/env node

// Final verification test - this will help us test with real encrypted content
console.log('=== FINAL URL HASH VERIFICATION TEST ===\n');

console.log('This test will verify that the URL hash prefill is working correctly.');
console.log('We need to test with REAL encrypted content, not just base64.\n');

console.log('STEP 1: Generate encrypted content');
console.log('---------------------------------------');
console.log('1. Open: http://localhost:8081');
console.log('2. Make sure you are in ENCRYPT mode (toggle should show "Encrypt")');
console.log('3. Enter this exact text: "Test message for URL hash prefill verification"');
console.log('4. Enter this password: "testpass123"');
console.log('5. Click the "Encrypt" button');
console.log('6. Copy the entire encrypted result (it will be a long string starting with "eyJ")');

console.log('\nSTEP 2: Create and test the hash URL');
console.log('------------------------------------');
console.log('7. Create this URL: http://localhost:8081/#<paste-your-encrypted-content-here>');
console.log('8. Open this URL in a NEW browser tab');
console.log('9. *** IMPORTANT: Check the browser console for debug messages ***');

console.log('\nEXPECTED RESULTS:');
console.log('✅ Page loads in DECRYPT mode');
console.log('✅ The decrypt input textarea contains your encrypted content');
console.log('✅ Enter password "testpass123" and click Decrypt');
console.log('✅ Should decrypt to: "Test message for URL hash prefill verification"');

console.log('\nSTEP 3: Test mode switching behavior');
console.log('-----------------------------------');
console.log('10. While on the page with prefilled content, click the Encrypt toggle');
console.log('✅ Text input should become EMPTY (text area)');
console.log('11. Click the Decrypt toggle to switch back');
console.log('✅ Text input should STAY EMPTY (not re-prefilled)');

console.log('\nSTEP 4: Test tab switching behavior');
console.log('----------------------------------');
console.log('12. Load the hash URL again in a new tab');
console.log('13. Once content is prefilled, click the "File" tab');
console.log('✅ Content should be cleared from Text tab');
console.log('14. Click back to "Text" tab');
console.log('✅ Text input should stay empty');

console.log('\nDEBUG: Console messages to look for');
console.log('----------------------------------');
console.log('When you load the hash URL, you should see these console messages:');
console.log('1. "Hash detected: ..." (from Index.tsx)');
console.log('2. "Prefill effect triggered: ..." (from EncryptionContainer.tsx)');
console.log('3. "Setting initial cipher: ..." (from EncryptionContainer.tsx)');
console.log('4. "Executing prefill after timeout" (from EncryptionContainer.tsx)');
console.log('5. "Setting textInput for decrypt mode" (from EncryptionContainer.tsx)');

console.log('\nTROUBLESHOOTING:');
console.log('---------------');
console.log('If content is NOT appearing:');
console.log('- Check browser console for errors');
console.log('- Verify the hash is present in the URL');
console.log('- Make sure the encrypted content is properly URL-encoded');
console.log('- Try refreshing the page');

console.log('\nIf content appears but clears immediately:');
console.log('- The clearing effect might be running after the prefill');
console.log('- Check console logs for the order of effects');

// Generate a base64 test URL for quick verification
const quickTest = 'Quick test message for immediate verification';
const base64Quick = Buffer.from(quickTest).toString('base64');
console.log('\nQUICK TEST (base64, for immediate visual verification):');
console.log(`http://localhost:8081/#${base64Quick}`);
console.log(`Should show: "${quickTest}" in decrypt input`);
console.log('(This won\'t decrypt properly since it\'s not encrypted, but should prefill)');

console.log('\n=== START TESTING ===');
console.log('Follow the steps above and report any issues!');
