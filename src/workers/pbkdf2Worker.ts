
// Runs PBKDF2 in a separate thread so the UI stays responsive.
self.onmessage = async (e) => {
  const { password, salt, iterations } = e.data;
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password),
    'PBKDF2', false,
    ['deriveBits', 'deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  postMessage(key);
};

export {}; // keeps TS happy
