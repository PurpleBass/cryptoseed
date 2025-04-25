
import React, { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { encryptMessage, decryptMessage, encryptFile, decryptFile, isWebCryptoSupported } from "@/lib/encryption";
import { File, FileText, Sprout, AlertCircle, Lock, LockOpen, Shield, WifiOff, HelpCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SeedPhraseEncryption } from "./encryption/SeedPhraseEncryption";
import { TextEncryption } from "./encryption/TextEncryption";
import { FileEncryption } from "./encryption/FileEncryption";

const EncryptionComponent = () => {
  const [mode, setMode] = useState<"seedphrase" | "text" | "file">("seedphrase");
  const [textInput, setTextInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [output, setOutput] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [seedPhrase, setSeedPhrase] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    setOutput("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [isEncrypting]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const formatSeedPhrase = (phrase: string): string => {
    // Simple function to format seed phrases nicely
    return phrase.trim();
  };

  const processSeedPhrase = async () => {
    if (!seedPhrase.trim() || !password.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a seed phrase and a password",
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);
    try {
      if (isEncrypting) {
        const encrypted = await encryptMessage(seedPhrase, password);
        setOutput(encrypted);
        toast({
          title: "Encryption successful",
          description: "Your seed phrase has been encrypted"
        });
      } else {
        const decrypted = await decryptMessage(seedPhrase, password);
        setOutput(formatSeedPhrase(decrypted));
        toast({
          title: "Decryption successful",
          description: "Your seed phrase has been decrypted"
        });
      }
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

  const processText = async () => {
    if (!textInput.trim() || !password.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both text and a password",
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);
    try {
      if (isEncrypting) {
        const encrypted = await encryptMessage(textInput, password);
        setOutput(encrypted);
        toast({
          title: "Encryption successful",
          description: "Your text has been encrypted"
        });
      } else {
        const decrypted = await decryptMessage(textInput, password);
        setOutput(formatSeedPhrase(decrypted));
        toast({
          title: "Decryption successful",
          description: "Your text has been decrypted"
        });
      }
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

  const processFile = async () => {
    if (!selectedFile || !password.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file and provide a password",
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);
    try {
      if (isEncrypting) {
        const {
          encryptedData,
          fileName
        } = await encryptFile(selectedFile, password);
        const url = URL.createObjectURL(encryptedData);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({
          title: "Encryption successful",
          description: "File has been encrypted and downloaded"
        });
      } else {
        const {
          decryptedData,
          fileName
        } = await decryptFile(selectedFile, password);
        const url = URL.createObjectURL(decryptedData);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({
          title: "Decryption successful",
          description: "File has been decrypted and downloaded"
        });
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedFile(null);
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

  const clearFileSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const goToFAQ = () => {
    navigate('/?faq=true');
  };

  const cryptoSupported = isWebCryptoSupported();
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

  return (
    <div className="satoshi-container px-4 md:px-0 py-10 bg-white">
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-center bg-gray-50 p-3 rounded-lg space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Switch id="encrypt-mode" checked={isEncrypting} onCheckedChange={setIsEncrypting} className="data-[state=checked]:bg-secure-500" />
              <div className="flex items-center">
                {isEncrypting ? <Lock className="h-4 w-4 mr-2 text-secure-500" /> : <LockOpen className="h-4 w-4 mr-2 text-gray-500" />}
                <span className="text-lg font-heading font-bold text-gray-900">
                  {isEncrypting ? "Encrypt" : "Decrypt"}
                </span>
                <Badge variant="outline" className="ml-2 text-xs flex items-center gap-1 bg-secure-100 text-secure-800 border-secure-200">
                  <Shield className="h-3 w-3" />
                  <span>AES-256</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="text-xs flex items-center gap-1 bg-gray-200 text-gray-800 border-gray-300">
            <WifiOff className="h-3 w-3" />
            <span>Offline recommended</span>
          </Badge>
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

      <Tabs defaultValue="seedphrase" value={mode} onValueChange={v => setMode(v as "seedphrase" | "text" | "file")} className="mt-2">
        <TabsList className="mb-4 bg-secure-50 p-1 border border-secure-100 shadow-sm rounded-full">
          <TabsTrigger value="seedphrase" className="flex items-center gap-1.5 rounded-full data-[state=active]:bg-secure-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
            <Sprout className="h-3.5 w-3.5" />
            <span>Seed Phrase</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-1.5 rounded-full data-[state=active]:bg-secure-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
            <FileText className="h-3.5 w-3.5" />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger value="file" className="flex items-center gap-1.5 rounded-full data-[state=active]:bg-secure-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
            <File className="h-3.5 w-3.5" />
            <span>File</span>
          </TabsTrigger>
        </TabsList>

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
            onTogglePassword={() => setShowPassword(!showPassword)}
            onProcess={processSeedPhrase}
            onClearPassword={() => setPassword("")}
            onClearSeedPhrase={() => setSeedPhrase("")}
            onCopyOutput={() => {
              navigator.clipboard.writeText(output);
              toast({
                title: "Copied to clipboard",
                description: "The output has been copied to your clipboard"
              });
            }}
          />
        </TabsContent>

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
            onTogglePassword={() => setShowPassword(!showPassword)}
            onProcess={processText}
            onClearText={() => setTextInput("")}
            onClearPassword={() => setPassword("")}
            onCopyOutput={() => {
              navigator.clipboard.writeText(output);
              toast({
                title: "Copied to clipboard",
                description: "The output has been copied to your clipboard"
              });
            }}
          />
        </TabsContent>

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
            onTogglePassword={() => setShowPassword(!showPassword)}
            onProcess={processFile}
            onClearFile={clearFileSelection}
            onClearPassword={() => setPassword("")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EncryptionComponent;
