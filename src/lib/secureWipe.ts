
/**
 * Secure memory wiping utilities
 * 
 * These functions attempt to securely wipe sensitive data from memory.
 * While JavaScript doesn't provide guaranteed memory wiping due to garbage collection,
 * these utilities make a best effort to overwrite sensitive data.
 */

/**
 * Wipes a Uint8Array by overwriting it with random data
 */
export function wipeBytes(data: Uint8Array): void {
  if (data && data.length > 0) {
    // Overwrite with random data
    crypto.getRandomValues(data);
    // Then overwrite with zeros
    data.fill(0);
  }
}

/**
 * Wipes an ArrayBuffer by creating a view and wiping it
 */
export function wipeBuffer(buffer: ArrayBuffer): void {
  if (buffer && buffer.byteLength > 0) {
    const view = new Uint8Array(buffer);
    wipeBytes(view);
  }
}

/**
 * Wipes a string by attempting to overwrite the underlying data
 * Note: This is not guaranteed to work due to string immutability in JS
 */
export function wipeString(_str: string): void {
  // In JavaScript, strings are immutable, so we can't actually wipe them
  // This function exists for API completeness but cannot guarantee wiping
  // The parameter is prefixed with underscore to indicate it's intentionally unused
}

/**
 * Creates a new Uint8Array filled with random data of the specified length
 */
export function createRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

/**
 * Securely compares two byte arrays in constant time
 */
export function constantTimeEquals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  
  return result === 0;
}
