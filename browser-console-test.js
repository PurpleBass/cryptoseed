// Comprehensive URL Hash Testing Script
// Run this in the browser console to test URL hash prefill functionality

console.log('=== URL Hash Prefill Test ===');

// Function to test URL hash detection
function testURLHash() {
  console.log('Current URL:', window.location.href);
  console.log('Current hash:', window.location.hash);
  
  if (window.location.hash && window.location.hash.length > 1) {
    const hashContent = decodeURIComponent(window.location.hash.slice(1));
    console.log('Detected hash content:', hashContent);
    return hashContent;
  } else {
    console.log('No hash found in URL');
    return null;
  }
}

// Function to simulate loading a URL with hash
function simulateHashLoad(testContent) {
  console.log('\n=== Simulating Hash Load ===');
  const encodedContent = encodeURIComponent(testContent);
  const testURL = `${window.location.origin}${window.location.pathname}#${encodedContent}`;
  console.log('Test URL would be:', testURL);
  
  // Simulate setting the hash
  window.location.hash = encodedContent;
  console.log('Set hash to:', window.location.hash);
  
  // Trigger hash change event
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

// Function to check if decrypt input has content
function checkDecryptInput() {
  console.log('\n=== Checking Decrypt Input ===');
  
  // Look for textarea elements that might contain the decrypt input
  const textareas = document.querySelectorAll('textarea');
  console.log('Found textareas:', textareas.length);
  
  textareas.forEach((textarea, index) => {
    console.log(`Textarea ${index}:`, {
      value: textarea.value,
      placeholder: textarea.placeholder,
      id: textarea.id,
      className: textarea.className
    });
  });
  
  // Also check for any input elements
  const inputs = document.querySelectorAll('input[type="text"], input:not([type])');
  console.log('Found text inputs:', inputs.length);
  
  inputs.forEach((input, index) => {
    console.log(`Input ${index}:`, {
      value: input.value,
      placeholder: input.placeholder,
      id: input.id,
      className: input.className
    });
  });
}

// Function to check the current mode (encrypt/decrypt)
function checkCurrentMode() {
  console.log('\n=== Checking Current Mode ===');
  
  // Look for mode indicators
  const switches = document.querySelectorAll('[role="switch"]');
  switches.forEach((sw, index) => {
    console.log(`Switch ${index}:`, {
      checked: sw.getAttribute('aria-checked'),
      dataState: sw.getAttribute('data-state'),
      text: sw.textContent
    });
  });
  
  // Look for tabs or mode indicators
  const tabs = document.querySelectorAll('[role="tab"]');
  tabs.forEach((tab, index) => {
    console.log(`Tab ${index}:`, {
      selected: tab.getAttribute('aria-selected'),
      text: tab.textContent
    });
  });
}

// Main test function
function runFullTest() {
  console.log('Starting full URL hash test...\n');
  
  // Test 1: Check current state
  console.log('=== Test 1: Current State ===');
  testURLHash();
  checkCurrentMode();
  checkDecryptInput();
  
  // Test 2: Simulate hash load
  const testContent = 'This is a test message for URL hash verification';
  console.log('\n=== Test 2: Simulating Hash Load ===');
  simulateHashLoad(testContent);
  
  // Wait a bit for React effects to run
  setTimeout(() => {
    console.log('\n=== Test 2 Results (after timeout) ===');
    checkCurrentMode();
    checkDecryptInput();
  }, 100);
  
  setTimeout(() => {
    console.log('\n=== Test 2 Results (after longer timeout) ===');
    checkCurrentMode();
    checkDecryptInput();
  }, 500);
}

// Export functions to global scope
window.testURLHash = testURLHash;
window.checkDecryptInput = checkDecryptInput;
window.checkCurrentMode = checkCurrentMode;
window.runFullTest = runFullTest;

console.log('Test functions available:');
console.log('- testURLHash()');
console.log('- checkDecryptInput()');
console.log('- checkCurrentMode()');
console.log('- runFullTest()');
console.log('\nRun runFullTest() to start comprehensive testing');
