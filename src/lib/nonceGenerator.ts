
/**
 * Generates a cryptographically secure random nonce for CSP headers
 * A nonce is a random value that can only be used once
 */
export function generateNonce(length: number = 16): string {
  // Create a Uint8Array with random values
  const randomBytes = new Uint8Array(length);
  window.crypto.getRandomValues(randomBytes);
  
  // Convert random bytes to base64 string
  return btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Creates a nonce and stores it in the window object
 * This allows us to access the same nonce throughout the application
 */
export function setupNonce(): string {
  const nonce = generateNonce();
  // Store the nonce on the window object for access
  (window as any).__CSP_NONCE__ = nonce;
  return nonce;
}

/**
 * Retrieves the current CSP nonce
 */
export function getNonce(): string {
  return (window as any).__CSP_NONCE__ || setupNonce();
}
