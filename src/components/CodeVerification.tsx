import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Github, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CodeVerification = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-2">
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
          The core encryption logic is in <code className="text-xs bg-secure-200 px-1 rounded">src/lib/encryption.ts</code>
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="encryption">
        <TabsList className="mb-4">
          <TabsTrigger value="encryption">Encryption Logic</TabsTrigger>
          <TabsTrigger value="webapp">Web App</TabsTrigger>
          <TabsTrigger value="verify">How to Verify</TabsTrigger>
        </TabsList>
        
        <TabsContent value="encryption">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Core Encryption Implementation</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                This is the exact implementation of our AES-256 encryption using the Web Crypto API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-md overflow-auto max-h-[600px]">
                <pre className="text-xs md:text-sm whitespace-pre text-left ml-0 text-gray-700">
                  /**
                   * AES-256 encryption functions for the Secure Nomad Encryptor
                   * 
                   * This module uses the Web Crypto API (SubtleCrypto) to perform
                   * secure client-side encryption and decryption. No data is sent
                   * to any server at any point.
                   */

                  // Generate a cryptographically secure key from a password
                  async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
                    // Convert password to ArrayBuffer
                    const passwordBuffer = str2ab(password);
                    
                    // Import the password as a key
                    const baseKey = await window.crypto.subtle.importKey(
                      "raw",
                      passwordBuffer,
                      { name: "PBKDF2" },
                      false,
                      ["deriveKey"]
                    );
                    
                    // Derive a key using PBKDF2
                    return window.crypto.subtle.deriveKey(
                      {
                        name: "PBKDF2",
                        salt: salt,
                        iterations: 100000,
                        hash: "SHA-256"
                      },
                      baseKey,
                      { name: "AES-GCM", length: 256 },
                      false,
                      ["encrypt", "decrypt"]
                    );
                  }

                  // Encrypt a message using AES-GCM
                  export async function encryptMessage(message: string, password: string): Promise<string> {
                    try {
                      // Generate a random salt
                      const salt = window.crypto.getRandomValues(new Uint8Array(16));
                      
                      // Generate a random IV (Initialization Vector)
                      const iv = window.crypto.getRandomValues(new Uint8Array(12));
                      
                      // Derive encryption key from password
                      const key = await deriveKey(password, salt);
                      
                      // Encrypt the message
                      const messageBuffer = str2ab(message);
                      const encryptedBuffer = await window.crypto.subtle.encrypt(
                        {
                          name: "AES-GCM",
                          iv: iv
                        },
                        key,
                        messageBuffer
                      );
                      
                      // Combine salt + iv + encrypted data into a single buffer
                      const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
                      resultBuffer.set(salt, 0);
                      resultBuffer.set(iv, salt.length);
                      resultBuffer.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);
                      
                      // Convert to Base64 for easy storage/transmission
                      return arrayBufferToBase64(resultBuffer);
                    } catch (error) {
                      console.error("Encryption error:", error);
                      throw new Error("Failed to encrypt message");
                    }
                  }

                  // Decrypt a message using AES-GCM
                  export async function decryptMessage(encryptedMessage: string, password: string): Promise<string> {
                    try {
                      // Convert the Base64 encrypted message back to ArrayBuffer
                      const encryptedBuffer = base64ToArrayBuffer(encryptedMessage);
                      
                      // Extract salt, iv, and encrypted data
                      const salt = encryptedBuffer.slice(0, 16);
                      const iv = encryptedBuffer.slice(16, 28);
                      const data = encryptedBuffer.slice(28);
                      
                      // Derive the key from the password and salt
                      const key = await deriveKey(password, new Uint8Array(salt));
                      
                      // Decrypt the message
                      const decryptedBuffer = await window.crypto.subtle.decrypt(
                        {
                          name: "AES-GCM",
                          iv: new Uint8Array(iv)
                        },
                        key,
                        data
                      );
                      
                      // Convert back to string and return
                      return ab2str(decryptedBuffer);
                    } catch (error) {
                      console.error("Decryption error:", error);
                      throw new Error("Failed to decrypt message");
                    }
                  }
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webapp">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Web Application Architecture</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Our app is a client-side only application. No server communication happens at any point.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-md overflow-auto max-h-[600px]">
                <div className="space-y-6 text-sm text-gray-700">
                  <div>
                    <h3 className="text-base font-medium mb-2">Key Components:</h3>
                    <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
                      <li>
                        <strong>Web Crypto API:</strong> We use the browser's built-in cryptography 
                        implementation, which provides hardware-accelerated encryption operations.
                      </li>
                      <li>
                        <strong>AES-256-GCM:</strong> We use AES in Galois/Counter Mode with a 256-bit 
                        key for encryption, which is currently considered unbreakable with proper 
                        implementation.
                      </li>
                      <li>
                        <strong>PBKDF2:</strong> Passwords are strengthened using PBKDF2 with 100,000 
                        iterations of SHA-256 hashing, making brute force attacks impractical.
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
                    <h3 className="text-base font-medium mb-2">Key Files:</h3>
                    <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
                      <li>
                        <code className="bg-gray-100 px-1 rounded text-xs">src/lib/encryption.ts</code> - Core encryption/decryption logic
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verify">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">How to Verify Our Code</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                There are several ways you can verify that our code is secure and contains no backdoors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-sm text-gray-700">
                <div>
                  <h3 className="text-base font-medium mb-2">View Source in Browser</h3>
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
                  <h3 className="text-base font-medium mb-2">Check Network Activity</h3>
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
                  <h3 className="text-base font-medium mb-2">Clone the GitHub Repository</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    For a thorough code review, you can clone our GitHub repository and examine the code directly:
                  </p>
                  <div className="mt-4 flex justify-center">
                    <Button 
                      className="flex items-center gap-2 text-xs sm:text-sm"
                      variant="outline"
                      asChild
                    >
                      <a href="https://github.com/yourusername/secure-nomad-encryptor" target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        <span>View on GitHub</span>
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-2">Offline Usage</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    For maximum security, disconnect from the internet after loading this page:
                  </p>
                  <ol className="list-decimal pl-6 space-y-1 text-xs sm:text-sm">
                    <li>Once the page is loaded, disconnect your device from WiFi/Ethernet</li>
                    <li>The application will continue to function normally</li>
                    <li>This ensures no data can possibly leave your device</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeVerification;
