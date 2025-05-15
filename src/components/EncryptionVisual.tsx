
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Key, Database, Download, FileCheck, Fingerprint } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * EncryptionVisual Component
 * 
 * Provides visual representations of how the encryption process works.
 * Includes interactive tabs for different encryption aspects:
 * - Basic encryption flow
 * - Key derivation (PBKDF2) process
 * - Memory protection techniques
 * 
 * @returns {JSX.Element} Interactive visual diagram of encryption processes
 */
const EncryptionVisual = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      <h3 className="text-lg font-medium text-center mb-4">How Our Encryption Works</h3>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basic">Basic Encryption</TabsTrigger>
          <TabsTrigger value="keys">Key Derivation</TabsTrigger>
          <TabsTrigger value="memory">Memory Protection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-secure-50 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-2">
                  {/* Step 1: Password & Data Entry */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                      <Key className="h-6 w-6 text-secure-600" />
                    </div>
                    <span className="text-xs font-medium">Your Password & Data</span>
                  </div>
                  
                  {/* Arrow */}
                  <div className="hidden sm:block text-secure-400">→</div>
                  <div className="block sm:hidden text-secure-400">↓</div>
                  
                  {/* Step 2: Key Derivation */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 relative">
                      <div className="absolute inset-0 rounded-full border-2 border-secure-400 animate-pulse"></div>
                      <div className="text-xs font-bold">PBKDF2</div>
                    </div>
                    <span className="text-xs font-medium">600,000 Iterations</span>
                  </div>
                  
                  {/* Arrow */}
                  <div className="hidden sm:block text-secure-400">→</div>
                  <div className="block sm:hidden text-secure-400">↓</div>
                  
                  {/* Step 3: Encryption */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                      <Lock className="h-6 w-6 text-secure-600" />
                    </div>
                    <span className="text-xs font-medium">AES-256 Encryption</span>
                  </div>
                  
                  {/* Arrow */}
                  <div className="hidden sm:block text-secure-400">→</div>
                  <div className="block sm:hidden text-secure-400">↓</div>
                  
                  {/* Step 4: Secure Output */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                      <Shield className="h-6 w-6 text-secure-600" />
                    </div>
                    <span className="text-xs font-medium">Encrypted Data</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="p-4">
                <h4 className="text-sm font-medium mb-2">What happens behind the scenes?</h4>
                <ol className="text-xs space-y-2 text-muted-foreground">
                  <li>
                    <strong>Password Strengthening:</strong> Your password is processed through 600,000 rounds of 
                    PBKDF2-SHA256 to create a strong encryption key that's resistant to brute force attacks.
                  </li>
                  <li>
                    <strong>Secure Encryption:</strong> Your data is encrypted using AES-256 in Galois/Counter Mode (GCM), 
                    providing both confidentiality and authenticity verification.
                  </li>
                  <li>
                    <strong>Versioned Format:</strong> The encrypted output includes a version byte, random salt, and 
                    initialization vector to ensure security and compatibility with future improvements.
                  </li>
                  <li>
                    <strong>Memory Protection:</strong> After encryption, sensitive data is securely wiped from memory 
                    to prevent exposure in memory dumps or debugging tools.
                  </li>
                </ol>
                <div className="mt-3 text-xs p-2 bg-muted rounded-sm text-center">
                  All encryption happens <strong>completely offline</strong> in your browser. No data is transmitted.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="keys">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-4 pb-2 border-b">
                <Fingerprint className="h-8 w-8 text-secure-600" />
                <div>
                  <h4 className="font-medium">Advanced Key Derivation</h4>
                  <p className="text-sm text-muted-foreground">Password-Based Key Derivation Function (PBKDF2)</p>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-lg bg-secure-50 p-4">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-secure-100 w-24 h-24 rounded-full opacity-20"></div>
                <div className="relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-white rounded-full p-1 shadow-sm">
                        <span className="flex items-center justify-center w-6 h-6 bg-secure-600 rounded-full text-white text-xs font-medium">1</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">Password Input</h5>
                        <p className="text-xs text-muted-foreground">Your password is converted to binary data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-white rounded-full p-1 shadow-sm">
                        <span className="flex items-center justify-center w-6 h-6 bg-secure-600 rounded-full text-white text-xs font-medium">2</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">Salt Addition</h5>
                        <p className="text-xs text-muted-foreground">A unique 16-byte random salt is generated and combined with your password</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-white rounded-full p-1 shadow-sm">
                        <span className="flex items-center justify-center w-6 h-6 bg-secure-600 rounded-full text-white text-xs font-medium">3</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">Multiple Iterations</h5>
                        <p className="text-xs text-muted-foreground">The combination is processed through <strong>600,000 rounds</strong> of SHA-256 hashing</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-white rounded-full p-1 shadow-sm">
                        <span className="flex items-center justify-center w-6 h-6 bg-secure-600 rounded-full text-white text-xs font-medium">4</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">AES-256 Key</h5>
                        <p className="text-xs text-muted-foreground">The result is a cryptographically strong 256-bit key for AES encryption</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md bg-muted p-3">
                <h5 className="font-medium text-sm mb-2">Why is this important?</h5>
                <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
                  <li>
                    <strong>Prevents Brute-Force Attacks:</strong> With 600,000 iterations, each password guess would require significant computational resources
                  </li>
                  <li>
                    <strong>Unique Encryptions:</strong> The same password + data will create different encryptions each time due to the random salt
                  </li>
                  <li>
                    <strong>Time-Memory Trade-Off:</strong> Makes your encrypted data resistant against rainbow table attacks
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="memory">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-4 pb-2 border-b">
                <Database className="h-8 w-8 text-secure-600" />
                <div>
                  <h4 className="font-medium">Secure Memory Handling</h4>
                  <p className="text-sm text-muted-foreground">How we protect sensitive data in memory</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <h5 className="text-sm font-medium mb-2">The Memory Problem</h5>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>
                      When your application processes sensitive data (passwords, keys, decrypted content), 
                      that data remains in memory where it could potentially be exposed through:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Memory dumps</li>
                      <li>Cold boot attacks</li>
                      <li>Debugging tools</li>
                      <li>Other applications with memory access</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-secure-50 rounded-lg p-3">
                  <h5 className="text-sm font-medium mb-2">Our Solution</h5>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>
                      CryptoSeed actively overwrites sensitive data in memory after use:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>TypedArrays are zero-filled</li>
                      <li>References to encryption keys are removed</li>
                      <li>Password strings are cleared</li>
                      <li>ArrayBuffers are overwritten</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 bg-secure-100 w-32 h-32 rounded-full opacity-20"></div>
                <h5 className="text-sm font-medium mb-2 relative z-10">Memory Wiping Process</h5>
                
                <div className="relative z-10 space-y-3 text-xs">
                  <div className="flex items-start gap-2">
                    <code className="bg-muted p-1 rounded text-secure-700 flex-shrink-0">wipeTypedArray()</code>
                    <p className="text-muted-foreground">
                      Overwrites TypedArrays (like Uint8Array) by filling them with zeros
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <code className="bg-muted p-1 rounded text-secure-700 flex-shrink-0">wipeArrayBuffer()</code>
                    <p className="text-muted-foreground">
                      Creates a view of the ArrayBuffer and overwrites its contents with zeros
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <code className="bg-muted p-1 rounded text-secure-700 flex-shrink-0">wipeString()</code>
                    <p className="text-muted-foreground">
                      Attempts to remove references to string data, encouraging garbage collection
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <code className="bg-muted p-1 rounded text-secure-700 flex-shrink-0">wipeEncryptionData()</code>
                    <p className="text-muted-foreground">
                      Combined function that wipes keys, data buffers, and passwords after encryption operations
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-xs p-2 bg-muted rounded-sm text-center">
                While JavaScript has limitations in memory management, we take all available precautions
                to minimize the time sensitive data remains in memory.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EncryptionVisual;
