import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eraser, Copy, Upload, Lock, Unlock } from "lucide-react";
import { EncryptionOutput } from "./EncryptionOutput";
import { PasswordInput } from "./PasswordInput";
import { LazySecureRichTextEditor } from "./LazySecureRichTextEditor";
import { readCryptoSeedFile } from "@/lib/encryptionProcessing";

interface TextEncryptionProps {
  isEncrypting: boolean;
  isProcessing: boolean;
  textInput: any;
  password: string;
  showPassword: boolean;
  output: string;
  onTextChange: (text: any) => void;
  onPasswordChange: (password: string) => void;
  onTogglePassword: () => void;
  onProcess: () => void;
  onClearText: () => void;
  onClearPassword: () => void;
  onCopyOutput: () => void;
  onCopyFormattedOutput?: (htmlContent: string, plainTextContent: string) => void;
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
  onCopyFormattedOutput,
  onLoadCryptoSeedFile,
}) => {
  const decryptionEditorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to copy decrypted content with formatting
  const handleCopyDecryptedContent = () => {
    if (decryptionEditorRef.current && onCopyFormattedOutput) {
      const htmlContent = decryptionEditorRef.current.getHTML();
      const plainTextContent = decryptionEditorRef.current.getText();
      onCopyFormattedOutput(htmlContent, plainTextContent);
    } else {
      // Fallback to regular copy if formatted copy is not available
      onCopyOutput();
    }
  };

  // Helper function to handle .cryptoseed file loading
  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a .cryptoseed file
    if (!file.name.endsWith('.cryptoseed')) {
      alert('Please select a .cryptoseed file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content && onLoadCryptoSeedFile) {
        const result = readCryptoSeedFile(content);
        if (result.isValid && result.content) {
          onLoadCryptoSeedFile(result.content);
        } else {
          alert(result.error || 'Failed to load .cryptoseed file');
        }
      }
    };
    reader.readAsText(file);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper function to check if content has actual text
  const hasTextContent = (content: any): boolean => {
    if (!content) return false;
    if (typeof content === 'string') return content.trim().length > 0;
    if (typeof content === 'object' && content.content) {
      // For Tiptap JSON, check if any content nodes have text
      const checkNode = (node: any): boolean => {
        if (node.text && node.text.trim().length > 0) return true;
        if (node.content && Array.isArray(node.content)) {
          return node.content.some(checkNode);
        }
        return false;
      };
      return Array.isArray(content.content) && content.content.some(checkNode);
    }
    return false;
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
                  className="text-gray-500 hover:text-gray-600 hover:bg-gray-50 border-gray-200"
                >
                  <Eraser className="h-4 w-4 mr-2" />
                  <span>Clear</span>
                </Button>
            </div>
            
            <div className="w-full overflow-hidden">
              {isEncrypting ? (
                <LazySecureRichTextEditor
                  value={textInput}
                  onChange={onTextChange}
                  editable={true}
                />
              ) : (
                <textarea
                  id="encryptedTextInput"
                  value={typeof textInput === 'string' ? textInput : ''}
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
                onClick={handleCopyDecryptedContent} 
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
              <LazySecureRichTextEditor
                value={textInput}
                onChange={() => {}} // No-op since it's read-only
                editable={false}
                onEditorReady={(editor: any) => {
                  decryptionEditorRef.current = editor;
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
