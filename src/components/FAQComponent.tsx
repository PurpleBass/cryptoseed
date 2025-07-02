import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, HelpCircle, Shield, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const FAQComponent = () => {
  const openDialog = (dialogType: string) => {
    setTimeout(() => {
      const footerLinks = Array.from(document.querySelectorAll('footer a, footer button'));
      const targetLink = footerLinks.find(link => link.textContent?.trim().includes(dialogType));
      if (targetLink && targetLink instanceof HTMLElement) {
        targetLink.click();
      } else {
        console.error(`Could not find footer link for: ${dialogType}`);
      }
    }, 100);
  };
  return <div className="w-full mx-auto px-2 sm:px-4 max-w-4xl">
      <div className="mb-4 sm:mb-6 text-center">
        <div className="flex items-center gap-2 justify-center">
          <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secure-600" />
          <h2 className="text-xl sm:text-2xl font-bold">FAQ & Best Practices</h2>
        </div>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">
          Common questions about encryption and how to use this tool securely.
        </p>
      </div>
      
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-3">
          <TabsTrigger value="user" className="text-xs sm:text-sm px-2 sm:px-3">Non-Technical</TabsTrigger>
          <TabsTrigger value="technical" className="text-xs sm:text-sm px-2 sm:px-3">Technical</TabsTrigger>
          <TabsTrigger value="practices" className="text-xs sm:text-sm px-2 sm:px-3">Best Practices</TabsTrigger>
          <TabsTrigger value="legal" className="text-xs sm:text-sm px-2 sm:px-3">Legal</TabsTrigger>
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">What is encryption and why do I need it?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Encryption is like a <strong>high-security digital safe</strong> for your information. It scrambles your 
                      text or files so that <strong>only someone with the correct password</strong> can read them.
                    </p>
                    <p className="mt-2">
                      You might need encryption to:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>Securely store <strong>sensitive personal information</strong></li>
                      <li>Share <strong>confidential information</strong> with others</li>
                      <li>Protect <strong>valuable files</strong> from unauthorized access</li>
                      <li>Keep <strong>private notes</strong> truly private</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="how-it-works">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">How does this app work?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Our app uses a very strong encryption method called <strong>ChaCha20-Poly1305</strong> with <strong>Argon2id</strong> key derivation 
                      (the latest recommended standards by OWASP and cryptography experts) to protect your data.
                    </p>
                    <p className="mt-1 sm:mt-2">
                      Here's how it works in simple terms:
                    </p>
                    <ol className="list-decimal pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>You enter your text or select a file to encrypt</li>
                      <li>You create a <strong>password</strong> (make it strong!)</li>
                      <li>The app <strong>scrambles your data</strong> using your password as the key</li>
                      <li>The result is a jumbled mess that's <strong>meaningless without your password</strong></li>
                      <li>Later, you can use your password to <strong>unscramble and recover</strong> your original data</li>
                    </ol>
                    <p className="mt-1 sm:mt-2">
                      All of this happens <strong>directly on your device</strong>. Your information <strong>never leaves your 
                      computer or phone</strong>, so there's no risk of interception.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="is-it-secure">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">How secure is this encryption?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      <strong>ChaCha20-Poly1305 encryption is extremely secure</strong>. If implemented correctly (as it is in this app):
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>It would take <strong>billions of years</strong> for all the world's computers to crack it</li>
                      <li>Even <strong>governments and intelligence agencies</strong> use it for their top-secret information</li>
                      <li>There are <strong>no known practical attacks</strong> against it</li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      The most vulnerable part is your <strong>password</strong>. If someone can guess your password, they 
                      can decrypt your data. That's why using a <strong>strong, unique password</strong> is essential.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="what-if-lose-password">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">What if I forget my password?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Unfortunately, if you forget your password, your encrypted data is <strong>lost forever</strong>. 
                      There is <strong>no "password recovery" option</strong>. This is actually a security feature – if 
                      there was a backdoor or recovery method, others could potentially use it too.
                    </p>
                    <p className="mt-1 sm:mt-2">
                      We strongly recommend:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>Using a <strong>password manager</strong> to securely store your encryption passwords</li>
                      <li>Writing down passwords in a <strong>physically secure location</strong> (like a safe)</li>
                      <li>Creating passwords that are <strong>memorable to you</strong> but difficult for others to guess</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="no-backdoors">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">What does "no backdoors" mean?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      A backdoor is a <strong>secret way to bypass normal security measures</strong>. Some encryption 
                      products have hidden methods that allow the developers, governments, or others 
                      to access your encrypted data without your password.
                    </p>
                    <p className="mt-1 sm:mt-2">
                      Our app has <strong>no backdoors</strong>, meaning:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li><strong>Only you</strong> can decrypt your data with your password</li>
                      <li>We <strong>cannot access</strong> your encrypted data even if legally required to</li>
                      <li>There are <strong>no master keys</strong> or recovery methods</li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      Our code is <strong>open-source</strong> so anyone can verify these claims by examining it.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              
                <AccordionItem value="data-memory">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">
                    How will you remember my encryption?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      <strong>We won't – and more importantly, we can't</strong>. Our entire application 
                      is designed with a zero-knowledge architecture that makes it <strong>impossible 
                      for us to store or remember anything about your encrypted data</strong>.
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>All encryption happens directly in your browser</strong>, on your device
                      </li>
                      <li>
                        <strong>No data is ever transmitted to our servers</strong>
                      </li>
                      <li>
                        <strong>We have no way to access your password or decryption key</strong>
                      </li>
                      <li>
                        <strong>Each encryption session is completely isolated</strong> and exists 
                        only in your browser's memory
                      </li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      Even if someone demanded we reveal your data, we <strong>physically cannot</strong>. 
                      Our design ensures that only you, with your specific password, can decrypt 
                      the information.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="why-trust">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">Why should I trust you?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Trust is earned through transparency, open-source code, and a commitment to user privacy. Here's why you can trust our encryption tool:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Open-Source Code</strong>: Our entire codebase is publicly available on GitHub for anyone to review
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Full transparency about how encryption works</li>
                          <li>Community can verify there are no backdoors</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Zero-Knowledge Architecture</strong>: We cannot access your data
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>All encryption happens directly in your browser</li>
                          <li>No data is ever transmitted to our servers</li>
                          <li>We have no way to recover or see your encrypted information</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Industry-Standard Encryption</strong>: Using ChaCha20-Poly1305 with Argon2id, the latest recommended cryptographic standards
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Considered unbreakable with current technology</li>
                          <li>Recommended by cybersecurity experts</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Community-Driven Development</strong>: Continuous improvement through open-source collaboration
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Security vulnerabilities can be quickly identified and fixed</li>
                          <li>Ongoing auditing by the open-source community</li>
                        </ul>
                      </li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      We believe trust is built on radical transparency, technical excellence, and an unwavering commitment to your privacy.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="pwa-features">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">What is a "Progressive Web App" and why should I install it?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Our app is a Progressive Web App (PWA), which is a special type of website that can:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Work offline</strong> without an internet connection
                      </li>
                      <li>
                        <strong>Install on your device</strong> like a regular app
                      </li>
                      <li>
                        <strong>Load quickly</strong>, even on slow connections
                      </li>
                      <li>
                        Provide <strong>enhanced security</strong> by isolating from other browser tabs
                      </li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      <strong>Installing this app on your device offers several security benefits:</strong>
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 space-y-1">
                      <li>
                        <strong>Guaranteed offline access:</strong> The app will work without an internet connection
                      </li>
                      <li>
                        <strong>Enhanced privacy:</strong> The installed app operates in its own sandbox, separate from your browser
                      </li>
                      <li>
                        <strong>Easier offline mode:</strong> You don't need to manually save the page for offline use
                      </li>
                      <li>
                        <strong>Convenient access:</strong> Launch directly from your home screen or app drawer
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="how-to-install">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">How do I install this app on my device?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      You can easily install this app on your device to use it offline. The installation process is slightly different depending on your device:
                    </p>
                    <div className="mt-1 sm:mt-2 space-y-3">
                      <div>
                        <strong className="text-gray-800">On Desktop (Chrome, Edge, or other Chromium browsers):</strong>
                        <ol className="list-decimal pl-6 mt-1 space-y-1">
                          <li>Look for the install icon (↓) in the address bar</li>
                          <li>Click on "Install" or "Install Crypto Seed"</li>
                          <li>Follow any additional prompts to complete installation</li>
                        </ol>
                      </div>
                      
                      <div>
                        <strong className="text-gray-800">On Android:</strong>
                        <ol className="list-decimal pl-6 mt-1 space-y-1">
                          <li>Tap the menu button (⋮) in your browser</li>
                          <li>Select "Add to Home screen" or "Install app"</li>
                          <li>Confirm by tapping "Add" or "Install"</li>
                        </ol>
                      </div>
                      
                      <div>
                        <strong className="text-gray-800">On iOS/iPadOS (Safari):</strong>
                        <ol className="list-decimal pl-6 mt-1 space-y-1">
                          <li>Tap the share button (box with arrow) at the bottom of the screen</li>
                          <li>Scroll down and tap "Add to Home Screen"</li>
                          <li>Tap "Add" in the top-right corner</li>
                        </ol>
                      </div>
                    </div>
                    <p className="mt-1 sm:mt-2">
                      After installation, you can launch the app from your device's home screen or app drawer, 
                      just like any other app. The app will function entirely offline after the first load.
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">Cryptographic Implementation</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      This application uses the <strong>Web Crypto API</strong> (SubtleCrypto) to perform all cryptographic operations. Here's a detailed breakdown:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Encryption Algorithm:</strong> ChaCha20-Poly1305 (Authenticated Encryption)
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li><strong>256-bit key length</strong> (maximum security level for AES)</li>
                          <li>GCM provides both <strong>confidentiality and authenticity</strong></li>
                          <li><strong>Detects tampering</strong> with the encrypted data</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Key Derivation:</strong> Argon2id (Memory-hard, OWASP recommended)
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li><strong>600,000 iterations</strong> of SHA-256 hashing</li>
                          <li><strong>Unique random salt</strong> for each encryption operation</li>
                          <li>Protects against <strong>rainbow table and brute-force attacks</strong></li>
                        </ul>
                      </li>
                      <li>
                        <strong>Initialization Vector (IV):</strong> 
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li><strong>96-bit (12-byte)</strong> cryptographically secure random IV</li>
                          <li>Generated using <strong>crypto.getRandomValues()</strong></li>
                          <li><strong>Fresh IV</strong> used for each encryption operation</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Output Format:</strong> 
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li><strong>Version byte + Salt (16 bytes) + IV (12 bytes) + Encrypted data</strong></li>
                          <li>Encoded as <strong>Base64</strong> for text compatibility</li>
                          <li><strong>Versioned format</strong> ensures backward compatibility with future security improvements</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Memory Protection:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Implementation of <strong>secure memory wiping</strong> after cryptographic operations</li>
                          <li>Sensitive data is <strong>overwritten in memory</strong> when no longer needed</li>
                          <li>Reduces the risk of <strong>memory-based attacks</strong></li>
                        </ul>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="security-model">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">Security Model & Threat Considerations</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Our security model makes the following assumptions and mitigations:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Trusted Platform:</strong> We assume your device and browser are not compromised. 
                        To mitigate device-level threats, we recommend using <strong>trusted devices with up-to-date security</strong>.
                      </li>
                      <li>
                        <strong>Memory Security:</strong> Sensitive data may remain in memory while the app is running. 
                        To mitigate, <strong>close the browser tab after use</strong> and consider a device restart for highly sensitive operations.
                      </li>
                      <li>
                        <strong>Side-Channel Attacks:</strong> Web browsers can be vulnerable to certain side-channel attacks. 
                        To mitigate, use a <strong>modern, security-focused browser</strong> and keep it updated.
                      </li>
                      <li>
                        <strong>Password Strength:</strong> A weak password is the most likely point of failure. 
                        To mitigate, use <strong>long, complex passwords</strong> and store them securely.
                      </li>
                      <li>
                        <strong>Network Adversaries:</strong> While the app functions offline, initial loading happens online. 
                        To mitigate MITM attacks, we use <strong>HTTPS</strong> and recommend verifying the application code before use.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="cryptographic-properties">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">Cryptographic Properties & Guarantees</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Our implementation provides the following cryptographic properties:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Confidentiality:</strong> ChaCha20-Poly1305 ensures that without the correct key, 
                        recovering the plaintext is <strong>computationally infeasible</strong> with current technology.
                      </li>
                      <li>
                        <strong>Authentication:</strong> GCM mode provides built-in authentication, ensuring 
                        that any <strong>tampering with the ciphertext will be detected</strong> during decryption.
                      </li>
                      <li>
                        <strong>Forward Secrecy:</strong> Each encryption operation uses a fresh random salt and IV, 
                        ensuring that <strong>compromise of one encrypted message doesn't affect others</strong>, even if they use the same password.
                      </li>
                      <li>
                        <strong>Key Isolation:</strong> Keys derived from passwords exist <strong>only in memory 
                        during the encryption/decryption operation</strong> and are never stored or transmitted.
                      </li>
                      <li>
                        <strong>No Key Escrow:</strong> There is <strong>no mechanism to recover keys</strong> or decrypt 
                        data without the original password, ensuring that only the password holder can access the data.
                      </li>
                      <li>
                        <strong>Versioned Format:</strong> The encryption format includes a <strong>version identifier</strong>,
                        allowing for future cryptographic improvements while maintaining backward compatibility.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="limitations">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">Limitations & Considerations</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      While our implementation is cryptographically sound, users should be aware of these limitations:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Browser Implementation Dependency:</strong> We rely on the browser's implementation 
                        of the Web Crypto API, which may vary slightly between browsers. <strong>All major modern browsers 
                        implement the standard correctly</strong>, but obscure or very old browsers might not.
                      </li>
                      <li>
                        <strong>Memory Constraints:</strong> Very large files may cause memory issues in the browser. 
                        This is a limitation of <strong>client-side JavaScript processing</strong>, not of the cryptographic implementation.
                      </li>
                      <li>
                        <strong>Metadata Protection:</strong> While the contents are encrypted, <strong>file names and sizes 
                        may still reveal information</strong>. Consider this when storing or sharing encrypted files.
                      </li>
                      <li>
                        <strong>Password Recovery:</strong> There is <strong>intentionally no password recovery mechanism</strong>. 
                        Lost passwords mean permanently lost data.
                      </li>
                      <li>
                        <strong>Quantum Computing:</strong> ChaCha20-Poly1305 is believed to be <strong>more resistant to quantum attacks</strong> than traditional encryption methods, 
                        but as quantum computing advances, this assessment may change over time.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="integrity-verification">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">Code Integrity Verification</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      To verify the integrity of this application:
                    </p>
                    <ol className="list-decimal pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Source Inspection:</strong> Review the source code on our GitHub repository, 
                        particularly the encryption implementation in <code>src/lib/encryptionV3.ts</code>.
                      </li>
                      <li>
                        <strong>Build Verification:</strong> Clone the repository and <strong>build the application yourself</strong> 
                        to ensure the deployed version matches the source code.
                      </li>
                      <li>
                        <strong>Network Analysis:</strong> Use browser developer tools to <strong>verify that no network 
                        requests occur</strong> during encryption or decryption operations.
                      </li>
                      <li>
                        <strong>Binary Analysis:</strong> Examine the compiled JavaScript using browser developer 
                        tools to ensure it matches the expected functionality.
                      </li>
                      <li>
                        <strong>Browser Storage Inspection:</strong> Verify that <strong>no data is being stored</strong> in 
                        localStorage, indexedDB, or other persistent storage mechanisms.
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="pwa-implementation">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">PWA & Offline Functionality</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Our Progressive Web App implementation includes:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Service Worker Architecture:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Utilizes the <strong>Workbox library</strong> for service worker management</li>
                          <li>Implements a <strong>cache-first strategy</strong> for application resources</li>
                          <li>Provides <strong>complete offline functionality</strong> after initial load</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Static Asset Caching:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>All application assets are <strong>precached during installation</strong></li>
                          <li>Uses <strong>content hashing</strong> to ensure cache validity</li>
                          <li>Implements <strong>automatic cache invalidation</strong> when app is updated</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Offline Detection:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Real-time monitoring of network connectivity</li>
                          <li>Visual indicator when device is operating offline</li>
                          <li>Graceful handling of network transitions</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Security Considerations:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Service worker scope is <strong>limited to application origin</strong></li>
                          <li>Implements <strong>strict Content Security Policy</strong> for PWA context</li>
                          <li>Application maintains <strong>cryptographic integrity</strong> in offline mode</li>
                        </ul>
                      </li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      The PWA functionality works seamlessly with our zero-knowledge architecture, ensuring that all cryptographic operations remain 
                      entirely client-side even when the application is running offline.
                    </p>
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
                  For <strong>maximum security</strong>, follow these recommendations when handling sensitive data.
                </AlertDescription>
              </Alert>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="offline-usage">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Offline Usage</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      <strong>Always use this application offline</strong> when dealing with sensitive information:
                    </p>
                    <ol className="list-decimal pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Install as a Progressive Web App (recommended):</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Look for the install icon in your browser's address bar</li>
                          <li>Once installed, you can <strong>use the app completely offline</strong></li>
                          <li>The app will show an offline indicator when disconnected</li>
                          <li>This provides the highest level of isolation from online threats</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Disconnect from the internet:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Turn off <strong>Wi-Fi</strong> on your device</li>
                          <li>Disconnect <strong>ethernet cables</strong></li>
                          <li>Enable <strong>airplane mode</strong> on mobile devices</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Save for offline use:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Most modern browsers allow you to <strong>save this page for offline use</strong></li>
                          <li>In Chrome: Menu → More Tools → <strong>Save page as...</strong></li>
                          <li>In Firefox: Menu → <strong>Save Page As...</strong></li>
                          <li>Open the saved HTML file locally when needed</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Use a dedicated offline device:</strong> For extremely sensitive data, consider using
                        a <strong>dedicated device that never connects to the internet</strong>.
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="mobile-security">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Mobile Device Security</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      When using this app on mobile devices, take these additional precautions:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Install as a PWA:</strong> 
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Installing as a PWA creates a <strong>separate, isolated instance</strong> of the app</li>
                          <li>This provides <strong>protection from browser-based threats</strong> and tracking</li>
                          <li>PWAs have more restricted access to device APIs than browser tabs</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Use biometric protection:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Enable <strong>fingerprint or face recognition</strong> to lock your device</li>
                          <li>Consider using a <strong>secure folder</strong> feature if your device supports it</li>
                          <li>Some password managers allow you to <strong>lock specific apps</strong> with biometrics</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Clear sensitive data:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Mobile browsers often <strong>cache more aggressively</strong> than desktop browsers</li>
                          <li>Regularly clear your browser cache and history</li>
                          <li>Use private/incognito browsing when possible</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Beware of screenshots:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Be aware that <strong>automatic screenshots</strong> might be taken when switching apps</li>
                          <li>Check your device's <strong>screenshot gallery</strong> after working with sensitive data</li>
                          <li>Disable screenshot features during sensitive operations if possible</li>
                        </ul>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="strong-passwords">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Strong Passwords</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Your encryption is <strong>only as strong as your password</strong>:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Use long passphrases:</strong> Consider using a sentence or phrase of at least <strong>4-5 
                        words</strong> (e.g., "correct-horse-battery-staple").
                      </li>
                      <li>
                        <strong>Include variety:</strong> Mix <strong>uppercase, lowercase, numbers, and special characters</strong>.
                      </li>
                      <li>
                        <strong>Avoid personal information:</strong> Don't use <strong>names, birthdates, or other easily
                        guessable information</strong>.
                      </li>
                      <li>
                        <strong>Use different passwords:</strong> Don't reuse passwords you use for other services.
                      </li>
                      <li>
                        <strong>Store securely:</strong> Use a <strong>password manager</strong> or write down passwords and store
                        them in a physically secure location.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="secure-environment">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Secure Environment</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Ensure your <strong>physical environment and device are secure</strong>:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Privacy:</strong> Be aware of <strong>shoulder surfing</strong> in public places.
                      </li>
                      <li>
                        <strong>Clean device:</strong> Use a device <strong>free from malware and keyloggers</strong>.
                        Keep your operating system and browser up to date.
                      </li>
                      <li>
                        <strong>Temporary files:</strong> Be aware that some operating systems might
                        create <strong>temporary copies of files</strong> you're working with.
                      </li>
                      <li>
                        <strong>Screen recording:</strong> Ensure <strong>no screen recording software</strong> is running.
                      </li>
                      <li>
                        <strong>Private browsing:</strong> Consider using a <strong>private/incognito window</strong>
                        to minimize browser data storage.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="storing-encrypted-data">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Storing Encrypted Data</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      After encrypting your data:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Keep backups:</strong> Store encrypted files in <strong>multiple secure locations</strong>
                        to prevent data loss.
                      </li>
                      <li>
                        <strong>Consider metadata:</strong> Remember that <strong>file names, sizes, and modification
                        dates can reveal information</strong> even if the contents are encrypted.
                      </li>
                      <li>
                        <strong>Secure deletion:</strong> When deleting the original unencrypted files,
                        use <strong>secure deletion methods</strong> as regular deletion doesn't completely remove the data.
                      </li>
                      <li>
                        <strong>Test decryption:</strong> Periodically verify that you can <strong>still decrypt
                        your files</strong> with your stored passwords.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="sharing-encrypted-data">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Sharing Encrypted Data</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      When sharing encrypted content with others:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Separate channels:</strong> <strong>Never send the encrypted data and password
                        through the same channel</strong>.
                      </li>
                      <li>
                        <strong>Secure password transmission:</strong> Share passwords <strong>in person or via
                        a different secure communication method</strong> than the encrypted data.
                      </li>
                      <li>
                        <strong>Share this tool:</strong> Ensure recipients know how to decrypt the data
                        by sharing this tool with them.
                      </li>
                      <li>
                        <strong>Limited time:</strong> Consider using <strong>passwords that you both already know</strong>,
                        or inform recipients to decrypt the data within a specific timeframe, after which
                        you'll change or discard the password.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="network-security">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Network Security</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      After loading this application, take immediate steps to enhance your network security:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Disconnect from the internet</strong> immediately after the page loads:
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Turn off <strong>Wi-Fi</strong></li>
                          <li>Disconnect <strong>ethernet cables</strong></li>
                          <li>Enable <strong>airplane mode</strong> on mobile devices</li>
                        </ul>
                      </li>
                      <li>
                        This prevents any potential background network communication and 
                        ensures <strong>complete isolation</strong> during sensitive operations.
                      </li>
                      <li>
                        Reconnect only when absolutely necessary and <strong>close the application tab</strong> 
                        before reconnecting to minimize potential exposure.
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">Disclaimer of Responsibility</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <Alert className="bg-orange-50 text-orange-800 border-orange-200 mb-3 sm:mb-4">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <AlertDescription className="font-medium">
                        We are <strong>not responsible</strong> for the use of this application or the data it manages.
                      </AlertDescription>
                    </Alert>
                    <p>
                      This tool is provided for <strong>educational and security purposes only</strong>. By using this service, you acknowledge and agree that:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>You are <strong>solely responsible</strong> for your data and password management</li>
                      <li>We <strong>cannot recover lost passwords</strong> under any circumstances</li>
                      <li>We provide <strong>no warranties or guarantees</strong> regarding the security, accuracy, or reliability of this service</li>
                      <li>You use this tool <strong>at your own risk</strong></li>
                      <li>We are <strong>not liable</strong> for any damages, data loss, or other negative outcomes resulting from the use of this service</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="terms">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">Terms of Service Summary</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      By using this service, you agree to our full Terms of Service, which include the following <strong>key points</strong>:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>The service is provided <strong>"as is" without warranty</strong> of any kind</li>
                      <li>You are responsible for ensuring the <strong>lawful use</strong> of this service</li>
                      <li>We are <strong>not liable</strong> for any direct, indirect, or consequential damages</li>
                      <li>You are <strong>solely responsible</strong> for your passwords and data management</li>
                      <li>We reserve the right to <strong>modify the service and these terms</strong> at any time</li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      For the complete terms, please refer to the <strong>Terms of Service</strong> link at the bottom of the page.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="privacy">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">Privacy Policy Overview</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Our privacy approach is simple: <strong>we don't collect, store, or process any of your data</strong>.
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>All encryption operations happen <strong>locally in your browser</strong></li>
                      <li><strong>No data is ever transmitted</strong> to our servers</li>
                      <li>We <strong>don't use cookies</strong>, local storage, or analytics</li>
                      <li>We <strong>don't integrate</strong> with any third-party services that would collect data</li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      This is a <strong>zero-knowledge application</strong>, meaning we have no ability to access any information you encrypt using this service.
                      For the complete privacy policy, please refer to the Privacy Policy link at the bottom of the page.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="license">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start">Open Source License</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      This application is released under the <strong>GNU General Public License v3.0</strong>, which means:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>You are <strong>free to use, modify, and distribute</strong> this software</li>
                      <li>You may use it for <strong>personal or commercial</strong> purposes</li>
                      <li>The code is provided <strong>as-is</strong> with no warranty</li>
                      <li>We are not liable for any issues arising from its use</li>
                      <li>You must <strong>include the original license</strong> if you redistribute the code</li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      The full license is available in our GitHub repository.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default FAQComponent;
