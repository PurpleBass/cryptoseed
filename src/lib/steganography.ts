
/**
 * Steganography techniques for image-based data hiding
 * Implements multiple algorithms for maximum security:
 * 1. Least Significant Bit (LSB)
 * 2. Sequential Color Cycle (SCC)
 * 3. Uniform Distribution (UD)
 */

import { encryptMessage, decryptMessage } from './encryption';

// Convert string to binary
export const textToBinary = (text: string): string => {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
};

// Convert binary to string
export const binaryToText = (binary: string): string => {
  let result = "";
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    if (byte.length === 8) {
      result += String.fromCharCode(parseInt(byte, 2));
    }
  }
  return result;
};

// Convert file to ArrayBuffer
export const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Convert ArrayBuffer to base64
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Convert base64 to ArrayBuffer
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Detect if input is likely base64 encoded file content
export const isBase64File = (input: string): boolean => {
  // Check if it's base64 encoded
  if (!input.match(/^[A-Za-z0-9+/=]+$/)) return false;
  
  // Check if it starts with common file signatures in base64
  // This is a simplistic check that could be expanded
  return input.startsWith('data:') && input.includes(';base64,');
};

// Get file type from base64
export const getFileTypeFromBase64 = (base64: string): string => {
  const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,/);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return 'application/octet-stream'; // Default type
};

// Add a header to identify file type in the steganographic data
export const addFileHeader = (data: string, isFile: boolean, fileType?: string): string => {
  if (isFile && fileType) {
    return `FILE:${fileType}:${data}`;
  }
  return `TEXT::${data}`;
};

// Parse a header to extract file type
export const parseHeader = (data: string): { type: 'text' | 'file', fileType: string, content: string } => {
  const parts = data.split(':', 3);
  if (parts[0] === 'FILE' && parts.length >= 3) {
    return {
      type: 'file',
      fileType: parts[1],
      content: data.substring(parts[0].length + parts[1].length + 2) // +2 for the two colons
    };
  }
  return {
    type: 'text',
    fileType: '',
    content: data.substring(6) // 'TEXT::' length
  };
};

// =============== STEGANOGRAPHY TECHNIQUES ===============

// 1. Least Significant Bit (LSB) Technique
export const hideLSB = (
  imageData: Uint8ClampedArray,
  binaryMessage: string
): Uint8ClampedArray => {
  // Create a copy of the image data
  const newImageData = new Uint8ClampedArray(imageData);

  // Add delimiter to know when the message ends
  const binaryMessageWithDelimiter = binaryMessage + "00000000";

  // Check if message can fit in the image (each pixel has 3 channels: R,G,B)
  const maxBits = Math.floor((newImageData.length / 4) * 3);
  if (binaryMessageWithDelimiter.length > maxBits) {
    throw new Error("Message too long for this image");
  }

  // Hide the message
  let bitIndex = 0;
  for (let i = 0; i < binaryMessageWithDelimiter.length; i++) {
    // Skip the alpha channel (every 4th byte)
    const dataIndex = Math.floor(bitIndex / 3) * 4 + (bitIndex % 3);
    
    // Replace the least significant bit
    if (binaryMessageWithDelimiter[i] === "1") {
      newImageData[dataIndex] = newImageData[dataIndex] | 1; // Set LSB to 1
    } else {
      newImageData[dataIndex] = newImageData[dataIndex] & ~1; // Set LSB to 0
    }
    
    bitIndex++;
  }

  return newImageData;
};

export const extractLSB = (imageData: Uint8ClampedArray): string => {
  let binaryMessage = "";
  let currentByte = "";
  let result = "";
  let byteCount = 0;

  // Extract bits
  for (let i = 0; i < imageData.length; i += 4) {
    for (let j = 0; j < 3; j++) { // For R, G, B channels
      const lsb = imageData[i + j] & 1; // Get the least significant bit
      currentByte += lsb;
      
      if (currentByte.length === 8) {
        // Convert binary to decimal to character
        const charCode = parseInt(currentByte, 2);
        
        // Check if we've reached the delimiter (null character)
        if (charCode === 0) {
          return result;
        }
        
        result += String.fromCharCode(charCode);
        currentByte = "";
        byteCount++;
        
        // Safety check to prevent infinite loop
        if (byteCount > 100000) {
          return result;
        }
      }
    }
  }
  
  return result;
};

