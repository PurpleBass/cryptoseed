// Comprehensive URL Share Testing Script
// This script will help us verify exactly what's happening with URL sharing

console.log('=== URL Share Test Started ===');

// Test data
const testText = "Hello World Test";
const testPassword = "test123";

console.log('\n1. Testing URL Hash Parsing:');
const testURL = 'http://localhost:8082/#A4qE0TNCyKgycA2AxHS%2FAHfOZIofy2Ba1%2Bhwr9vUY5WijxcENwoU19A2My5raGTUoQAAAAOiwswN3wEbBmflDXHfCn1sG1NNosKbqOe5ZQ6i%2B81EVpvUjRnS%2BEmkVhaYgtm7KhguppXaJjcLWzFnobuiR8hzeg%2B0QsHoeCgIPYx9TrNnsoos9gPRoULrwLP7Hy%2FXQB77tKwUI17VMlvBIDIX8EJcNQgnKuqGuFW22EdGckmZW9fjURkk11VgWbu%2BVKJ8FsqkykRuuX4c%2FIx6qPo%3D';

const hashPart = testURL.split('#')[1];
console.log('Hash part:', hashPart);

const decodedHash = decodeURIComponent(hashPart);
console.log('Decoded hash:', decodedHash.substring(0, 100) + '...');
console.log('Decoded hash length:', decodedHash.length);

console.log('\n2. Manual Testing Steps:');
console.log('Step 1: Go to http://localhost:8082/');
console.log('Step 2: Enter text:', testText);
console.log('Step 3: Enter password:', testPassword);
console.log('Step 4: Click "Encrypt Text"');
console.log('Step 5: Copy URL from share button');
console.log('Step 6: Open new tab with that URL');
console.log('Step 7: Check if encrypted text appears in decrypt box');
console.log('Step 8: Switch to encrypt mode');
console.log('Step 9: Verify text is cleared');
console.log('Step 10: Switch back to decrypt mode');
console.log('Step 11: Verify text stays empty');

console.log('\n3. Browser Developer Console Checks:');
console.log('- Open browser developer tools (F12)');
console.log('- Look for console.log message: "Setting initial cipher:"');
console.log('- Check if any errors appear');
console.log('- Monitor the Network tab for any failed requests');

console.log('\n4. Expected Debug Output:');
console.log('When opening URL with hash, you should see:');
console.log('- "Hash detected: [first 50 chars]..." from Index.tsx');
console.log('- "Setting initial cipher: [first 50 chars]..." from EncryptionContainer.tsx');

console.log('\n5. Code Locations to Check:');
console.log('- src/pages/Index.tsx (line 30-40): Hash detection logic');
console.log('- src/components/encryption/EncryptionContainer.tsx (line 190-220): Prefill logic');
console.log('- src/hooks/use-encryption.tsx (line 36-60): Clearing logic');

console.log('\n=== Test the URL below ===');
console.log(testURL);
console.log('\n=== End of Test Script ===');
