
import { encryptMessage, decryptMessage, encryptFile, decryptFile } from "@/lib/encryption";

// Process seed phrase encryption or decryption
export async function processSeedPhrase(
  seedPhrase: string, 
  password: string, 
  isEncrypting: boolean,
  onProgress?: (progress: number) => void
) {
  if (!seedPhrase.trim() || !password.trim()) {
    throw new Error("Please provide both a seed phrase and a password");
  }
  
  if (isEncrypting) {
    // Encrypt seed phrase
    const encrypted = await encryptMessage(seedPhrase, password, onProgress);
    return {
      result: encrypted,
      successMessage: "Your seed phrase has been encrypted"
    };
  } else {
    // Decrypt seed phrase
    const decrypted = await decryptMessage(seedPhrase, password, onProgress);
    return {
      result: decrypted.trim(),
      successMessage: "Your seed phrase has been decrypted"
    };
  }
}

// Format seed phrase with numbers
export function formatSeedPhraseWithNumbers(seedPhrase: string): string {
  if (!seedPhrase) return '';
  
  // Log the input to debug
  console.log('Formatting seed phrase:', seedPhrase);
  
  const words = seedPhrase.trim().split(/\s+/);
  console.log('Words array:', words);
  
  const formatted = words.map((word, index) => `${index + 1}. ${word}`).join(' ');
  console.log('Formatted result:', formatted);
  
  return formatted;
}

// Process text encryption or decryption
export async function processText(
  text: string, 
  password: string, 
  isEncrypting: boolean,
  onProgress?: (progress: number) => void
) {
  if (!text.trim() || !password.trim()) {
    throw new Error("Please provide both text and a password");
  }
  
  if (isEncrypting) {
    // Encrypt text
    const encrypted = await encryptMessage(text, password, onProgress);
    return {
      result: encrypted,
      successMessage: "Your text has been encrypted"
    };
  } else {
    // Decrypt text
    const decrypted = await decryptMessage(text, password, onProgress);
    return {
      result: decrypted.trim(),
      successMessage: "Your text has been decrypted"
    };
  }
}

// Process file encryption or decryption
export async function processFile(
  file: File, 
  password: string, 
  isEncrypting: boolean,
  onProgress?: (progress: number) => void
) {
  if (!file || !password.trim()) {
    throw new Error("Please select a file and provide a password");
  }
  
  if (isEncrypting) {
    // Encrypt file
    const { encryptedData, fileName } = await encryptFile(file, password, onProgress);
    return {
      data: encryptedData,
      fileName,
      successMessage: "File has been encrypted and downloaded"
    };
  } else {
    // Decrypt file
    const { decryptedData, fileName } = await decryptFile(file, password, onProgress);
    return {
      data: decryptedData,
      fileName,
      successMessage: "File has been decrypted and downloaded"
    };
  }
}

// Helper to download file
export function downloadFile(data: Blob, fileName: string) {
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
