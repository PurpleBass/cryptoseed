// Test clipboard clearing functionality
// This will demonstrate why the current implementation fails

console.log('=== Clipboard Clearing Reality Check ===');

async function testClipboardClearing() {
    try {
        // 1. Test if we can write to clipboard
        await navigator.clipboard.writeText("Test sensitive data");
        console.log('✅ Successfully wrote to clipboard');
        
        // 2. Read back what we wrote
        const written = await navigator.clipboard.readText();
        console.log('📋 Clipboard contains:', written);
        
        // 3. Try to "clear" the clipboard (this is what CryptoSeed does)
        await navigator.clipboard.writeText("");
        console.log('🧹 Attempted to clear clipboard');
        
        // 4. Check if clearing actually worked
        const afterClear = await navigator.clipboard.readText();
        console.log('📋 Clipboard after "clearing":', afterClear);
        
        if (afterClear === "") {
            console.log('✅ Clipboard clearing WORKS on this platform');
        } else {
            console.log('❌ Clipboard clearing FAILED - data still present');
        }
        
    } catch (error) {
        console.log('❌ Clipboard API error:', error.message);
        console.log('Platform likely blocks clipboard manipulation');
    }
}

// Test platform detection
function detectPlatform() {
    const platform = navigator.userAgent;
    console.log('\n=== Platform Detection ===');
    console.log('User Agent:', platform);
    
    if (/iPhone|iPad|iPod/.test(platform)) {
        console.log('🍎 iOS detected - Clipboard clearing will NOT work');
    } else if (/Mac OS X/.test(platform)) {
        console.log('🍎 macOS detected - Clipboard clearing may not work');
    } else if (/Android/.test(platform)) {
        console.log('🤖 Android detected - Clipboard clearing likely blocked');
    } else if (/Windows/.test(platform)) {
        console.log('🪟 Windows detected - Clipboard clearing may work');
    } else {
        console.log('🐧 Linux/Other detected - Clipboard clearing varies');
    }
}

// Test permission status
async function checkClipboardPermissions() {
    console.log('\n=== Clipboard Permissions ===');
    
    try {
        const permission = await navigator.permissions.query({name: 'clipboard-write'});
        console.log('Clipboard-write permission:', permission.state);
        
        const readPermission = await navigator.permissions.query({name: 'clipboard-read'});
        console.log('Clipboard-read permission:', readPermission.state);
        
    } catch (error) {
        console.log('❌ Cannot check clipboard permissions:', error.message);
    }
}

// Run all tests
console.log('Copy and paste this into browser console on CryptoSeed:');
console.log('1. detectPlatform()');
console.log('2. checkClipboardPermissions()');
console.log('3. testClipboardClearing()');

// Make functions available globally
window.testClipboardClearing = testClipboardClearing;
window.detectPlatform = detectPlatform;
window.checkClipboardPermissions = checkClipboardPermissions;
