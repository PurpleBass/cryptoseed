import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, AlertCircle, HelpCircle, Lock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQComponent = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6 text-center">
        {/* Increased top margin to match CodeVerification page spacing */}
        <div className="mt-4 mb-6 flex items-center gap-2 justify-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Security FAQ & Best Practices</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Learn how to maximize your security when encrypting and storing sensitive information.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border rounded-lg mb-3 px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2 text-left">
              <Lock className="h-5 w-5 text-secure-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-base">How secure is the encryption?</h3>
                <p className="text-sm text-muted-foreground">Learn about our AES-256 implementation</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                We use AES-256 in Galois/Counter Mode (GCM), which is a highly secure encryption algorithm
                recommended by security experts worldwide. When implemented correctly (as we have done),
                AES-256 is considered unbreakable with current technology.
              </p>
              <p>
                Key features of our encryption:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Military-grade encryption:</strong> AES-256 is used by governments and military
                  organizations worldwide to protect classified information.
                </li>
                <li>
                  <strong>Password strengthening:</strong> We use PBKDF2 with 100,000 iterations to
                  transform your password into a strong encryption key, making brute-force attacks
                  extremely difficult.
                </li>
                <li>
                  <strong>Authenticated encryption:</strong> GCM mode provides both confidentiality and
                  authenticity, ensuring your data cannot be tampered with.
                </li>
                <li>
                  <strong>Client-side only:</strong> All encryption happens in your browser. Your data
                  and passwords never leave your device.
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border rounded-lg mb-3 px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2 text-left">
              <AlertCircle className="h-5 w-5 text-secure-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-base">What if I forget my password?</h3>
                <p className="text-sm text-muted-foreground">Important information about password recovery</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-3 text-sm text-gray-700">
              <p className="font-medium text-destructive">
                There is NO way to recover your data if you forget your password.
              </p>
              <p>
                Due to the nature of strong encryption, we cannot recover your data if you forget your
                password. There are no backdoors, master keys, or recovery methods. This is a fundamental
                security feature, not a limitation.
              </p>
              <p>
                Best practices for password management:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Use a password manager to store your encryption passwords.
                </li>
                <li>
                  Consider writing down your password and storing it in a secure physical location
                  (like a safe).
                </li>
                <li>
                  Create a password that is memorable to you but difficult for others to guess.
                </li>
                <li>
                  If encrypting critical data, test the decryption process with your password before
                  relying on the encrypted version.
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border rounded-lg mb-3 px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2 text-left">
              <BookOpen className="h-5 w-5 text-secure-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-base">Best practices for crypto seed phrases</h3>
                <p className="text-sm text-muted-foreground">How to securely store your wallet recovery phrases</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                Cryptocurrency seed phrases are extremely sensitive information that require special
                handling. Here are best practices for using our tool with seed phrases:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Use a strong, unique password:</strong> Create a password that you don't use
                  anywhere else, with at least 12 characters including uppercase, lowercase, numbers,
                  and symbols.
                </li>
                <li>
                  <strong>Create multiple backups:</strong> Encrypt your seed phrase multiple times with
                  different passwords and store the encrypted files in different locations.
                </li>
                <li>
                  <strong>Consider physical backups:</strong> In addition to encrypted digital copies,
                  consider physical backups like metal seed phrase storage products.
                </li>
                <li>
                  <strong>Test recovery:</strong> Before relying on your encrypted backup, test the
                  decryption process to ensure you can recover your seed phrase.
                </li>
                <li>
                  <strong>Use offline:</strong> For maximum security, disconnect from the internet when
                  encrypting or decrypting seed phrases.
                </li>
                <li>
                  <strong>Clean your clipboard:</strong> After copying your seed phrase, clear your
                  clipboard by copying something else.
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border rounded-lg mb-3 px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2 text-left">
              <HelpCircle className="h-5 w-5 text-secure-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-base">How does zero-knowledge encryption work?</h3>
                <p className="text-sm text-muted-foreground">Understanding our privacy-first approach</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                "Zero-knowledge" means that we have zero knowledge of your data or passwords. Here's how
                our approach ensures maximum privacy:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Client-side encryption:</strong> All encryption and decryption happens directly
                  in your browser. Your data never leaves your device.
                </li>
                <li>
                  <strong>No server communication:</strong> After the initial page load, our application
                  doesn't communicate with any servers. You can disconnect from the internet and it will
                  still work perfectly.
                </li>
                <li>
                  <strong>No analytics or tracking:</strong> We don't use any analytics, tracking cookies,
                  or monitoring tools that could compromise your privacy.
                </li>
                <li>
                  <strong>Open source:</strong> Our code is completely open source and can be audited by
                  anyone to verify these privacy claims.
                </li>
                <li>
                  <strong>No account required:</strong> You don't need to create an account or provide
                  any personal information to use our tool.
                </li>
              </ul>
              <p>
                This approach ensures that we technically cannot access your data even if we wanted to,
                providing you with the strongest possible privacy guarantees.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border rounded-lg mb-3 px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2 text-left">
              <FileText className="h-5 w-5 text-secure-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-base">How should I store encrypted files?</h3>
                <p className="text-sm text-muted-foreground">Recommendations for secure storage</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                After encrypting your sensitive data, you need to store it securely. Here are our
                recommendations:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Multiple locations:</strong> Store copies of your encrypted files in multiple
                  physical locations to protect against loss.
                </li>
                <li>
                  <strong>Use cloud storage wisely:</strong> Cloud storage is convenient but introduces
                  additional security considerations. Only upload encrypted files, never unencrypted
                  sensitive data.
                </li>
                <li>
                  <strong>Consider physical media:</strong> USB drives, external hard drives, or even
                  DVDs can be good options for storing encrypted backups.
                </li>
                <li>
                  <strong>Regular verification:</strong> Periodically verify that your encrypted files
                  are still accessible and that you can decrypt them.
                </li>
                <li>
                  <strong>Descriptive filenames:</strong> Use filenames that remind you what the file
                  contains without revealing sensitive information.
                </li>
                <li>
                  <strong>Password management:</strong> Ensure you have a secure system for remembering
                  or storing the passwords to your encrypted files.
                </li>
              </ul>
              <p>
                Remember that the security of your encrypted data is only as strong as both your
                encryption password and the security of the locations where you store the encrypted files.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQComponent;
