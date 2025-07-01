import { encryptMessage, encryptFile, decryptFile } from "@/lib/encryption";
import { 
  encryptMessageV2, 
  decryptDataUniversal,
  getEncryptionInfo,
  ENCRYPTION_VERSION_V2,
  ENCRYPTION_VERSION_LEGACY
} from "@/lib/encryptionV2";

// Encryption version type
export type EncryptionVersion = 'v1' | 'v2';

// Default encryption version (can be changed based on user preference)
let defaultEncryptionVersion: EncryptionVersion = 'v2'; // Use enhanced encryption by default

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
  onProgress?: (progress: number) => void,
  encryptionVersion?: EncryptionVersion
) {
  if (!seedPhrase.trim() || !password.trim()) {
    throw new Error("Please provide both a seed phrase and a password");
  }

  const version = encryptionVersion || defaultEncryptionVersion;
  
  if (isEncrypting) {
    // Compress then encrypt seed phrase
    onProgress?.(10);
    const compressed = await compressString(seedPhrase);
    onProgress?.(30);
    const compressedBase64 = uint8ArrayToBase64(compressed);
    onProgress?.(50);
    
    let encrypted: string;
    let algorithmInfo: string;
    
    if (version === 'v2') {
      encrypted = await encryptMessageV2(compressedBase64, password, (p) => onProgress?.(50 + p * 0.5));
      algorithmInfo = "ChaCha20-Poly1305 + scrypt";
    } else {
      encrypted = await encryptMessage(compressedBase64, password, (p) => onProgress?.(50 + p * 0.5));
      algorithmInfo = "AES-256-GCM + PBKDF2";
    }
    
    return {
      result: encrypted,
      successMessage: `Your seed phrase has been compressed and encrypted using ${algorithmInfo}`,
      encryptionInfo: getEncryptionInfo(version === 'v2' ? ENCRYPTION_VERSION_V2 : ENCRYPTION_VERSION_LEGACY)
    };
  } else {
    // Auto-detect encryption version and decrypt accordingly
    onProgress?.(10);
    
    // Try universal decryption first (supports both v1 and v2 automatically)
    const encryptedData = base64ToUint8Array(seedPhrase);
    const universalResult = await decryptDataUniversal(encryptedData, password);
    
    onProgress?.(60);
    // Convert decrypted base64 back to compressed Uint8Array
    const decryptedText = new TextDecoder().decode(universalResult.decryptedData);
    const compressedData = base64ToUint8Array(decryptedText);
    onProgress?.(80);
    const decrypted = await decompressToString(compressedData);
    onProgress?.(100);
    
    const algorithmInfo = universalResult.algorithm === 'chacha20poly1305' 
      ? "ChaCha20-Poly1305 + scrypt" 
      : "AES-256-GCM + PBKDF2";
    
    return {
      result: decrypted.trim(),
      successMessage: `Your seed phrase has been decrypted using ${algorithmInfo} and decompressed`,
      encryptionInfo: getEncryptionInfo(universalResult.version || ENCRYPTION_VERSION_LEGACY)
    };
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
  onProgress?: (progress: number) => void,
  encryptionVersion?: EncryptionVersion
) {
  if (!text.trim() || !password.trim()) {
    throw new Error("Please provide both text and a password");
  }

  const version = encryptionVersion || defaultEncryptionVersion;
  
  if (isEncrypting) {
    // Compress then encrypt text
    onProgress?.(10);
    const compressed = await compressString(text);
    onProgress?.(30);
    const compressedBase64 = uint8ArrayToBase64(compressed);
    onProgress?.(50);
    
    let encrypted: string;
    let algorithmInfo: string;
    
    if (version === 'v2') {
      encrypted = await encryptMessageV2(compressedBase64, password, (p) => onProgress?.(50 + p * 0.5));
      algorithmInfo = "ChaCha20-Poly1305 + scrypt";
    } else {
      encrypted = await encryptMessage(compressedBase64, password, (p) => onProgress?.(50 + p * 0.5));
      algorithmInfo = "AES-256-GCM + PBKDF2";
    }
    
    return {
      result: encrypted,
      successMessage: `Your text has been compressed and encrypted using ${algorithmInfo}`,
      encryptionInfo: getEncryptionInfo(version === 'v2' ? ENCRYPTION_VERSION_V2 : ENCRYPTION_VERSION_LEGACY)
    };
  } else {
    // Auto-detect encryption version and decrypt accordingly
    onProgress?.(10);
    
    // Try universal decryption first (supports both v1 and v2 automatically)
    const encryptedData = base64ToUint8Array(text);
    const universalResult = await decryptDataUniversal(encryptedData, password);
    
    onProgress?.(60);
    // Convert decrypted base64 back to compressed Uint8Array
    const decryptedText = new TextDecoder().decode(universalResult.decryptedData);
    const compressedData = base64ToUint8Array(decryptedText);
    onProgress?.(80);
    const decrypted = await decompressToString(compressedData);
    onProgress?.(100);
    
    const algorithmInfo = universalResult.algorithm === 'chacha20poly1305' 
      ? "ChaCha20-Poly1305 + scrypt" 
      : "AES-256-GCM + PBKDF2";
    
    return {
      result: decrypted.trim(),
      successMessage: `Your text has been decrypted using ${algorithmInfo} and decompressed`,
      encryptionInfo: getEncryptionInfo(universalResult.version || ENCRYPTION_VERSION_LEGACY)
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
