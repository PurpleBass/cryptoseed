
/**
 * Secure data wiping utilities
 * 
 * This module provides functions to securely wipe sensitive data from memory
 * after use, reducing the risk of sensitive information being exposed in memory dumps
 * or through other memory-based attacks.
 * 
 * Note: Due to JavaScript's garbage collection and memory management, these are
 * best-effort approaches to ensure sensitive data is overwritten in memory.
 * 
 * @module secureWipe
 * @version 1.0.1
 */

/**
 * Wipes a TypedArray by overwriting it with zeros
 * 
 * This helps ensure that sensitive data doesn't remain in memory after it's no longer needed.
 * While JavaScript doesn't provide direct memory access, overwriting values helps
 * ensure the original data is not accessible in memory.
 * 
 * @param {TypedArray} array - The array to be wiped
 */
export function wipeTypedArray(array: Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array): void {
  if (array.fill) {
    // Use the built-in fill method if available (modern browsers)
    array.fill(0);
  } else {
    // Fallback for older browsers without fill support
    for (let i = 0; i < array.length; i++) {
      array[i] = 0;
    }
  }
}

/**
 * Best-effort string wiping by replacing the reference
 * 
 * String values in JavaScript are immutable, so we can't truly "wipe" them.
 * This function is a best-effort approach to encourage garbage collection
 * of the original string by removing references to it.
 * 
 * @param {string} str - The string to be wiped
 */
export function wipeString(str: string): void {
  // In JavaScript, we cannot truly wipe strings as they are immutable
  // This is a best-effort approach to encourage garbage collection
  str = '';
  
  // Force immediate garbage collection hint
  // Note: This will only work if global.gc is available, which typically requires
  // Node.js to be started with the --expose-gc flag, and won't work in browsers
  if (typeof global !== 'undefined' && global.gc) {
    global.gc();
  }
}

/**
 * Wipe an ArrayBuffer by overwriting its contents with zeros
 * 
 * @param {ArrayBuffer} buffer - The buffer to be wiped
 */
export function wipeArrayBuffer(buffer: ArrayBuffer): void {
  wipeTypedArray(new Uint8Array(buffer));
}

/**
 * Combined wipe function for encryption operations
 * 
 * This function handles wiping multiple types of sensitive data commonly used
 * during encryption and decryption operations.
 * 
 * @param {CryptoKey | null} key - The cryptographic key to remove references to
 * @param {ArrayBuffer | null} data - The data buffer to wipe
 * @param {string | null} password - The password to wipe
 */
export function wipeEncryptionData(
  key: CryptoKey | null,
  data: ArrayBuffer | null,
  password: string | null
): void {
  // Wipe the data buffer if provided
  if (data) {
    wipeArrayBuffer(data);
  }
  
  // Wipe the password string if provided
  if (password) {
    wipeString(password);
  }
  
  // CryptoKey cannot be directly wiped, but we can remove the reference
  // This allows the garbage collector to reclaim the memory
  if (key) {
    // @ts-ignore - Intentionally setting to null to remove reference
    key = null;
  }
}
