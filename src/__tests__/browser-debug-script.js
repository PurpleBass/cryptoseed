// Debug script to test URL hash prefill in browser console
// Copy and paste this entire script into the browser console on the CryptoSeed page

console.log('=== CryptoSeed URL Hash Debug Script ===');

// Test function to simulate what should happen when a hash is detected
function simulateHashDetection() {
    console.log('\n1. Simulating hash detection...');
    
    // Set a test hash
    const testContent = 'This is a test message for debugging';
    window.location.hash = '#' + btoa(testContent);
    
    console.log('Set hash to:', window.location.hash);
    console.log('Expected decoded content:', testContent);
    
    // Trigger the hashchange event
    const event = new HashChangeEvent('hashchange');
    window.dispatchEvent(event);
    
    console.log('Dispatched hashchange event');
}

// Function to check React state in the DOM
function checkReactState() {
    console.log('\n2. Checking React state via DOM...');
    
    // Look for encrypt/decrypt toggle
    const switches = document.querySelectorAll('[role="switch"]');
    switches.forEach((sw, i) => {
        console.log(`Switch ${i}:`, {
            ariaChecked: sw.getAttribute('aria-checked'),
            dataState: sw.getAttribute('data-state')
        });
    });
    
    // Look for text input areas
    const textareas = document.querySelectorAll('textarea');
    console.log(`Found ${textareas.length} textareas:`);
    textareas.forEach((ta, i) => {
        console.log(`Textarea ${i}:`, {
            value: ta.value,
            placeholder: ta.placeholder,
            rows: ta.rows,
            className: ta.className.substring(0, 50) + '...'
        });
    });
    
    // Look for text areas and input fields
    const editors = document.querySelectorAll('[role="textbox"], textarea, input[type="text"]');
    console.log(`Found ${editors.length} rich text editors:`);
    editors.forEach((ed, i) => {
        console.log(`Editor ${i}:`, {
            textContent: ed.textContent,
            innerHTML: ed.innerHTML.substring(0, 100) + '...',
            className: ed.className.substring(0, 50) + '...'
        });
    });
}

// Function to check current mode
function checkCurrentMode() {
    console.log('\n3. Checking current mode...');
    
    // Check tabs
    const tabs = document.querySelectorAll('[role="tab"]');
    tabs.forEach((tab, i) => {
        console.log(`Tab ${i}:`, {
            selected: tab.getAttribute('aria-selected'),
            text: tab.textContent?.trim()
        });
    });
    
    // Check for mode indicators in buttons or labels
    const buttons = document.querySelectorAll('button');
    const modeButtons = Array.from(buttons).filter(btn => 
        btn.textContent?.includes('Encrypt') || 
        btn.textContent?.includes('Decrypt')
    );
    modeButtons.forEach((btn, i) => {
        console.log(`Mode button ${i}:`, {
            text: btn.textContent?.trim(),
            disabled: btn.disabled,
            className: btn.className.substring(0, 50) + '...'
        });
    });
}

// Function to monitor React DevTools if available
function checkReactDevTools() {
    console.log('\n4. Checking React DevTools...');
    
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        console.log('React DevTools detected');
        // Try to access React fiber data
        const container = document.getElementById('root');
        if (container && container._reactInternalFiber) {
            console.log('React fiber data available');
        } else if (container && container._reactInternals) {
            console.log('React internals available');
        } else {
            console.log('React instance not found in expected locations');
        }
    } else {
        console.log('React DevTools not detected');
    }
}

// Function to run all checks
function runFullDebug() {
    console.log('Starting full debug session...\n');
    
    simulateHashDetection();
    
    // Wait for React effects to process
    setTimeout(() => {
        checkReactState();
        checkCurrentMode();
        checkReactDevTools();
        
        console.log('\n=== Debug Complete ===');
        console.log('If the textareas/editors are empty, the prefill is not working.');
        console.log('Check the browser console for React error messages.');
        console.log('Also check the Network tab for any failed requests.');
    }, 500);
}

// Function to manually test URL load
function testURLLoad() {
    const testContent = 'URL Load Test Message';
    const encodedContent = btoa(testContent);
    const testURL = `${window.location.origin}${window.location.pathname}#${encodedContent}`;
    
    console.log('\n=== Manual URL Load Test ===');
    console.log('Test URL:', testURL);
    console.log('Opening in new window...');
    
    window.open(testURL, '_blank');
}

// Make functions globally available
window.simulateHashDetection = simulateHashDetection;
window.checkReactState = checkReactState;
window.checkCurrentMode = checkCurrentMode;
window.runFullDebug = runFullDebug;
window.testURLLoad = testURLLoad;

console.log('\nAvailable debug functions:');
console.log('- simulateHashDetection()');
console.log('- checkReactState()');
console.log('- checkCurrentMode()');
console.log('- runFullDebug()');
console.log('- testURLLoad()');
console.log('\nStart with: runFullDebug()');
