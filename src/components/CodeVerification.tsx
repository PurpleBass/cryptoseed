import { Github, Search, ChevronDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const CodeVerification = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6 text-center">
        <div className="flex items-center gap-2 justify-center">
          <FileText className="h-5 w-5 text-secure-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Verify Our Code</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          This application is completely open source, with no backdoors or data collection.
          You can verify the code yourself to ensure your data remains private and secure.
        </p>
      </div>
      
      <Alert className="mb-6 bg-secure-100 text-secure-800 border-secure-300">
        <Search className="h-4 w-4" />
        <AlertDescription className="text-xs sm:text-sm">
          We encourage you to review the encryption implementation to verify its security.
          The core encryption logic is in <code className="text-xs bg-secure-200 px-1 rounded">src/lib/encryptionV3.ts</code>
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        {/* Encryption Logic Dropdown */}
        <Collapsible className="border rounded-lg overflow-hidden">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 text-left">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-secure-600" />
              <span className="text-sm font-medium">Core Encryption Implementation</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 border-t">
              <div className="text-xs sm:text-sm text-muted-foreground mb-3 text-left">
                This is the actual implementation of our ChaCha20-Poly1305 encryption using Argon2id key derivation and secure memory handling. The output format includes a version header, salt, nonce, AAD (additional authenticated data), and ciphertext. All encryption and decryption is performed client-side, and sensitive key material is wiped from memory after use.
              </div>
              <div className="p-4 bg-muted rounded-md overflow-auto max-h-[600px]">
                <pre className="text-xs md:text-sm whitespace-pre text-left ml-0 text-gray-700">
{`/**
 * ChaCha20-Poly1305 encryption with Argon2id key derivation and secure memory wiping
 *
 * - Argon2id (memory-hard, 64MB memory, 3 iterations) derives a 256-bit key from password and random salt
 * - ChaCha20-Poly1305 encrypts data with a random nonce and AAD (timestamp + version)
 * - Output: [version|salt|nonce|aad|ciphertext]
 * - All operations are client-side; no data is sent to any server
 */

export async function encryptMessage(message: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const version = 3;
  const salt = randomBytes(SALT_SIZE);
  const nonce = randomBytes(NONCE_SIZE);
  
  // Derive key using Argon2id
  const key = argon2id(password, salt, {
    m: ARGON2ID_MEMORY,
    t: ARGON2ID_ITERATIONS, 
    p: ARGON2ID_PARALLELISM,
    dkLen: KEY_SIZE
  });
  
  // Additional authenticated data (timestamp + version)
  const timestamp = Date.now();
  const aad = new Uint8Array(12);
  const aadView = new DataView(aad.buffer);
  aadView.setUint32(0, version, false);
  aadView.setBigUint64(4, BigInt(timestamp), false);
  
  // Initialize ChaCha20-Poly1305 cipher
  const cipher = chacha20poly1305(key, nonce, aad);
  const ciphertext = cipher.encrypt(data);
  
  // Combine: version|salt|nonce|aad|ciphertext
  const output = new Uint8Array(4 + salt.length + nonce.length + aad.length + ciphertext.length);
  let offset = 0;
  new DataView(output.buffer).setUint32(offset, version, false); offset += 4;
  output.set(salt, offset); offset += salt.length;
  output.set(nonce, offset); offset += nonce.length;
  output.set(aad, offset); offset += aad.length;
  output.set(ciphertext, offset);
  
  // Secure memory cleanup
  wipeBytes(key);
  
  return uint8ToBase64(output);
}

export async function decryptMessage(encryptedMessage: string, password: string): Promise<string> {
  const encryptedData = base64ToUint8(encryptedMessage);
  let offset = 0;
  const version = new DataView(encryptedData.buffer).getUint32(offset, false); offset += 4;
  const salt = encryptedData.slice(offset, offset + SALT_SIZE); offset += SALT_SIZE;
  const nonce = encryptedData.slice(offset, offset + NONCE_SIZE); offset += NONCE_SIZE;
  const aad = encryptedData.slice(offset, offset + 12); offset += 12;
  const ciphertext = encryptedData.slice(offset);
  
  // Derive key using Argon2id
  const key = argon2id(password, salt, {
    m: ARGON2ID_MEMORY,
    t: ARGON2ID_ITERATIONS,
    p: ARGON2ID_PARALLELISM,
    dkLen: KEY_SIZE
  });
  
  // Initialize ChaCha20-Poly1305 cipher for decryption
  const cipher = chacha20poly1305(key, nonce, aad);
  const decrypted = cipher.decrypt(ciphertext);
  
  wipeBytes(key);
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}`}
                </pre>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Web App Architecture Dropdown */}
        <Collapsible className="border rounded-lg overflow-hidden">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 text-left">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-secure-600" />
              <span className="text-sm font-medium">Web Application Architecture</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 border-t">
              <div className="text-xs sm:text-sm text-muted-foreground mb-3 text-left">
                Our app is a client-side only application. No server communication happens at any point.
              </div>
              <div className="p-4 bg-muted rounded-md overflow-auto max-h-[600px]">
                <div className="space-y-6 text-left text-xs sm:text-sm text-gray-700">
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-left">Key Components:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Web Crypto API:</strong> We use the browser's built-in cryptography 
                        implementation, which provides hardware-accelerated encryption operations.
                      </li>
                      <li>
                        <strong>ChaCha20-Poly1305:</strong> We use ChaCha20-Poly1305 authenticated encryption
                        which provides both confidentiality and integrity in a single operation,
                        and is considered more resistant to timing attacks than traditional encryption.
                      </li>
                      <li>
                        <strong>Argon2id:</strong> Passwords are strengthened using Argon2id with 64MB memory, 
                        3 iterations, and 4-way parallelism - a memory-hard function that makes 
                        brute force attacks computationally impractical.
                      </li>
                      <li>
                        <strong>Versioned Format:</strong> Our encryption format includes a version 
                        header to maintain backward compatibility with future security improvements.
                      </li>
                      <li>
                        <strong>Secure Memory Handling:</strong> After encryption/decryption operations, 
                        sensitive data is securely wiped from memory to prevent data leakage.
                      </li>
                      <li>
                        <strong>Client-Side Only:</strong> All processing happens in your browser. No 
                        data is ever sent to any server.
                      </li>
                      <li>
                        <strong>Offline Capable:</strong> The app works completely offline after 
                        initial load, ensuring your sensitive data never leaves your device.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-left">Key Files:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <code className="bg-gray-100 px-1 rounded text-xs">src/lib/encryptionV3.ts</code> - Core encryption/decryption logic
                      </li>
                      <li>
                        <code className="bg-gray-100 px-1 rounded text-xs">src/lib/secureWipe.ts</code> - Memory protection utilities
                      </li>
                      <li>
                        <code className="bg-gray-100 px-1 rounded text-xs">src/components/EncryptionComponent.tsx</code> - User interface for 
                        encryption/decryption
                      </li>
                      <li>
                        <code className="bg-gray-100 px-1 rounded text-xs">src/pages/Index.tsx</code> - Main application page
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* How to Verify Dropdown */}
        <Collapsible className="border rounded-lg overflow-hidden">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 text-left">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-secure-600" />
              <span className="text-sm font-medium">How to Verify Our Code</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 border-t">
              <div className="text-xs sm:text-sm text-muted-foreground mb-3 text-left">
                There are several ways you can verify that our code is secure and contains no backdoors.
              </div>
              <div className="space-y-6 text-xs sm:text-sm text-gray-700 text-left">
                <div>
                  <h3 className="text-sm font-medium mb-2">View Source in Browser</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    This web application is built with Vite and React. You can view the compiled source
                    code directly in your browser by using the browser's developer tools:
                  </p>
                  <ol className="list-decimal pl-6 space-y-1 text-xs sm:text-sm">
                    <li>Right-click on this page and select "View Page Source" or press Ctrl+U</li>
                    <li>Look at the JavaScript files being loaded</li>
                    <li>Use developer tools (F12) to examine network requests (there should be none after initial load)</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Check Network Activity</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    To verify that no data is being sent to any server:
                  </p>
                  <ol className="list-decimal pl-6 space-y-1 text-xs sm:text-sm">
                    <li>Open your browser's developer tools (F12)</li>
                    <li>Go to the "Network" tab</li>
                    <li>Perform an encryption or decryption operation</li>
                    <li>Verify that no network requests are made during this process</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Clone the GitHub Repository</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    For a thorough code review, you can clone our GitHub repository and examine the code directly:
                  </p>
                  <div className="mt-4 flex justify-start">
                    <Button 
                      className="flex items-center gap-2 text-xs"
                      variant="outline"
                      asChild
                    >
                      <a href="https://github.com/PurpleBass/cryptoseed" target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        <span>View on GitHub</span>
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Offline Usage</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    For maximum security, disconnect from the internet after loading this page:
                  </p>
                  <ol className="list-decimal pl-6 space-y-1 text-xs sm:text-sm">
                    <li>Once the page is loaded, disconnect your device from WiFi/Ethernet</li>
                    <li>The application will continue to function normally</li>
                    <li>This ensures no data can possibly leave your device</li>
                    <li>When offline, you'll see a dismissable alert indicating offline mode</li>
                  </ol>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default CodeVerification;
