import { encryptMessage, decryptMessage, encryptFile, decryptFile, getEncryptionInfo } from "@/lib/encryptionV3";

// Encryption version type - V3 only for maximum security
export type EncryptionVersion = 'v3';

// Default encryption version (V3 - Argon2id)
let defaultEncryptionVersion: EncryptionVersion = 'v3';

// Function to set the default encryption version
export function setDefaultEncryptionVersion(version: EncryptionVersion) {
  defaultEncryptionVersion = version;
}

// Function to get the current default encryption version
export function getDefaultEncryptionVersion(): EncryptionVersion {
  return defaultEncryptionVersion;
}

// Compression utilities using browser's built-in compression
async function compressString(text: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Check if CompressionStream is available (modern browsers)
  if (typeof CompressionStream === 'undefined') {
    // Fallback: return original data if compression is not available
    console.warn('CompressionStream not available, skipping compression');
    return data;
  }
  
  try {
    const stream = new CompressionStream('gzip');
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    
    const chunks: Uint8Array[] = [];
    
    // Start reading the compressed data
    const readPromise = (async () => {
      let result;
      while (!(result = await reader.read()).done) {
        chunks.push(result.value);
      }
    })();
    
    // Write the input data
    await writer.write(data);
    await writer.close();
    
    // Wait for compression to complete
    await readPromise;
    
    // Combine all chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const compressed = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      compressed.set(chunk, offset);
      offset += chunk.length;
    }
    
    return compressed;
  } catch (error) {
    console.warn('Compression failed, using original data:', error);
    return data;
  }
}

async function decompressToString(compressedData: Uint8Array): Promise<string> {
  // Check if DecompressionStream is available (modern browsers)
  if (typeof DecompressionStream === 'undefined') {
    // Fallback: assume data is not compressed
    const decoder = new TextDecoder();
    return decoder.decode(compressedData);
  }
  
  try {
    const stream = new DecompressionStream('gzip');
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    
    const chunks: Uint8Array[] = [];
    
    // Start reading the decompressed data
    const readPromise = (async () => {
      let result;
      while (!(result = await reader.read()).done) {
        chunks.push(result.value);
      }
    })();
    
    // Write the compressed data
    await writer.write(compressedData);
    await writer.close();
    
    // Wait for decompression to complete
    await readPromise;
    
    // Combine all chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const decompressed = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      decompressed.set(chunk, offset);
      offset += chunk.length;
    }
    
    const decoder = new TextDecoder();
    return decoder.decode(decompressed);
  } catch (error) {
    // If decompression fails, try to decode as uncompressed text
    console.warn('Decompression failed, trying as uncompressed data:', error);
    const decoder = new TextDecoder();
    return decoder.decode(compressedData);
  }
}

// Convert Uint8Array to base64 for encryption
function uint8ArrayToBase64(array: Uint8Array): string {
  const binaryString = String.fromCharCode(...Array.from(array));
  return btoa(binaryString);
}

// Convert base64 to Uint8Array for decryption
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  return new Uint8Array(binaryString.split('').map(char => char.charCodeAt(0)));
}

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
    // Compress then encrypt seed phrase
    onProgress?.(10);
    const compressed = await compressString(seedPhrase);
    onProgress?.(30);
    const compressedBase64 = uint8ArrayToBase64(compressed);
    onProgress?.(50);
    
    // Use V3 encryption (Argon2id + ChaCha20-Poly1305)
    const encrypted = await encryptMessage(compressedBase64, password, (p: number) => onProgress?.(50 + p * 0.5));
    const algorithmInfo = "ChaCha20-Poly1305 + Argon2id";
    
    return {
      result: encrypted,
      successMessage: `Your seed phrase has been compressed and encrypted using ${algorithmInfo}`,
      encryptionInfo: getEncryptionInfo()
    };
  } else {
    // Decrypt seed phrase
    onProgress?.(10);
    
    try {
      // Direct V3 decryption
      const decryptedText = await decryptMessage(seedPhrase, password);
      onProgress?.(60);
      
      // Convert decrypted base64 back to compressed Uint8Array
      const compressedData = base64ToUint8Array(decryptedText);
      onProgress?.(80);
      const decrypted = await decompressToString(compressedData);
      onProgress?.(100);
      
      const algorithmInfo = "ChaCha20-Poly1305 + Argon2id";
      
      return {
        result: decrypted.trim(),
        successMessage: `Your seed phrase has been decrypted using ${algorithmInfo} and decompressed`,
        encryptionInfo: getEncryptionInfo()
      };
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Invalid password or unsupported format'}. This app only supports V3 (Argon2id) encryption.`);
    }
  }
}

