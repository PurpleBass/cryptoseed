import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield, KeyRound, User2, Lock, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const FAQComponent = () => {
  const offlineUsageContent = (
    <>
      <p>
        To ensure maximum security and privacy, follow these steps to use this
        tool offline:
      </p>
      <ol className="list-decimal pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
        <li>
          <strong>Prepare Your Device:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              Ensure your device (computer, tablet, or smartphone) is free from
              malware and has the latest security updates.
            </li>
            <li>
              Fully charge your device or ensure it is connected to a reliable
              power source to avoid interruptions during use.
            </li>
          </ul>
        </li>
        <li>
          <strong>Download the Tool:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              Download the tool and all necessary components while you still have
              an active, secure internet connection.
            </li>
            <li>
              Verify the integrity of the downloaded files using checksums or
              digital signatures, if available.
            </li>
          </ul>
        </li>
        <li>
          <strong>Disconnect from the Internet:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              Turn off Wi-Fi on your device to prevent any potential network
              connections.
            </li>
            <li>
              Disconnect any ethernet cables to ensure a complete disconnection
              from the internet.
            </li>
            <li>
              Enable airplane mode on mobile devices to disable all wireless
              communications.
            </li>
            <li>Disable mobile data if possible.</li>
          </ul>
        </li>
        <li>
          <strong>Verify Offline Status:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              Check the network indicator on your device to confirm that you are
              not connected to any network.
            </li>
            <li>
              Use your device's network settings to verify the complete
              disconnection.
            </li>
          </ul>
        </li>
        <li>
          <strong>Use the Tool:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              Open the downloaded tool and perform your desired tasks.
            </li>
            <li>
              Be cautious about any prompts or requests for internet access, as
              they could indicate a potential security risk.
            </li>
          </ul>
        </li>
        <li>
          <strong>Clear Cache and Data:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              After using the tool, clear any cached data or temporary files
              created during the session.
            </li>
            <li>
              This helps to remove any sensitive information that may have been
              stored locally.
            </li>
          </ul>
        </li>
        <li>
          <strong>Re-establish Internet Connection:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              Once you have completed your tasks, you can re-establish your
              internet connection.
            </li>
            <li>
              Ensure that you have a secure and trusted network connection before
              reconnecting.
            </li>
          </ul>
        </li>
      </ol>
    </>
  );

  const strongPasswordsContent = (
    <>
      <p>
        To protect your data effectively, it's crucial to create a strong,
        unique password. Here's how:
      </p>
      <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
        <li>
          <strong>Length:</strong> Aim for at least 12 characters. Longer is
          better.
        </li>
        <li>
          <strong>Complexity:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>Include a mix of uppercase and lowercase letters.</li>
            <li>Add numbers and symbols (e.g., !@#$%^&*).</li>
          </ul>
        </li>
        <li>
          <strong>Avoid Common Information:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>Don't use personal information like your name, birthday, or pet's name.</li>
            <li>Avoid common words or phrases that are easy to guess.</li>
          </ul>
        </li>
        <li>
          <strong>Uniqueness:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>Use a different password for each of your accounts.</li>
            <li>If one password gets compromised, the others remain secure.</li>
          </ul>
        </li>
        <li>
          <strong>Password Managers:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>Consider using a password manager to generate and store strong, unique passwords.</li>
            <li>Password managers can also help you remember your passwords securely.</li>
          </ul>
        </li>
        <li>
          <strong>Regular Updates:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>Change your passwords regularly, especially for sensitive accounts.</li>
            <li>Set reminders to update your passwords every few months.</li>
          </ul>
        </li>
      </ul>
    </>
  );

  const dataHandlingContent = (
    <>
      <p>
        To ensure the security of your data, follow these guidelines when using
        this tool:
      </p>
      <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
        <li>
          <strong>Minimize Data Entry:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              Only enter the minimum amount of data required for the task at
              hand.
            </li>
            <li>
              Avoid providing unnecessary personal or sensitive information.
            </li>
          </ul>
        </li>
        <li>
          <strong>Verify Data Accuracy:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              Double-check all entered data for accuracy to prevent errors or
              mistakes.
            </li>
            <li>
              Incorrect data can lead to unintended consequences or security
              vulnerabilities.
            </li>
          </ul>
        </li>
        <li>
          <strong>Secure Data Storage:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              If the tool requires data storage, ensure that it is stored
              securely.
            </li>
            <li>
              Use encryption or other security measures to protect stored data
              from unauthorized access.
            </li>
          </ul>
        </li>
        <li>
          <strong>Regular Data Backups:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              Create regular backups of your data to prevent data loss in case
              of system failures or security breaches.
            </li>
            <li>
              Store backups in a secure location, separate from the original
              data.
            </li>
          </ul>
        </li>
        <li>
          <strong>Data Retention Policies:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              Establish clear data retention policies to determine how long data
              should be stored.
            </li>
            <li>
              Delete or archive data that is no longer needed to minimize the
              risk of data breaches.
            </li>
          </ul>
        </li>
        <li>
          <strong>Data Disposal Procedures:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>
              Implement secure data disposal procedures to permanently erase
              sensitive data when it is no longer required.
            </li>
            <li>
              Use data sanitization methods to prevent data recovery.
            </li>
          </ul>
        </li>
      </ul>
    </>
  );

  const seedPhraseSecurityContent = (
    <>
      <p>
        Your seed phrase is the master key to your crypto assets. Keep it
        protected at all costs:
      </p>
      <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
        <li>
          <strong>Keep it Secret:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>Never share your seed phrase with anyone.</li>
            <li>Treat it like the PIN to your bank account.</li>
          </ul>
        </li>
        <li>
          <strong>Store Offline:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>Write it down on paper and store it in a secure location.</li>
            <li>Consider using a hardware wallet for added security.</li>
          </ul>
        </li>
        <li>
          <strong>Avoid Digital Storage:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>Do not store your seed phrase on your computer, phone, or in the cloud.</li>
            <li>Digital storage methods are vulnerable to hacking and malware.</li>
          </ul>
        </li>
        <li>
          <strong>Be Wary of Phishing:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>Be cautious of emails, messages, or websites asking for your seed phrase.</li>
            <li>Legitimate services will never ask for your seed phrase.</li>
          </ul>
        </li>
        <li>
          <strong>Regularly Backup:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>Create multiple backups of your seed phrase and store them in different secure locations.</li>
            <li>This ensures you can recover your assets even if one backup is lost or compromised.</li>
          </ul>
        </li>
        <li>
          <strong>Use Strong Encryption:</strong>
          <ul className="list-disc pl-4 sm:pl-6 mt-1">
            <li>If you must store your seed phrase digitally, use strong encryption methods.</li>
            <li>Consider using a password manager with encryption capabilities.</li>
          </ul>
        </li>
      </ul>
    </>
  );

  return (
    <div className="w-full mx-auto px-2 sm:px-4 max-w-4xl">
      <div className="py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Find answers to common questions about using this tool securely.
        </p>
      </div>
      
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="w-full bg-gray-50 p-1 rounded-full border border-gray-100 shadow-sm">
          <TabsTrigger value="user" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            User Guide
          </TabsTrigger>
          <TabsTrigger value="practices" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Security Practices
          </TabsTrigger>
          <TabsTrigger value="offline" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Offline Usage
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="user">
          <Card className="border-0 sm:border shadow-none sm:shadow-sm">
            <CardHeader className="px-2 sm:px-6 py-3 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">User Guide</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                How to use this tool effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1 sm:px-6">
              <p className="text-sm sm:text-base text-gray-700">
                This tool is designed to help you encrypt and decrypt text and
                files securely.
              </p>
              <ul className="list-disc pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                <li>
                  <strong>Encryption:</strong>
                  <ul className="list-disc pl-4 sm:pl-6 mt-1">
                    <li>
                      Enter the text or select the file you want to encrypt.
                    </li>
                    <li>
                      Provide a strong password to protect your data.
                    </li>
                    <li>
                      Click the "Encrypt" button to generate the encrypted
                      output.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Decryption:</strong>
                  <ul className="list-disc pl-4 sm:pl-6 mt-1">
                    <li>
                      Enter the encrypted text or select the encrypted file you
                      want to decrypt.
                    </li>
                    <li>
                      Provide the correct password used during encryption.
                    </li>
                    <li>
                      Click the "Decrypt" button to retrieve the original data.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Seed Phrase:</strong>
                  <ul className="list-disc pl-4 sm:pl-6 mt-1">
                    <li>
                      Enter your seed phrase words.
                    </li>
                    <li>
                      Provide a strong password to protect your seed phrase.
                    </li>
                    <li>
                      Click the "Encrypt" button to generate the encrypted
                      output.
                    </li>
                  </ul>
                </li>
              </ul>
              <div className="mt-4">
                <Badge variant="secondary">
                  <Link to="/about" className="flex items-center gap-1">
                    Learn more about this tool
                    <Rocket className="h-3 w-3" />
                  </Link>
                </Badge>
              </div>
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
                <AccordionItem value="network-security">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Network Security</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    <p>
                      Protect your connection and prevent potential network-based attacks:
                    </p>
                    <ol className="list-decimal pl-4 sm:pl-6 mt-1 sm:mt-2 space-y-1">
                      <li>
                        <strong>Disconnect from the internet:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Turn off <strong>Wi-Fi</strong> on your device</li>
                          <li>Disconnect <strong>ethernet cables</strong></li>
                          <li>Enable <strong>airplane mode</strong> on mobile devices</li>
                          <li><strong>Disable mobile data</strong> if possible</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Verify offline status:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Check network indicator on your device</li>
                          <li>Confirm no active network connections</li>
                          <li>Use device's network settings to verify complete disconnection</li>
                        </ul>
                      </li>
                      <li>
                        <strong>After page load:</strong>
                        <ul className="list-disc pl-4 sm:pl-6 mt-1">
                          <li>Immediately turn off network connections</li>
                          <li>Prevent any potential background data transmission</li>
                          <li>Ensure complete isolation of your encryption session</li>
                        </ul>
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="offline-usage">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start flex items-center gap-2">
                    <User2 className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Offline Usage</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    {offlineUsageContent}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strong-passwords">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start flex items-center gap-2">
                    <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Strong Passwords</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    {strongPasswordsContent}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="data-handling">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start flex items-center gap-2">
                    <KeyRound className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Data Handling</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    {dataHandlingContent}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="seed-phrase-security">
                  <AccordionTrigger className="text-sm sm:text-base py-2 text-left justify-start flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-secure-600 flex-shrink-0" />
                    <span>Seed Phrase Security</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground text-left">
                    {seedPhraseSecurityContent}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offline">
          <Card className="border-0 sm:border shadow-none sm:shadow-sm">
            <CardHeader className="px-2 sm:px-6 py-3 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">Offline Usage</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                How to use this tool offline
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1 sm:px-6">
              <Alert className="mb-4 sm:mb-6 bg-secure-100 text-secure-800 border-secure-300 text-xs sm:text-sm">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <AlertDescription>
                  Using this tool offline enhances security and privacy.
                </AlertDescription>
              </Alert>
              {offlineUsageContent}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FAQComponent;
