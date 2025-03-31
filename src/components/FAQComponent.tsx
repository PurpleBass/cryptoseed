
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, HelpCircle, Shield, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const FAQComponent = () => {
  // Function to open the corresponding dialog from the footer
  const openDialog = (dialogType: string) => {
    // Simulate a click on the corresponding dialog trigger in the footer
    setTimeout(() => {
      // Find all dialog triggers in the footer
      const footerLinks = Array.from(document.querySelectorAll('footer a, footer button'));
      
      // Find the link that contains the text we're looking for
      const targetLink = footerLinks.find(link => 
        link.textContent?.trim().includes(dialogType)
      );
      
      // Click the link if found
      if (targetLink && targetLink instanceof HTMLElement) {
        targetLink.click();
      } else {
        console.error(`Could not find footer link for: ${dialogType}`);
      }
    }, 100); // Small delay to ensure DOM is ready
  };

  return (
    <div className="w-full mx-auto px-2 sm:px-4 max-w-4xl">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secure-600" />
          <h2 className="text-xl sm:text-2xl font-bold">FAQ & Best Practices</h2>
        </div>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">
          Common questions about encryption and how to use this tool securely.
        </p>
      </div>
      
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="mb-3 w-full overflow-x-auto flex sm:inline-flex whitespace-nowrap">
          <TabsTrigger value="user" className="text-xs sm:text-sm">Non-Technical FAQ</TabsTrigger>
          <TabsTrigger value="technical" className="text-xs sm:text-sm">Technical Details</TabsTrigger>
          <TabsTrigger value="practices" className="text-xs sm:text-sm">Best Practices</TabsTrigger>
          <TabsTrigger value="legal" className="text-xs sm:text-sm">Legal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="user">
          <Card className="border-0 sm:border shadow-none sm:shadow-sm">
            <CardHeader className="px-2 sm:px-6 py-3 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">Understanding Encryption</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Explanations for users without a technical background
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1 sm:px-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is-encryption">
                  <AccordionTrigger className="text-sm sm:text-base py-2">What is encryption and why do I need it?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      Encryption is like a high-security digital safe for your information. It scrambles your 
                      text or files so that only someone with the correct password can read them.
                    </p>
                    <p className="mt-2">
                      You might need encryption to:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>Securely store sensitive personal information</li>
                      <li>Share confidential information with others</li>
                      <li>Protect valuable files from unauthorized access</li>
                      <li>Keep private notes truly private</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="how-it-works">
                  <AccordionTrigger className="text-sm sm:text-base py-2">How does this app work?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      Our app uses a very strong encryption method called AES-256 (the same technology used by
                      governments and banks) to protect your data.
                    </p>
                    <p className="mt-1 sm:mt-2">
                      Here's how it works in simple terms:
                    </p>
                    <ol className="list-decimal pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>You enter your text or select a file to encrypt</li>
                      <li>You create a password (make it strong!)</li>
                      <li>The app scrambles your data using your password as the key</li>
                      <li>The result is a jumbled mess that's meaningless without your password</li>
                      <li>Later, you can use your password to unscramble and recover your original data</li>
                    </ol>
                    <p className="mt-1 sm:mt-2">
                      All of this happens directly on your device. Your information never leaves your 
                      computer or phone, so there's no risk of interception.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="is-it-secure">
                  <AccordionTrigger className="text-sm sm:text-base py-2">How secure is this encryption?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      AES-256 encryption is extremely secure. If implemented correctly (as it is in this app):
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>It would take billions of years for all the world's computers to crack it</li>
                      <li>Even governments and intelligence agencies use it for their top-secret information</li>
                      <li>There are no known practical attacks against it</li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      The most vulnerable part is your password. If someone can guess your password, they 
                      can decrypt your data. That's why using a strong, unique password is essential.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="what-if-lose-password">
                  <AccordionTrigger className="text-sm sm:text-base py-2">What if I forget my password?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      Unfortunately, if you forget your password, your encrypted data is lost forever. 
                      There is no "password recovery" option. This is actually a security feature – if 
                      there was a backdoor or recovery method, others could potentially use it too.
                    </p>
                    <p className="mt-1 sm:mt-2">
                      We strongly recommend:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>Using a password manager to securely store your encryption passwords</li>
                      <li>Writing down passwords in a physically secure location (like a safe)</li>
                      <li>Creating passwords that are memorable to you but difficult for others to guess</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="offline-usage">
                  <AccordionTrigger className="text-sm sm:text-base py-2">Why should I use this offline?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      While our app never sends your data anywhere, using it offline provides an extra 
                      layer of security:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>It physically prevents any data transmission</li>
                      <li>It protects against any potential browser vulnerabilities</li>
                      <li>It eliminates the possibility of monitoring by network devices</li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      To use offline: simply load this page once, then disconnect from the internet
                      (turn off WiFi or unplug your ethernet cable). The app will continue to work perfectly.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="no-backdoors">
                  <AccordionTrigger className="text-sm sm:text-base py-2">What does "no backdoors" mean?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      A backdoor is a secret way to bypass normal security measures. Some encryption 
                      products have hidden methods that allow the developers, governments, or others 
                      to access your encrypted data without your password.
                    </p>
                    <p className="mt-1 sm:mt-2">
                      Our app has no backdoors, meaning:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>Only you can decrypt your data with your password</li>
                      <li>We cannot access your encrypted data even if legally required to</li>
                      <li>There are no master keys or recovery methods</li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      Our code is open-source so anyone can verify these claims by examining it.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technical">
          <Card className="border-0 sm:border shadow-none sm:shadow-sm">
            <CardHeader className="px-2 sm:px-6 py-3 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">Technical Implementation</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Detailed explanations of the cryptographic implementation
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1 sm:px-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="crypto-implementation">
                  <AccordionTrigger className="text-sm sm:text-base py-2">Cryptographic Implementation</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      This application uses the Web Crypto API (SubtleCrypto) to perform all cryptographic operations. Here's a detailed breakdown:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Encryption Algorithm:</strong> AES-256-GCM (Galois/Counter Mode)
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>256-bit key length (maximum security level for AES)</li>
                          <li>GCM provides both confidentiality and authenticity</li>
                          <li>Detects tampering with the encrypted data</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Key Derivation:</strong> PBKDF2 (Password-Based Key Derivation Function 2)
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>100,000 iterations of SHA-256 hashing</li>
                          <li>Unique random salt for each encryption operation</li>
                          <li>Protects against rainbow table and brute-force attacks</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Initialization Vector (IV):</strong> 
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>96-bit (12-byte) cryptographically secure random IV</li>
                          <li>Generated using crypto.getRandomValues()</li>
                          <li>Fresh IV used for each encryption operation</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Output Format:</strong> 
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Salt (16 bytes) + IV (12 bytes) + Encrypted data</li>
                          <li>Encoded as Base64 for text compatibility</li>
                        </ul>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="security-model">
                  <AccordionTrigger className="text-sm sm:text-base py-2">Security Model & Threat Considerations</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      Our security model makes the following assumptions and mitigations:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Trusted Platform:</strong> We assume your device and browser are not compromised. 
                        To mitigate device-level threats, we recommend using trusted devices with up-to-date security.
                      </li>
                      <li>
                        <strong>Memory Security:</strong> Sensitive data may remain in memory while the app is running. 
                        To mitigate, close the browser tab after use and consider a device restart for highly sensitive operations.
                      </li>
                      <li>
                        <strong>Side-Channel Attacks:</strong> Web browsers can be vulnerable to certain side-channel attacks. 
                        To mitigate, use a modern, security-focused browser and keep it updated.
                      </li>
                      <li>
                        <strong>Password Strength:</strong> A weak password is the most likely point of failure. 
                        To mitigate, use long, complex passwords and store them securely.
                      </li>
                      <li>
                        <strong>Network Adversaries:</strong> While the app functions offline, initial loading happens online. 
                        To mitigate MITM attacks, we use HTTPS and recommend verifying the application code before use.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="cryptographic-properties">
                  <AccordionTrigger className="text-sm sm:text-base py-2">Cryptographic Properties & Guarantees</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      Our implementation provides the following cryptographic properties:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Confidentiality:</strong> AES-256 ensures that without the correct key, 
                        recovering the plaintext is computationally infeasible with current technology.
                      </li>
                      <li>
                        <strong>Authentication:</strong> GCM mode provides built-in authentication, ensuring 
                        that any tampering with the ciphertext will be detected during decryption.
                      </li>
                      <li>
                        <strong>Forward Secrecy:</strong> Each encryption operation uses a fresh random salt and IV, 
                        ensuring that compromise of one encrypted message doesn't affect others, even if they use the same password.
                      </li>
                      <li>
                        <strong>Key Isolation:</strong> Keys derived from passwords exist only in memory 
                        during the encryption/decryption operation and are never stored or transmitted.
                      </li>
                      <li>
                        <strong>No Key Escrow:</strong> There is no mechanism to recover keys or decrypt 
                        data without the original password, ensuring that only the password holder can access the data.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="limitations">
                  <AccordionTrigger className="text-sm sm:text-base py-2">Limitations & Considerations</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      While our implementation is cryptographically sound, users should be aware of these limitations:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Browser Implementation Dependency:</strong> We rely on the browser's implementation 
                        of the Web Crypto API, which may vary slightly between browsers. All major modern browsers 
                        implement the standard correctly, but obscure or very old browsers might not.
                      </li>
                      <li>
                        <strong>Memory Constraints:</strong> Very large files may cause memory issues in the browser. 
                        This is a limitation of client-side JavaScript processing, not of the cryptographic implementation.
                      </li>
                      <li>
                        <strong>Metadata Protection:</strong> While the contents are encrypted, file names and sizes 
                        may still reveal information. Consider this when storing or sharing encrypted files.
                      </li>
                      <li>
                        <strong>Password Recovery:</strong> There is intentionally no password recovery mechanism. 
                        Lost passwords mean permanently lost data.
                      </li>
                      <li>
                        <strong>Quantum Computing:</strong> AES-256 is believed to be resistant to quantum attacks, 
                        but as quantum computing advances, this assessment may change over time.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="integrity-verification">
                  <AccordionTrigger className="text-sm sm:text-base py-2">Code Integrity Verification</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      To verify the integrity of this application:
                    </p>
                    <ol className="list-decimal pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Source Inspection:</strong> Review the source code on our GitHub repository, 
                        particularly the encryption implementation in <code>src/lib/encryption.ts</code>.
                      </li>
                      <li>
                        <strong>Build Verification:</strong> Clone the repository and build the application yourself 
                        to ensure the deployed version matches the source code.
                      </li>
                      <li>
                        <strong>Network Analysis:</strong> Use browser developer tools to verify that no network 
                        requests occur during encryption or decryption operations.
                      </li>
                      <li>
                        <strong>Binary Analysis:</strong> Examine the compiled JavaScript using browser developer 
                        tools to ensure it matches the expected functionality.
                      </li>
                      <li>
                        <strong>Browser Storage Inspection:</strong> Verify that no data is being stored in 
                        localStorage, indexedDB, or other persistent storage mechanisms.
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="practices">
          <Card className="border-0 sm:border shadow-none sm:shadow-sm">
            <CardHeader className="px-2 sm:px-6 py-3 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">Security Best Practices</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                How to use this tool most securely
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1 sm:px-6">
              <Alert className="mb-4 sm:mb-6 bg-secure-100 text-secure-800 border-secure-300 text-xs sm:text-sm">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <AlertDescription>
                  For maximum security, follow these recommendations when handling sensitive data.
                </AlertDescription>
              </Alert>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="offline-usage">
                  <AccordionTrigger className="text-sm sm:text-base py-2 flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Offline Usage</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      Always use this application offline when dealing with sensitive information:
                    </p>
                    <ol className="list-decimal pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Disconnect from the internet:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Turn off Wi-Fi on your device</li>
                          <li>Disconnect ethernet cables</li>
                          <li>Enable airplane mode on mobile devices</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Save for offline use:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Most modern browsers allow you to save this page for offline use</li>
                          <li>In Chrome: Menu → More Tools → Save page as...</li>
                          <li>In Firefox: Menu → Save Page As...</li>
                          <li>Open the saved HTML file locally when needed</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Use a dedicated offline device:</strong> For extremely sensitive data, consider using
                        a dedicated device that never connects to the internet.
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="strong-passwords">
                  <AccordionTrigger className="text-sm sm:text-base py-2 flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Strong Passwords</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      Your encryption is only as strong as your password:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Use long passphrases:</strong> Consider using a sentence or phrase of at least 4-5 
                        words (e.g., "correct-horse-battery-staple").
                      </li>
                      <li>
                        <strong>Include variety:</strong> Mix uppercase, lowercase, numbers, and special characters.
                      </li>
                      <li>
                        <strong>Avoid personal information:</strong> Don't use names, birthdates, or other easily
                        guessable information.
                      </li>
                      <li>
                        <strong>Use different passwords:</strong> Don't reuse passwords you use for other services.
                      </li>
                      <li>
                        <strong>Store securely:</strong> Use a password manager or write down passwords and store
                        them in a physically secure location.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="secure-environment">
                  <AccordionTrigger className="text-sm sm:text-base py-2 flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Secure Environment</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      Ensure your physical environment and device are secure:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Privacy:</strong> Be aware of shoulder surfing in public places.
                      </li>
                      <li>
                        <strong>Clean device:</strong> Use a device free from malware and keyloggers.
                        Keep your operating system and browser up to date.
                      </li>
                      <li>
                        <strong>Temporary files:</strong> Be aware that some operating systems might
                        create temporary copies of files you're working with.
                      </li>
                      <li>
                        <strong>Screen recording:</strong> Ensure no screen recording software is running.
                      </li>
                      <li>
                        <strong>Private browsing:</strong> Consider using a private/incognito window
                        to minimize browser data storage.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="storing-encrypted-data">
                  <AccordionTrigger className="text-sm sm:text-base py-2 flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Storing Encrypted Data</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      After encrypting your data:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Keep backups:</strong> Store encrypted files in multiple secure locations
                        to prevent data loss.
                      </li>
                      <li>
                        <strong>Consider metadata:</strong> Remember that file names, sizes, and modification
                        dates can reveal information even if the contents are encrypted.
                      </li>
                      <li>
                        <strong>Secure deletion:</strong> When deleting the original unencrypted files,
                        use secure deletion methods as regular deletion doesn't completely remove the data.
                      </li>
                      <li>
                        <strong>Test decryption:</strong> Periodically verify that you can still decrypt
                        your files with your stored passwords.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="sharing-encrypted-data">
                  <AccordionTrigger className="text-sm sm:text-base py-2 flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Sharing Encrypted Data</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      When sharing encrypted content with others:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Separate channels:</strong> Never send the encrypted data and password
                        through the same channel.
                      </li>
                      <li>
                        <strong>Secure password transmission:</strong> Share passwords in person or via
                        a different secure communication method than the encrypted data.
                      </li>
                      <li>
                        <strong>Share this tool:</strong> Ensure recipients know how to decrypt the data
                        by sharing this tool with them.
                      </li>
                      <li>
                        <strong>Limited time:</strong> Consider using passwords that you both already know,
                        or inform recipients to decrypt the data within a specific timeframe, after which
                        you'll change or discard the password.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="legal">
          <Card className="border-0 sm:border shadow-none sm:shadow-sm">
            <CardHeader className="px-2 sm:px-6 py-3 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">Legal Information</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Important legal information regarding the use of this service
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1 sm:px-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="disclaimer">
                  <AccordionTrigger className="text-sm sm:text-base py-2">Disclaimer of Responsibility</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <Alert className="bg-orange-50 text-orange-800 border-orange-200 mb-3 sm:mb-4">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <AlertDescription className="font-medium">
                        We are not responsible for the use of this application or the data it manages.
                      </AlertDescription>
                    </Alert>
                    <p>
                      This tool is provided for educational and security purposes only. By using this service, you acknowledge and agree that:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>You are solely responsible for your data and password management</li>
                      <li>We cannot recover lost passwords under any circumstances</li>
                      <li>We provide no warranties or guarantees regarding the security, accuracy, or reliability of this service</li>
                      <li>You use this tool at your own risk</li>
                      <li>We are not liable for any damages, data loss, or other negative outcomes resulting from the use of this service</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="terms">
                  <AccordionTrigger className="text-sm sm:text-base py-2">Terms of Service Summary</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      By using this service, you agree to our full Terms of Service, which include the following key points:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>The service is provided "as is" without warranty of any kind</li>
                      <li>You are responsible for ensuring the lawful use of this service</li>
                      <li>We are not liable for any direct, indirect, or consequential damages</li>
                      <li>You are solely responsible for your passwords and data management</li>
                      <li>We reserve the right to modify the service and these terms at any time</li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      For the complete terms, please refer to the Terms of Service link at the bottom of the page.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="privacy">
                  <AccordionTrigger className="text-sm sm:text-base py-2">Privacy Policy Overview</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      Our privacy approach is simple: we don't collect, store, or process any of your data.
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>All encryption operations happen locally in your browser</li>
                      <li>No data is ever transmitted to our servers</li>
                      <li>We don't use cookies, local storage, or analytics</li>
                      <li>We don't integrate with any third-party services that would collect data</li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      This is a zero-knowledge application, meaning we have no ability to access any information you encrypt using this service.
                      For the complete privacy policy, please refer to the Privacy Policy link at the bottom of the page.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="license">
                  <AccordionTrigger className="text-sm sm:text-base py-2">Open Source License</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground">
                    <p>
                      This application is released under the MIT License, which means:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software</li>
                      <li>The software is provided "as is", without warranty of any kind</li>
                      <li>The authors or copyright holders are not liable for any claims, damages or other liability</li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      For the complete license text, please refer to the MIT License link at the bottom of the page or visit our GitHub repository.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Separator className="my-4 sm:my-6" />
              
              <div className="bg-gray-50 p-3 sm:p-4 rounded-md border border-gray-100">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <FileText className="h-4 w-4 sm:h-5 md:w-5 text-secure-600 mr-2" />
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">Legal Documents</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
                  Complete legal documents are available at the bottom of the page:
                </p>
                <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm text-secure-600">
                  <li>
                    <button 
                      onClick={() => openDialog('Terms of Service')}
                      className="hover:underline text-left"
                      type="button"
                    >
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => openDialog('Privacy Policy')}
                      className="hover:underline text-left"
                      type="button"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => openDialog('MIT License')}
                      className="hover:underline text-left"
                      type="button"
                    >
                      MIT License
                    </button>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 sm:mt-12 p-3 sm:p-4 border-t border-gray-200 text-[10px] sm:text-xs text-gray-500">
        <p className="font-bold mb-1 sm:mb-2">DISCLAIMER:</p>
        <p>
          We are not responsible for the use of this application or the data it manages. 
          This tool is provided for educational and security purposes only. Users are solely responsible for their 
          data, password management, and any consequences of using this service. Lost passwords cannot be recovered 
          and will result in permanent loss of encrypted data.
        </p>
      </div>
    </div>
  );
};

export default FAQComponent;
