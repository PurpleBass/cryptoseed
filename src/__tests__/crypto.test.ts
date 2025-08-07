import { encryptMessage, decryptMessage } from "@/lib/encryptionHybrid";  

// Inserted helper functions to support Node environments:
const atob = typeof window === "undefined" ? (str: string) => Buffer.from(str, "base64").toString("binary") : window.atob;
const btoa = typeof window === "undefined" ? (str: string) => Buffer.from(str, "binary").toString("base64") : window.btoa;

test("encrypt → decrypt round-trip returns original seed", async () => {
  const seed = "test seed phrase";
  const pass = "hunter2";

  const encrypted = await encryptMessage(seed, pass);
  const plain = await decryptMessage(encrypted, pass);

  expect(plain).toBe(seed);
});

test("tampered ciphertext throws", async () => {
  const encrypted = await encryptMessage("seed", "pwd");
  const raw = atob(encrypted)
    .split("")
    .map((char) => char.charCodeAt(0));
  const bad = new Uint8Array(raw);
  // Tamper with a byte in the authentication tag (last 16 bytes)
  if (bad.length > 16) {
    bad[bad.length - 1] ^= 0xff;
  } else {
    // fallback: tamper with a middle byte
    bad[Math.floor(bad.length / 2)] ^= 0xff;
  }
  await expect(decryptMessage(btoa(String.fromCharCode(...bad)), "pwd")).rejects.toThrow();
});