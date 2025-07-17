import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useEncryption } from "@/hooks/use-encryption";
import { isWebCryptoSupported } from "@/lib/encryptionV3";
import { processSeedPhrase, processText, processFile, downloadFile } from "@/lib/encryptionProcessing";
import { useNavigate } from "react-router-dom";
import { SeedPhraseEncryption } from "./SeedPhraseEncryption";
import { TextEncryption } from "./TextEncryption";
import { FileEncryption } from "./FileEncryption";
import { File, FileText, Sprout, AlertCircle, Lock, LockOpen, Shield, WifiOff, HelpCircle } from "lucide-react";

// Helper function to convert between Tiptap JSON and string for encryption
const convertTiptapForEncryption = (content: any, isEncrypting: boolean): string => {
  if (isEncrypting) {
    // For encryption: convert Tiptap JSON to string
    if (typeof content === 'string') return content;
    if (content && typeof content === 'object') {
      return JSON.stringify(content);
    }
    return '';
  } else {
    // For decryption: content should be the encrypted string (base64)
    if (typeof content === 'string') return content;
    // If it's still a Tiptap object, try to extract text content
    if (content && typeof content === 'object' && content.content) {
      // Extract plain text from Tiptap structure for decryption
      const extractText = (node: any): string => {
        if (node.text) return node.text;
        if (node.content && Array.isArray(node.content)) {
          return node.content.map(extractText).join('');
        }
        return '';
      };
      return content.content.map(extractText).join('');
    }
    return '';
  }
};

// Helper function to convert decrypted string back to Tiptap JSON
const convertDecryptedToTiptap = (decryptedString: string): any => {
  try {
    // Try to parse as JSON (if it was originally rich text)
    const parsed = JSON.parse(decryptedString);
    // Validate it looks like Tiptap content
    if (parsed && typeof parsed === 'object' && parsed.type === 'doc') {
      return parsed;
    }
    // If not valid Tiptap JSON, return as plain text in Tiptap format
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: decryptedString
            }
          ]
        }
      ]
    };
  } catch {
    // If JSON parsing fails, treat as plain text
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: decryptedString
            }
          ]
        }
      ]
    };
  }
};

// Helper function to convert Tiptap JSON to readable text for output display
const convertTiptapToReadableText = (tiptapContent: any): string => {
  if (!tiptapContent || !tiptapContent.content) {
    return '';
  }

  const processNode = (node: any): string => {
    if (node.type === 'text') {
      return node.text || '';
    }
    
    if (node.type === 'paragraph') {
      const content = node.content ? node.content.map(processNode).join('') : '';
      return content + '\n';
    }
    
    if (node.type === 'bulletList') {
      const items = node.content ? node.content.map((item: any) => {
        const text = item.content ? item.content.map(processNode).join('').trim() : '';
        return `• ${text}`;
      }).join('\n') : '';
      return items + '\n';
    }
    
    if (node.type === 'orderedList') {
      const items = node.content ? node.content.map((item: any, index: number) => {
        const text = item.content ? item.content.map(processNode).join('').trim() : '';
        return `${index + 1}. ${text}`;
      }).join('\n') : '';
      return items + '\n';
    }
    
    if (node.type === 'taskList') {
      const items = node.content ? node.content.map((item: any) => {
        const text = item.content ? item.content.map(processNode).join('').trim() : '';
        const checked = item.attrs?.checked ? '☑' : '☐';
        return `${checked} ${text}`;
      }).join('\n') : '';
      return items + '\n';
    }
    
    if (node.type === 'listItem' || node.type === 'taskItem') {
      return node.content ? node.content.map(processNode).join('') : '';
    }
    
    // Handle other node types
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(processNode).join('');
    }
    
    return '';
  };

  const result = tiptapContent.content.map(processNode).join('').trim();
  return result;
};

export interface EncryptionContainerProps {
  initialEncrypting?: boolean;
  initialCipher?: string | undefined;
}

