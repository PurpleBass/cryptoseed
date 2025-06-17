
const worker = new Worker(new URL('../workers/pbkdf2Worker.ts', import.meta.url), { type: 'module' });

export function deriveKey(payload: { password: string; salt: Uint8Array; iterations: number }): Promise<CryptoKey> {
  return new Promise<CryptoKey>((res) => {
    worker.onmessage = (e) => res(e.data as CryptoKey);
    worker.postMessage(payload);
  });
}
