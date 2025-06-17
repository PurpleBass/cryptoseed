
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Key } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

/**
 * EncryptionVisual Component
 * 
 * Provides a visual representation of how the encryption process works.
 * This component uses simple illustrations and step-by-step explanations
 * to help users understand the encryption process visually.
 * 
 * @returns {JSX.Element} Visual diagram of the encryption process
 */
const EncryptionVisual = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      <h3 className="text-lg font-medium text-center mb-4">How Encryption Works</h3>
      
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
    </div>
  );
};

export default EncryptionVisual;
