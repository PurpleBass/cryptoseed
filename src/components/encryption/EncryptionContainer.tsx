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
    if (process.env.NODE_ENV === 'development') {
      console.log('Prefill effect triggered:', {
        hasInitialCipher: !!initialCipher,
        hasUsedInitialCipher,
        isEncrypting,
        initialEncrypting
      });
    }
    
    if (typeof initialCipher === 'string' && initialCipher.length > 0 && !hasUsedInitialCipher) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Setting initial cipher'); // Removed sensitive content
      }
      
      // Use setTimeout to ensure this runs after all other effects have completed
      setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Executing prefill after timeout');
        }
        // Always set to text mode for URL sharing
        setMode('text');
        
        // Use setTimeout again to ensure mode is set before setting text
        setTimeout(() => {
          // For decrypt mode, set the cipher as a plain string
          // Use initialEncrypting instead of isEncrypting to avoid timing issues
          if (!initialEncrypting) {
            if (process.env.NODE_ENV === 'development') {
              console.log('Setting textInput for decrypt mode');
            }
            setTextInput(initialCipher);
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.log('Setting textInput for encrypt mode');
            }
            // For encrypt mode, just set the string directly
            setTextInput(initialCipher);
          }
          setHasUsedInitialCipher(true); // Mark as used after successful prefill
        }, 50);
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
      const { result, successMessage } = await processText(textInput, password, isEncrypting, undefined);
      
      // For both encryption and decryption, update the appropriate state
      if (!isEncrypting) {
        setTextInput(result);
      }
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
      {/* Modern Header Design - Capsule Style */}
      <div className="mb-8 space-y-6">
        {/* Primary Toggle - Modern Capsule Design */}
        <div className="flex justify-center">
          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-full px-4 sm:px-6 py-3 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              {isEncrypting ? <Lock className="h-5 w-5 text-green-600" /> : <LockOpen className="h-5 w-5 text-blue-600" />}
              <label htmlFor="encrypt-mode" className="text-base sm:text-lg font-semibold text-gray-900 cursor-pointer">
                {isEncrypting ? "Encrypt" : "Decrypt"}
              </label>
            </div>
            <Switch 
              id="encrypt-mode" 
              checked={isEncrypting} 
              onCheckedChange={setIsEncrypting} 
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-blue-500"
              aria-label={`Switch to ${isEncrypting ? 'decrypt' : 'encrypt'} mode`}
            />
          </div>
        </div>
        
        {/* Security Info Pills - Horizontal Compact Design */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Algorithm Info - Modern Pill Design */}
          <Popover open={showSecurityInfo} onOpenChange={setShowSecurityInfo}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => setShowSecurityInfo(!showSecurityInfo)}
              >
                <div className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-3 sm:px-4 py-2 transition-colors cursor-pointer">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    <span className="hidden sm:inline">Argon2id + ChaCha20-Poly1305</span>
                    <span className="sm:hidden">Argon2id + ChaCha20</span>
                  </span>
                  <HelpCircle className="h-3 w-3 opacity-70" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" side="bottom" align="center">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
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
          
          {/* Offline Badge with Integrated Help - Modern Pill Design */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-auto p-0 hover:bg-transparent"
              >
                <div className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-full px-3 sm:px-4 py-2 transition-colors cursor-pointer">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    <span className="hidden sm:inline">Offline recommended</span>
                    <span className="sm:hidden">Offline</span>
                  </span>
                  <HelpCircle className="h-3 w-3 opacity-70" />
                </div>
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
