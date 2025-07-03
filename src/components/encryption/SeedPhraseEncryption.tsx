import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eraser, Lock, Unlock } from "lucide-react";
import SeedPhraseInput from "../SeedPhraseInput";
import { EncryptionOutput } from "./EncryptionOutput";
import { PasswordInput } from "./PasswordInput";

interface SeedPhraseEncryptionProps {
  isEncrypting: boolean;
  isProcessing: boolean;
  seedPhrase: string;
  password: string;
  showPassword: boolean;
  output: string;
  onSeedPhraseChange: (phrase: string) => void;
  onPasswordChange: (password: string) => void;
  onTogglePassword: () => void;
  onProcess: () => void;
  onClearPassword: () => void;
  onClearSeedPhrase: () => void;
  onCopyOutput: () => void;
}

export const SeedPhraseEncryption: React.FC<SeedPhraseEncryptionProps> = ({
  isEncrypting,
  isProcessing,
  seedPhrase,
  password,
  showPassword,
  output,
  onSeedPhraseChange,
  onPasswordChange,
  onTogglePassword,
  onProcess,
  onClearPassword,
  onClearSeedPhrase,
  onCopyOutput,
}) => {
  return (
    <>
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-gray-900">
            {isEncrypting ? "Seed Phrase to Encrypt" : "Encrypted Seed Phrase to Decrypt"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isEncrypting ? "Enter your seed phrase words." : "Paste the encrypted text that you want to decrypt."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {isEncrypting ? (
              <div className="w-full overflow-hidden">
                <SeedPhraseInput 
                  key={`seed-input-${isEncrypting ? 'encrypt' : 'decrypt'}`}
                  onSeedPhraseChange={onSeedPhraseChange} 
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="seedPhraseInput" className="text-gray-700">
                    Encrypted Seed Phrase
                  </Label>
                  <Button 
                    onClick={onClearSeedPhrase} 
                    variant="outline" 
                    size="sm" 
                    className="text-gray-500 hover:text-gray-600 hover:bg-gray-50 border-gray-200"
                  >
                    <Eraser className="h-4 w-4 mr-2" />
                    <span>Clear</span>
                  </Button>
                </div>
                <textarea
                  id="seedPhraseInput"
                  value={seedPhrase}
                  onChange={(e) => onSeedPhraseChange(e.target.value)}
                  placeholder="Paste the encrypted seed phrase here"
                  className="w-full h-32 p-3 border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm placeholder:text-sm placeholder:text-gray-400"
                />
              </div>
            )}
            
            <PasswordInput
              password={password}
              showPassword={showPassword}
              onPasswordChange={onPasswordChange}
              onTogglePassword={onTogglePassword}
              onClearPassword={onClearPassword}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            disabled={isProcessing || (!seedPhrase) || !password} 
            onClick={onProcess} 
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </>
            ) : isEncrypting ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Encrypt Seed Phrase
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Decrypt Seed Phrase
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {output && (
        <EncryptionOutput 
          output={output} 
          isEncrypting={isEncrypting} 
          onCopy={onCopyOutput} 
          mode="seedphrase"
        />
      )}
    </>
  );
};