// 2. Sequential Color Cycle (SCC) Technique
// Uses different color channels in a cyclic pattern for hiding data
export const hideSCC = (
  imageData: Uint8ClampedArray,
  binaryMessage: string
): Uint8ClampedArray => {
  // Create a copy of the image data
  const newImageData = new Uint8ClampedArray(imageData);

  // Add delimiter to know when the message ends
  const binaryMessageWithDelimiter = binaryMessage + "00000000";

  // Calculate maximum bits that can be hidden
  const maxBits = Math.floor(newImageData.length / 4) * 3;
  if (binaryMessageWithDelimiter.length > maxBits) {
    throw new Error("Message too long for this image");
  }

  // Hide the message using sequential color cycling
  // Pattern: R bit 1, G bit 2, B bit 3, R bit 4, etc.
  let bitIndex = 0;
  for (let i = 0; i < binaryMessageWithDelimiter.length; i++) {
    // Determine which color channel to use (0=R, 1=G, 2=B)
    const colorChannel = bitIndex % 3;
    
    // Calculate pixel index
    const pixelIndex = Math.floor(bitIndex / 3) * 4;
    
    // Replace the least significant bit in the selected color channel
    if (binaryMessageWithDelimiter[i] === "1") {
      newImageData[pixelIndex + colorChannel] = newImageData[pixelIndex + colorChannel] | 1;
    } else {
      newImageData[pixelIndex + colorChannel] = newImageData[pixelIndex + colorChannel] & ~1;
    }
    
    bitIndex++;
  }

  return newImageData;
};

export const extractSCC = (imageData: Uint8ClampedArray): string => {
  let binaryMessage = "";
  let currentByte = "";
  let result = "";
  let byteCount = 0;

  // Extract bits using the same sequential color cycling pattern
  let bitIndex = 0;
  
  while (byteCount < 100000) { // Safety limit
    // Determine which color channel to use (0=R, 1=G, 2=B)
    const colorChannel = bitIndex % 3;
    
    // Calculate pixel index
    const pixelIndex = Math.floor(bitIndex / 3) * 4;
    
    // Check if we've reached the end of the image data
    if (pixelIndex >= imageData.length) break;
    
    // Extract the least significant bit from the selected color channel
    const lsb = imageData[pixelIndex + colorChannel] & 1;
    currentByte += lsb;
    
    if (currentByte.length === 8) {
      // Convert binary to decimal to character
      const charCode = parseInt(currentByte, 2);
      
      // Check if we've reached the delimiter (null character)
      if (charCode === 0) {
        return result;
      }
      
      result += String.fromCharCode(charCode);
      currentByte = "";
      byteCount++;
    }
    
    bitIndex++;
  }
  
  return result;
};

// 3. Uniform Distribution (UD) Technique
// Distributes bits evenly throughout the image using a pseudorandom but deterministic pattern
export const hideUD = (
  imageData: Uint8ClampedArray,
  binaryMessage: string,
  seed: number
): Uint8ClampedArray => {
  // Create a copy of the image data
  const newImageData = new Uint8ClampedArray(imageData);

  // Add delimiter to know when the message ends
  const binaryMessageWithDelimiter = binaryMessage + "00000000";

  // Calculate maximum bits that can be hidden (RGB channels only)
  const pixelCount = Math.floor(newImageData.length / 4);
  const maxBits = pixelCount * 3;
  
  if (binaryMessageWithDelimiter.length > maxBits) {
    throw new Error("Message too long for this image");
  }

  // Generate a pseudorandom but deterministic sequence of indices
  // This is a simple linear congruential generator
  const indices = [];
  let state = seed;
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  
  // Generate unique indices for each bit
  for (let i = 0; i < binaryMessageWithDelimiter.length; i++) {
    // Update state with linear congruential generator
    state = (a * state + c) % m;
    
    // Convert to an index within the available RGB channels
    // Multiply by 3 because we have 3 color channels per pixel
    const pixelIndex = Math.floor((state / m) * pixelCount);
    const colorChannel = Math.floor((state / m) * 3) % 3;
    
    // Calculate the actual index in the array (skip alpha)
    const index = pixelIndex * 4 + colorChannel;
    indices.push(index);
  }

  // Hide the message using the generated indices
  for (let i = 0; i < binaryMessageWithDelimiter.length; i++) {
    const index = indices[i];
    
    // Replace the least significant bit at the selected index
    if (binaryMessageWithDelimiter[i] === "1") {
      newImageData[index] = newImageData[index] | 1;
    } else {
      newImageData[index] = newImageData[index] & ~1;
    }
  }

  return newImageData;
};