const EncryptionContainer = ({ initialEncrypting = true, initialCipher }: EncryptionContainerProps) => {
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [hasUsedInitialCipher, setHasUsedInitialCipher] = useState(false);
  
  const {
    mode, 
    isEncrypting, 
    isProcessing,
    password,
    showPassword,
    output,
    textInput,
    seedPhrase,
    selectedFile,
    fileInputRef,
    setMode,
    setIsEncrypting,
    setIsProcessing,
    setPassword,
    setOutput,
    setTextInput,
    setSeedPhrase,
    handleFileSelect,
    clearFileSelection,
    togglePasswordVisibility,
    clearPassword,
    copyToClipboard,
    copyFormattedContent,
    clearTextInput,
    clearSeedPhrase,
    loadCryptoSeedFile,
    toast
  } = useEncryption(initialEncrypting);

  // Sync isEncrypting state with initialEncrypting prop if it changes (e.g., after hash detected)
  useEffect(() => {
    setIsEncrypting(initialEncrypting ?? true);
  }, [initialEncrypting, setIsEncrypting]);

  // Prefill the cipher into the text input if provided (only once per initialCipher)
  useEffect(() => {
    console.log('Prefill effect triggered:', {
      initialCipher: initialCipher ? initialCipher.substring(0, 50) + '...' : 'none',
      hasUsedInitialCipher,
      isEncrypting,
      initialEncrypting
    });
    
    if (typeof initialCipher === 'string' && initialCipher.length > 0 && !hasUsedInitialCipher) {
      console.log('Setting initial cipher:', initialCipher.substring(0, 50) + '...'); // Debug log
      
      // Use setTimeout to ensure this runs after all other effects have completed
      setTimeout(() => {
        console.log('Executing prefill after timeout');
        setMode('text');
        
        // For decrypt mode, set the cipher as a plain string (not Tiptap format)
        // Use initialEncrypting instead of isEncrypting to avoid timing issues
        if (!initialEncrypting) {
          console.log('Setting textInput for decrypt mode');
          setTextInput(initialCipher);
        } else {
          console.log('Setting textInput for encrypt mode');
          // For encrypt mode, convert to Tiptap format
          const tiptapContent = {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: initialCipher
                  }
                ]
              }
            ]
          };
          setTextInput(tiptapContent);
        }
        setHasUsedInitialCipher(true); // Mark as used after successful prefill
      }, 0);
    }
    // Remove isEncrypting from dependencies to avoid timing issues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCipher, setMode, setTextInput, initialEncrypting, hasUsedInitialCipher, setHasUsedInitialCipher]);
  
  const navigate = useNavigate();

  // Navigate to FAQ page
  const goToFAQ = () => {
    navigate('/?faq=true');
  };

  // Process seed phrase encryption or decryption
  const handleProcessSeedPhrase = async () => {
    setIsProcessing(true);
    try {
      const { result, successMessage } = await processSeedPhrase(seedPhrase, password, isEncrypting, undefined);
      setOutput(result);
      toast({
        title: isEncrypting ? "Encryption successful" : "Decryption successful",
        description: successMessage
      });
    } catch (error) {
      toast({
        title: "Process failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Process text encryption or decryption
  const handleProcessText = async () => {
    setIsProcessing(true);
    try {
      // Convert textInput to string format for encryption/decryption
      const textForProcessing = convertTiptapForEncryption(textInput, isEncrypting);
      
      const { result, successMessage } = await processText(textForProcessing, password, isEncrypting, undefined);
      
      // If decrypting, convert the result back to Tiptap format and update textInput
      if (!isEncrypting) {
        const tiptapContent = convertDecryptedToTiptap(result);
        setTextInput(tiptapContent);
        // For output display, convert to readable formatted text
        const readableText = convertTiptapToReadableText(tiptapContent);
        setOutput(readableText || result); // Fallback to raw result if conversion fails
      } else {
        setOutput(result);
      }
      
      toast({
        title: isEncrypting ? "Encryption successful" : "Decryption successful",
        description: successMessage
      });
    } catch (error) {
      toast({
        title: "Process failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Process file encryption or decryption
  const handleProcessFile = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    try {
      const { data, fileName, successMessage } = await processFile(selectedFile, password, isEncrypting);
      
      // Download the encrypted/decrypted file
      downloadFile(data, fileName);
      
      toast({
        title: isEncrypting ? "Encryption successful" : "Decryption successful",
        description: successMessage
      });
      
      // Reset file input
      clearFileSelection();
    } catch (error) {
      toast({
        title: "Process failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if Web Crypto API is supported by the browser
  const cryptoSupported = isWebCryptoSupported();
  
  // If Web Crypto API is not supported, show an error message
  if (!cryptoSupported) {
    return (
      <div className="satoshi-container my-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your browser doesn't support the Web Crypto API, which is required for secure encryption.
            Please use a modern browser like Chrome, Firefox, Safari, or Edge.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Main render method for the Encryption Component
  return (
    <div className="satoshi-container px-4 md:px-0 py-10 bg-white">
      {/* Mobile-First Header - Clean and Simple */}
      <div className="mb-8">
        {/* Primary Toggle - Mobile Optimized */}
        <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <Switch 
              id="encrypt-mode" 
              checked={isEncrypting} 
              onCheckedChange={setIsEncrypting} 
              className="data-[state=checked]:bg-secure-500" 
            />
            <div className="flex items-center gap-2">
              {isEncrypting ? <Lock className="h-5 w-5 text-secure-500" /> : <LockOpen className="h-5 w-5 text-gray-500" />}
              <span className="text-xl font-heading font-bold text-gray-900">
                {isEncrypting ? "Encrypt" : "Decrypt"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Secondary Info - Collapsible on Mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          {/* Algorithm Info - Compact Design */}
          <Popover open={showSecurityInfo} onOpenChange={setShowSecurityInfo}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-auto p-2 text-xs hover:bg-gray-100 rounded-md"
                onClick={() => setShowSecurityInfo(!showSecurityInfo)}
              >
                <Badge variant="outline" className="text-xs flex items-center gap-1 bg-secure-100 text-secure-800 border-secure-200 hover:bg-secure-200 cursor-pointer transition-colors">
                  <Shield className="h-3 w-3" />
                  <span className="hidden sm:inline">Argon2id + ChaCha20-Poly1305</span>
                  <span className="sm:hidden">Argon2id + ChaCha20-Poly1305</span>
                  <HelpCircle className="h-3 w-3 ml-1" />
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" side="bottom" align="center">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <h4 className="font-semibold text-sm">Future-Proof Encryption (V3)</h4>
                  <Badge variant="secondary" className="text-xs">Current Standard</Badge>
                </div>
                
                <div className="text-xs text-gray-600">
                  <p className="mb-2 font-medium">ChaCha20-Poly1305 + Argon2id key derivation</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-green-600">✓</span>
                      <span>Memory-hard KDF</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-green-600">✓</span>
                      <span>Post-quantum resistant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-green-600">✓</span>
                      <span>OWASP recommended</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-green-600">✓</span>
                      <span>Maximum security</span>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Offline Badge - Simplified */}
          <Badge variant="outline" className="text-xs flex items-center gap-1 bg-gray-200 text-gray-800 border-gray-300">
            <WifiOff className="h-3 w-3" />
            <span className="hidden sm:inline">Offline recommended</span>
            <span className="sm:hidden">Offline recommended</span>
          </Badge>
          
          {/* Help Button - Mobile Optimized */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-300/50 p-0">
                <HelpCircle className="h-4 w-4 text-gray-700" />
                <span className="sr-only">Help</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3 text-sm">
              <p className="font-medium mb-2">Why use this offline?</p>
              <p className="text-gray-600 mb-3">Using encryption tools offline adds an additional layer of security by preventing potential network-based attacks.</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={goToFAQ} 
                className="w-full justify-start"
              >
                <HelpCircle className="h-3.5 w-3.5 mr-2" /> 
                Read more in FAQ
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Tabs for different encryption modes */}
      <Tabs 
        defaultValue="text" 
        value={mode} 
        onValueChange={v => setMode(v as "seedphrase" | "text" | "file")} 
        className="mt-2"
      >
        {/* Tab selection list */}
        <TabsList className="mb-4 bg-secure-50 p-1 border border-secure-100 shadow-sm rounded-full">
          <TabsTrigger 
            value="text" 
            className="flex items-center gap-1.5 rounded-full data-[state=active]:bg-secure-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger 
            value="file" 
            className="flex items-center gap-1.5 rounded-full data-[state=active]:bg-secure-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            <File className="h-3.5 w-3.5" />
            <span>File</span>
          </TabsTrigger>
          <TabsTrigger 
            value="seedphrase" 
            className="flex items-center gap-1.5 rounded-full data-[state=active]:bg-secure-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            <Sprout className="h-3.5 w-3.5" />
            <span>Seed Phrase</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab content for Seed Phrase encryption/decryption */}
        <TabsContent value="seedphrase">
          <SeedPhraseEncryption
            isEncrypting={isEncrypting}
            isProcessing={isProcessing}
            seedPhrase={seedPhrase}
            password={password}
            showPassword={showPassword}
            output={output}
            onSeedPhraseChange={setSeedPhrase}
            onPasswordChange={setPassword}
            onTogglePassword={togglePasswordVisibility}
            onProcess={handleProcessSeedPhrase}
            onClearPassword={clearPassword}
            onClearSeedPhrase={clearSeedPhrase}
            onCopyOutput={copyToClipboard}
          />
        </TabsContent>

        {/* Tab content for Text encryption/decryption */}
        <TabsContent value="text">
          <TextEncryption
            isEncrypting={isEncrypting}
            isProcessing={isProcessing}
            textInput={textInput}
            password={password}
            showPassword={showPassword}
            output={output}
            onTextChange={setTextInput}
            onPasswordChange={setPassword}
            onTogglePassword={togglePasswordVisibility}
            onProcess={handleProcessText}
            onClearText={clearTextInput}
            onClearPassword={clearPassword}
            onCopyOutput={copyToClipboard}
            onCopyFormattedOutput={copyFormattedContent}
            onLoadCryptoSeedFile={loadCryptoSeedFile}
          />
        </TabsContent>

        {/* Tab content for File encryption/decryption */}
        <TabsContent value="file">
          <FileEncryption
            isEncrypting={isEncrypting}
            isProcessing={isProcessing}
            selectedFile={selectedFile}
            password={password}
            showPassword={showPassword}
            fileInputRef={fileInputRef}
            onFileSelect={handleFileSelect}
            onPasswordChange={setPassword}
            onTogglePassword={togglePasswordVisibility}
            onProcess={handleProcessFile}
            onClearFile={clearFileSelection}
            onClearPassword={clearPassword}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EncryptionContainer;
