
export function generateNonce() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function getNonceMetaTag(nonce: string) {
  return `<meta property="csp-nonce" content="${nonce}">`;
}