export const extractUD = (imageData: Uint8ClampedArray, seed: number): string => {
  let binaryMessage = "";
  let currentByte = "";
  let result = "";
  let byteCount = 0;

  // Regenerate the same pseudorandom sequence using the same seed
  const pixelCount = Math.floor(imageData.length / 4);
  let state = seed;
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  
  while (byteCount < 100000) { // Safety limit
    // Update state with linear congruential generator
    state = (a * state + c) % m;
    
    // Convert to an index within the available RGB channels
    const pixelIndex = Math.floor((state / m) * pixelCount);
    const colorChannel = Math.floor((state / m) * 3) % 3;
    
    // Calculate the actual index in the array (skip alpha)
    const index = pixelIndex * 4 + colorChannel;
    
    // Check if we've gone beyond the image data
    if (index >= imageData.length) break;
    
    // Extract the least significant bit
    const lsb = imageData[index] & 1;
    currentByte += lsb;
    
    if (currentByte.length === 8) {
      // Convert binary to decimal to character
      const charCode = parseInt(currentByte, 2);
      
      // Check if we've reached the delimiter (null character)
      if (charCode === 0) {
        return result;
      }
      
      result += String.fromCharCode(charCode);
      currentByte = "";
      byteCount++;
    }
  }
  
  return result;
};

// Combine all three techniques for maximum security
export const hideMessageWithAllTechniques = async (
  imageData: Uint8ClampedArray,
  message: string,
  password: string,
  seed: number
): Promise<Uint8ClampedArray> => {
  try {
    // First encrypt the message with AES-256
    const encryptedMessage = await encryptMessage(message, password);
    
    // Convert encrypted message to binary
    let binaryMessage = textToBinary(encryptedMessage);
    
    // Apply LSB technique first
    let resultData = hideLSB(imageData, binaryMessage);
    
    // Apply SCC technique over the LSB result
    resultData = hideSCC(resultData, binaryMessage);
    
    // Finally apply UD technique over the combined result
    resultData = hideUD(resultData, binaryMessage, seed);
    
    return resultData;
  } catch (error) {
    console.error("Error in hiding message:", error);
    throw error;
  }
};

export const extractMessageWithAllTechniques = async (
  imageData: Uint8ClampedArray,
  technique: "lsb" | "scc" | "ud" | "all",
  password: string,
  seed: number
): Promise<string> => {
  try {
    let extractedBinary = "";
    
    // Extract using the specified technique
    switch (technique) {
      case "lsb":
        extractedBinary = extractLSB(imageData);
        break;
      case "scc":
        extractedBinary = extractSCC(imageData);
        break;
      case "ud":
        extractedBinary = extractUD(imageData, seed);
        break;
      case "all":
        // Try all techniques and use the one that succeeds
        // In a real-world scenario, we'd need to include metadata about which technique was used
        try {
          extractedBinary = extractLSB(imageData);
          // If the decryption works, we've found the right technique
          await decryptMessage(extractedBinary, password);
        } catch (error1) {
          try {
            extractedBinary = extractSCC(imageData);
            await decryptMessage(extractedBinary, password);
          } catch (error2) {
            try {
              extractedBinary = extractUD(imageData, seed);
              await decryptMessage(extractedBinary, password);
            } catch (error3) {
              throw new Error("Could not extract message with any technique");
            }
          }
        }
        break;
    }
    
    // Decrypt the extracted message
    return await decryptMessage(extractedBinary, password);
  } catch (error) {
    console.error("Error in extracting message:", error);
    throw error;
  }
};

// Convert file data to a format that can be hidden in an image
export const prepareFileForSteganography = async (
  file: File,
  password: string
): Promise<string> => {
  // Read file as array buffer
  const arrayBuffer = await fileToArrayBuffer(file);
  
  // Convert to base64
  const base64 = arrayBufferToBase64(arrayBuffer);
  
  // Add file metadata header
  const dataWithHeader = addFileHeader(base64, true, file.type);
  
  // Encrypt the data with password
  return await encryptMessage(dataWithHeader, password);
};

// Convert steganography-extracted data back to a file
export const extractFileFromSteganography = async (
  extractedData: string,
  password: string
): Promise<{ data: Blob, fileType: string, isFile: boolean }> => {
  try {
    // Decrypt the data
    const decryptedData = await decryptMessage(extractedData, password);
    
    // Parse the header
    const { type, fileType, content } = parseHeader(decryptedData);
    
    if (type === 'file') {
      // Convert base64 back to blob
      const byteCharacters = atob(content);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      const blob = new Blob(byteArrays, { type: fileType });
      return { data: blob, fileType, isFile: true };
    } else {
      // It's just text
      return { 
        data: new Blob([content], { type: 'text/plain' }), 
        fileType: 'text/plain', 
        isFile: false 
      };
    }
  } catch (error) {
    console.error("Error extracting file:", error);
    throw error;
  }
};
