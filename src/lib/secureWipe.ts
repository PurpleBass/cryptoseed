
/**
 * Secure data wiping utilities
 * These functions help clean up sensitive data from memory
 */

// Wipe TypedArray by overwriting with zeros
export function wipeTypedArray(array: Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array): void {
  if (array.fill) {
    array.fill(0);
  } else {
    // Fallback for older browsers
    for (let i = 0; i < array.length; i++) {
      array[i] = 0;
    }
  }
}

// Best-effort string wiping by replacing reference
export function wipeString(str: string): void {
  // In JavaScript, we cannot truly wipe strings as they are immutable
  // This is a best-effort approach to encourage garbage collection
  str = '';
  
  // Force immediate garbage collection hint
  if (typeof global !== 'undefined' && global.gc) {
    global.gc();
  }
}

// Wipe ArrayBuffer by overwriting with zeros
export function wipeArrayBuffer(buffer: ArrayBuffer): void {
  wipeTypedArray(new Uint8Array(buffer));
}

// Combined wipe function for encryption operations
export function wipeEncryptionData(
  key: CryptoKey | null,
  data: ArrayBuffer | null,
  password: string | null
): void {
  if (data) {
    wipeArrayBuffer(data);
  }
  
  if (password) {
    wipeString(password);
  }
  
  // CryptoKey cannot be directly wiped, but we can remove the reference
  if (key) {
    // @ts-ignore
    key = null;
  }
}