// Format seed phrase with numbers
export function formatSeedPhraseWithNumbers(seedPhrase: string): string {
  if (!seedPhrase) return '';
  const words = seedPhrase.trim().split(/\s+/).filter(word => word.trim() !== '');
  // Return each word on a new line, numbered
  return words.map((word, index) => `${index + 1}. ${word}`).join('\n');
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
    // Compress then encrypt text
    onProgress?.(10);
    const compressed = await compressString(text);
    onProgress?.(30);
    const compressedBase64 = uint8ArrayToBase64(compressed);
    onProgress?.(50);
    
    // Use V3 encryption (Argon2id + ChaCha20-Poly1305)
    const encrypted = await encryptMessage(compressedBase64, password, (p: number) => onProgress?.(50 + p * 0.5));
    const algorithmInfo = "ChaCha20-Poly1305 + Argon2id";
    
    return {
      result: encrypted,
      successMessage: `Your text has been compressed and encrypted using ${algorithmInfo}`,
      encryptionInfo: getEncryptionInfo()
    };
  } else {
    // Decrypt text
    onProgress?.(10);
    
    try {
      // Direct V3 decryption
      const decryptedText = await decryptMessage(text, password);
      onProgress?.(60);
      
      // Convert decrypted base64 back to compressed Uint8Array
      const compressedData = base64ToUint8Array(decryptedText);
      onProgress?.(80);
      const decrypted = await decompressToString(compressedData);
      onProgress?.(100);
      
      const algorithmInfo = "ChaCha20-Poly1305 + Argon2id";
      
      return {
        result: decrypted.trim(),
        successMessage: `Your text has been decrypted using ${algorithmInfo} and decompressed`,
        encryptionInfo: getEncryptionInfo()
      };
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Invalid password or unsupported format'}. This app only supports V3 (Argon2id) encryption.`);
    }
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

// Helper to download encrypted content as .cryptoseed file
export function downloadCryptoSeedFile(encryptedContent: string, filename?: string) {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const defaultFilename = `encrypted-${timestamp}.cryptoseed`;
  const finalFilename = filename || defaultFilename;
  
  // Create a structured format for the .cryptoseed file
  const cryptoSeedData = {
    version: "1.0",
    encrypted: true,
    timestamp: new Date().toISOString(),
    content: encryptedContent,
    app: "CryptoSeed"
  };
  
  const jsonContent = JSON.stringify(cryptoSeedData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  downloadFile(blob, finalFilename);
}

// Helper to read and validate .cryptoseed file content
export function readCryptoSeedFile(fileContent: string): { isValid: boolean; content?: string; error?: string } {
  try {
    const data = JSON.parse(fileContent);
    
    // Validate the structure
    if (!data.version || !data.content || !data.encrypted) {
      return { isValid: false, error: "Invalid .cryptoseed file format" };
    }
    
    if (!data.app || data.app !== "CryptoSeed") {
      return { isValid: false, error: "This file was not created by CryptoSeed" };
    }
    
    return { isValid: true, content: data.content };
  } catch (error) {
    return { isValid: false, error: "Failed to parse .cryptoseed file" };
  }
}
