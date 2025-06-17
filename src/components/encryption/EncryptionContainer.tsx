import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useEncryption } from "@/hooks/use-encryption";
import { isWebCryptoSupported } from "@/lib/encryption";
import { processSeedPhrase, processText, processFile, downloadFile } from "@/lib/encryptionProcessing";
import { useNavigate } from "react-router-dom";
import { SeedPhraseEncryption } from "./SeedPhraseEncryption";
import { TextEncryption } from "./TextEncryption";
import { FileEncryption } from "./FileEncryption";
import { File, FileText, Sprout, AlertCircle, Lock, LockOpen, Shield, WifiOff, HelpCircle } from "lucide-react";

const EncryptionContainer = () => {
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
    toast
  } = useEncryption();
  
  const navigate = useNavigate();

  // Navigate to FAQ page
  const goToFAQ = () => {
    navigate('/?faq=true');
  };

  // Process seed phrase encryption or decryption
  const handleProcessSeedPhrase = async () => {
    setIsProcessing(true);
    try {
      const { result, successMessage } = await processSeedPhrase(seedPhrase, password, isEncrypting);
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
      const { result, successMessage } = await processText(textInput, password, isEncrypting);
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
      {/* Header section with encryption/decryption mode toggle */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-center bg-gray-50 p-3 rounded-lg space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
        {/* Switch between encryption and decryption modes */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto justify-center">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
              <Switch 
                id="encrypt-mode" 
                checked={isEncrypting} 
                onCheckedChange={setIsEncrypting} 
                className="data-[state=checked]:bg-secure-500" 
              />
              <div className="flex items-center justify-center">
                {/* Show lock icon based on current mode */}
                {isEncrypting ? <Lock className="h-4 w-4 mr-2 text-secure-500" /> : <LockOpen className="h-4 w-4 mr-2 text-gray-500" />}
                <span className="text-lg font-heading font-bold text-gray-900">
                  {isEncrypting ? "Encrypt" : "Decrypt"}
                </span>
                {/* Badge showing encryption method */}
                <Badge variant="outline" className="ml-2 text-xs flex items-center gap-1 bg-secure-100 text-secure-800 border-secure-200">
                  <Shield className="h-3 w-3" />
                  <span>AES-256</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional information and offline recommendation */}
        <div className="flex gap-2 items-center justify-center sm:justify-start">
          <Badge variant="outline" className="text-xs flex items-center gap-1 bg-gray-200 text-gray-800 border-gray-300">
            <WifiOff className="h-3 w-3" />
            <span>Offline recommended</span>
          </Badge>
          {/* Popover with additional information */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full hover:bg-gray-300/50 p-0">
                <HelpCircle className="h-3.5 w-3.5 text-gray-700" />
                <span className="sr-only">Why offline recommended?</span>
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
        defaultValue="seedphrase" 
        value={mode} 
        onValueChange={v => setMode(v as "seedphrase" | "text" | "file")} 
        className="mt-2"
      >
        {/* Tab selection list */}
        <TabsList className="mb-4 bg-secure-50 p-1 border border-secure-100 shadow-sm rounded-full">
          <TabsTrigger 
            value="seedphrase" 
            className="flex items-center gap-1.5 rounded-full data-[state=active]:bg-secure-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            <Sprout className="h-3.5 w-3.5" />
            <span>Seed Phrase</span>
          </TabsTrigger>
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
