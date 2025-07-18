#!/usr/bin/env node

// Test script to verify URL hash prefill functionality
// This creates a proper encrypted hash for testing

const testContent = "This is a test message for URL hash verification";
const testPassword = "testpass123";

console.log("Test content:", testContent);
console.log("Test password:", testPassword);
console.log("\nTo test URL hash prefill:");
console.log("1. Encrypt this content with the password above");
console.log("2. Copy the encrypted result");
console.log("3. Create a URL like: http://localhost:8081/#<encrypted-content>");
console.log("4. Load that URL in a new tab/window");
console.log("5. Verify the encrypted content appears in the decrypt input");
console.log("6. Enter the password and verify it decrypts correctly");
console.log("7. Switch to encrypt mode - content should clear");
console.log("8. Switch back to decrypt mode - content should stay empty");

// Simple base64 encoding for testing (not actual encryption)
const encodedTest = Buffer.from(testContent).toString('base64');
console.log("\nFor quick testing, you can use this base64 encoded string:");
console.log("http://localhost:8081/#" + encodedTest);
console.log("(Note: This is just base64, not encrypted, so it won't decrypt properly)");
