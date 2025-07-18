// Manual Test Script for Tab Switching Clear Functionality
// This is a manual test to verify that data is cleared when switching between tabs

/**
 * Test Case: Tab Switching Clear Functionality
 * 
 * Description: When switching between encrypt/decrypt tabs or between different
 * input modes (text/file/seedphrase), any previously entered data should be 
 * cleared for a cleaner user experience.
 * 
 * Manual Test Steps:
 * 
 * 1. Test Encrypt/Decrypt Mode Switching:
 *    a. Navigate to the application
 *    b. Enter some text in the text input field
 *    c. Enter a password
 *    d. Switch from "Encrypt" to "Decrypt" mode using the toggle
 *    e. Verify that:
 *       - Text input is cleared
 *       - Password is preserved (for convenience)
 *       - Output is cleared
 *       - File selection is cleared
 *       - Seed phrase is cleared
 * 
 * 2. Test Tab Mode Switching (Text → File → Seed Phrase):
 *    a. Go to Text tab, enter some text and password
 *    b. Switch to File tab
 *    c. Verify that:
 *       - Text input is cleared
 *       - Password is cleared (for security)
 *       - Output is cleared
 *    d. Select a file and enter password
 *    e. Switch to Seed Phrase tab
 *    f. Verify that:
 *       - File selection is cleared
 *       - Password is cleared
 *       - Output is cleared
 *    g. Enter seed phrase words and password
 *    h. Switch back to Text tab
 *    i. Verify that:
 *       - Seed phrase is cleared
 *       - Password is cleared
 *       - Output is cleared
 * 
 * Expected Results:
 * - Each mode switch should clear irrelevant data
 * - UI should feel clean and not carry over data between modes
 * - Security is enhanced by clearing passwords when switching tabs
 * - User experience is improved with a fresh start for each mode
 * 
 * Browser Testing:
 * - Open http://localhost:8082/
 * - Perform the manual test steps above
 * - Check console for any errors
 * 
 * Note: This functionality is implemented in src/hooks/use-encryption.tsx
 * with useEffect hooks that listen for changes in mode and isEncrypting.
 */

console.log('Tab Switching Clear Functionality Test');
console.log('Please perform manual testing as described in the comments above.');
console.log('Application should be running at: http://localhost:8082/');
