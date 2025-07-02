// Test URL Prefill Behavior
console.log('Testing URL with hash...');

// Test the URL provided by the user
const testURL = 'http://localhost:8082/#A4qE0TNCyKgycA2AxHS%2FAHfOZIofy2Ba1%2Bhwr9vUY5WijxcENwoU19A2My5raGTUoQAAAAOiwswN3wEbBmflDXHfCn1sG1NNosKbqOe5ZQ6i%2B81EVpvUjRnS%2BEmkVhaYgtm7KhguppXaJjcLWzFnobuiR8hzeg%2B0QsHoeCgIPYx9TrNnsoos9gPRoULrwLP7Hy%2FXQB77tKwUI17VMlvBIDIX8EJcNQgnKuqGuFW22EdGckmZW9fjURkk11VgWbu%2BVKJ8FsqkykRuuX4c%2FIx6qPo%3D';

// Extract the hash content
const hashContent = testURL.split('#')[1];
console.log('Hash content:', hashContent);

// Decode it
const decodedContent = decodeURIComponent(hashContent);
console.log('Decoded content:', decodedContent.substring(0, 100) + '...');
console.log('Content length:', decodedContent.length);

console.log('\nExpected behavior:');
console.log('1. Page should load in decrypt mode');
console.log('2. Text input should contain the decoded content');
console.log('3. When switching to encrypt mode, content should be cleared');
console.log('4. When switching back to decrypt mode, should remain empty');

console.log('\nOpen:', testURL);
