import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eraser, Copy, Upload, Lock, Unlock } from "lucide-react";
import { EncryptionOutput } from "./EncryptionOutput";
import { PasswordInput } from "./PasswordInput";
import { readCryptoSeedFile } from "@/lib/encryptionProcessing";

interface TextEncryptionProps {
  isEncrypting: boolean;
  isProcessing: boolean;
  textInput: string;
  password: string;
  showPassword: boolean;
  output: string;
  onTextChange: (text: string) => void;
  onPasswordChange: (password: string) => void;
  onTogglePassword: () => void;
  onProcess: () => void;
  onClearText: () => void;
  onClearPassword: () => void;
  onCopyOutput: () => void;
  onLoadCryptoSeedFile?: (content: string) => void;
}

export const TextEncryption: React.FC<TextEncryptionProps> = ({
  isEncrypting,
  isProcessing,
  textInput,
  password,
  showPassword,
  output,
  onTextChange,
  onPasswordChange,
  onTogglePassword,
  onProcess,
  onClearText,
  onClearPassword,
  onCopyOutput,
  onLoadCryptoSeedFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to handle .cryptoseed file loading
  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Security: File size limit (10MB max for .cryptoseed files)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      alert('File too large. Maximum size is 10MB.');
      return;
    }

    // Security: Strict file validation
    if (!file.name.endsWith('.cryptoseed')) {
      alert('Invalid file type. Please select a .cryptoseed file.');
      return;
    }

    // Security: MIME type validation (text/plain expected for .cryptoseed)
    if (file.type && !['text/plain', 'application/octet-stream', ''].includes(file.type)) {
      alert('Invalid file format. Please select a valid .cryptoseed file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content && onLoadCryptoSeedFile) {
        // Security: Additional content length validation
        if (content.length > maxFileSize) {
          alert('File content too large.');
          return;
        }
        
        const result = readCryptoSeedFile(content);
        if (result.isValid && result.content) {
          onLoadCryptoSeedFile(result.content);
        } else {
          // Security: Generic error message - no implementation details
          alert('Unable to load file. Please ensure it is a valid .cryptoseed file.');
        }
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    
    reader.readAsText(file);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper function to check if content has actual text
  const hasTextContent = (content: string): boolean => {
    return !!(content && content.trim().length > 0);
  };

  return (
    <>
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-gray-900">
            {isEncrypting ? "Text to Encrypt" : "Encrypted Text to Decrypt"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isEncrypting ? "Enter the text you want to encrypt." : "Paste the encrypted text that you want to decrypt."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="textInput" className="text-gray-700">
                  {isEncrypting ? "Plain Text" : "Encrypted Text"}
                </Label>
                <Button 
                  onClick={onClearText} 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3 text-xs"
                >
                  <Eraser className="h-3 w-3 mr-1.5" />
                  <span>Clear</span>
                </Button>
            </div>
            
            <div className="w-full overflow-hidden">
              {isEncrypting ? (
                <Textarea
                  id="textInput"
                  value={textInput}
                  onChange={(e) => onTextChange(e.target.value)}
                  placeholder="Enter your text to encrypt..."
                  className="w-full h-32 p-3 border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm placeholder:text-xs placeholder:text-gray-400"
                />
              ) : (
                <Textarea
                  id="encryptedTextInput"
                  value={textInput}
                  onChange={(e) => onTextChange(e.target.value)}
                  placeholder="Paste your encrypted text here..."
                  className="w-full h-32 p-3 border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm placeholder:text-xs placeholder:text-gray-400"
                />
              )}
            </div>
            
            {!isEncrypting && onLoadCryptoSeedFile && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Load .cryptoseed file
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".cryptoseed"
                  onChange={handleFileLoad}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>
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
            disabled={isProcessing || !hasTextContent(textInput) || !password}
            onClick={onProcess}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                {isEncrypting ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
                {isEncrypting ? "Encrypt Text" : "Decrypt Text"}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Encryption Output */}
      {output && isEncrypting && (
        <EncryptionOutput 
          output={output} 
          isEncrypting={isEncrypting} 
          onCopy={onCopyOutput} 
        />
      )}
      
      {/* Decryption Output */}
      {output && !isEncrypting && (
        <Card className="mt-6 bg-white border border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <Unlock className="h-5 w-5" />
                Decrypted Content
              </CardTitle>
              <Button 
                onClick={onCopyOutput} 
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                aria-label="Copy Decrypted Content"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-50 rounded-md border border-green-200">
              <Textarea
                value={textInput}
                readOnly
                className="w-full h-32 p-3 border border-gray-200 rounded-md resize-none bg-green-50"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
