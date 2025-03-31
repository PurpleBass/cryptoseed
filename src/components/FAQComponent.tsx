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
      
      const targetLink = footerLinks.find(link => 
        link.textContent?.trim().includes(dialogType)
      );
      
      if (targetLink && targetLink instanceof HTMLElement) {
        targetLink.click();
      } else {
        console.error(`Could not find footer link for: ${dialogType}`);
      }
    }, 100);
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">What is encryption and why do I need it?</AccordionTrigger>
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">How does this app work?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Our app uses a very strong encryption method called <strong>AES-256</strong> (the same technology used by
                      governments and banks) to protect your data.
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">How secure is this encryption?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      <strong>AES-256 encryption is extremely secure</strong>. If implemented correctly (as it is in this app):
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">What if I forget my password?</AccordionTrigger>
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
                
                <AccordionItem value="offline-usage">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">Why should I use this offline?</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      While our app never sends your data anywhere, using it offline provides an <strong>extra 
                      layer of security</strong>:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>It <strong>physically prevents any data transmission</strong></li>
                      <li>It protects against any potential <strong>browser vulnerabilities</strong></li>
                      <li>It eliminates the possibility of <strong>monitoring by network devices</strong></li>
                    </ul>
                    <p className="mt-1 sm:mt-2">
                      To use offline: simply load this page once, then <strong>disconnect from the internet</strong>
                      (turn off WiFi or unplug your ethernet cable). The app will continue to work perfectly.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="no-backdoors">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">What does "no backdoors" mean?</AccordionTrigger>
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
                <AccordionTrigger className="text-sm sm:text-base py-2 text-left">
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">Cryptographic Implementation</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      This application uses the <strong>Web Crypto API</strong> (SubtleCrypto) to perform all cryptographic operations. Here's a detailed breakdown:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Encryption Algorithm:</strong> AES-256-GCM (Galois/Counter Mode)
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li><strong>256-bit key length</strong> (maximum security level for AES)</li>
                          <li>GCM provides both <strong>confidentiality and authenticity</strong></li>
                          <li><strong>Detects tampering</strong> with the encrypted data</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Key Derivation:</strong> PBKDF2 (Password-Based Key Derivation Function 2)
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li><strong>100,000 iterations</strong> of SHA-256 hashing</li>
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
                          <li><strong>Salt (16 bytes) + IV (12 bytes) + Encrypted data</strong></li>
                          <li>Encoded as <strong>Base64</strong> for text compatibility</li>
                        </ul>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="security-model">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">Security Model & Threat Considerations</AccordionTrigger>
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">Cryptographic Properties & Guarantees</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Our implementation provides the following cryptographic properties:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Confidentiality:</strong> AES-256 ensures that without the correct key, 
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
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="limitations">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">Limitations & Considerations</AccordionTrigger>
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
                        <strong>Quantum Computing:</strong> AES-256 is believed to be <strong>resistant to quantum attacks</strong>, 
                        but as quantum computing advances, this assessment may change over time.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="integrity-verification">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">Code Integrity Verification</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      To verify the integrity of this application:
                    </p>
                    <ol className="list-decimal pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Source Inspection:</strong> Review the source code on our GitHub repository, 
                        particularly the encryption implementation in <code>src/lib/encryption.ts</code>.
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Offline Usage</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      <strong>Always use this application offline</strong> when dealing with sensitive information:
                    </p>
                    <ol className="list-decimal pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
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
                
                <AccordionItem value="strong-passwords">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left flex items-center gap-2">
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left flex items-center gap-2">
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left flex items-center gap-2">
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left flex items-center gap-2">
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">Disclaimer of Responsibility</AccordionTrigger>
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">Terms of Service Summary</AccordionTrigger>
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">Privacy Policy Overview</AccordionTrigger>
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
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left">Open Source License</AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      This application is released under the <strong>MIT License</strong>, which means:
                    </p>
                    <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>You are <strong>free
