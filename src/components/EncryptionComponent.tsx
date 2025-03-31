import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ArrowDownUp, Copy, Download, Eye, EyeOff, FileUp, Lock, LockOpen, Shield, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { encryptMessage, decryptMessage, encryptFile, decryptFile, isWebCryptoSupported } from "@/lib/encryption";
import { Switch } from "@/components/ui/switch";
import SeedPhraseInput from "./SeedPhraseInput";

const EncryptionComponent = () => {
  const [mode, setMode] = useState<"seedphrase" | "text" | "file">("seedphrase");
  const [textInput, setTextInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [output, setOutput] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [seedPhrase, setSeedPhrase] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  const handleSeedPhraseChange = (phrase: string) => {
    setSeedPhrase(phrase);
  };

  const formatSeedPhrase = (phrase: string) => {
    if (!phrase.trim()) return "";
    
    // Check if this is likely a seed phrase (multiple words separated by spaces)
    const words = phrase.trim().split(/\s+/);
    if (words.length >= 12) {
      // Format as a numbered list with each word on a new line
      return words.map((word, index) => `${index + 1}. ${word}`).join('\n');
    }
    
    // If not a seed phrase, return as is
    return phrase;
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
        // Apply formatting to the decrypted text in case it's a seed phrase
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
        const { encryptedData, fileName } = await encryptFile(selectedFile, password);
        
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
        const { decryptedData, fileName } = await decryptFile(selectedFile, password);
        
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard",
      description: "The output has been copied to your clipboard"
    });
  };

  const toggleEncryptDecrypt = () => {
    setIsEncrypting(!isEncrypting);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
    <div className="satoshi-container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="encrypt-mode" 
                  checked={isEncrypting}
                  onCheckedChange={setIsEncrypting}
                  className="data-[state=checked]:bg-secure-500"
                />
                <div className="flex items-center">
                  {isEncrypting ? (
                    <Lock className="h-4 w-4 mr-2 text-secure-500" />
                  ) : (
                    <LockOpen className="h-4 w-4 mr-2 text-gray-500" />
                  )}
                  <span className="text-2xl font-heading font-bold text-gray-900">
                    {isEncrypting ? "Encrypt" : "Decrypt"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {isOnline ? (
              <Badge variant="outline" className="flex items-center gap-1 bg-red-100 text-red-800 border-red-300">
                <Wifi className="h-3 w-3" />
                <span>Online</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300">
                <WifiOff className="h-3 w-3" />
                <span>Offline (Recommended)</span>
              </Badge>
            )}
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 bg-secure-100 text-secure-800 border-secure-200"
            >
              <Shield className="h-3 w-3" />
              <span>AES-256 Encryption</span>
            </Badge>
          </div>
        </div>
      </div>

      <Tabs 
        defaultValue="seedphrase" 
        value={mode} 
        onValueChange={(v) => setMode(v as "seedphrase" | "text" | "file")}
        className="mt-4"
      >
        <TabsList className="mb-4 rounded-full bg-secure-50 p-1 border border-secure-100">
          <TabsTrigger 
            value="seedphrase" 
            className="rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-700 data-[state=active]:shadow-sm"
          >
            Seed Phrase
          </TabsTrigger>
          <TabsTrigger 
            value="text" 
            className="rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-700 data-[state=active]:shadow-sm"
          >
            Text
          </TabsTrigger>
          <TabsTrigger 
            value="file" 
            className="rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-700 data-[state=active]:shadow-sm"
          >
            File
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seedphrase">
          <Card className="satoshi-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-gray-900">
                {isEncrypting ? "Seed Phrase to Encrypt" : "Encrypted Seed Phrase to Decrypt"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isEncrypting 
                  ? "Enter your seed phrase words." 
                  : "Paste the encrypted text that you want to decrypt."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {isEncrypting ? (
                  <SeedPhraseInput onSeedPhraseChange={handleSeedPhraseChange} />
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="seedPhraseInput" className="text-gray-700">
                      Encrypted Seed Phrase
                    </Label>
                    <Textarea 
                      id="seedPhraseInput" 
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Paste the encrypted seed phrase here"
                      className="min-h-32 satoshi-input"
                    />
                  </div>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="seedPhrasePassword" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Input 
                      id="seedPhrasePassword" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="satoshi-input pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={togglePasswordVisibility}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                disabled={isProcessing || (isEncrypting ? !seedPhrase : !textInput) || !password} 
                onClick={isEncrypting ? processSeedPhrase : processText}
                className="w-full bg-satoshi-500 hover:bg-satoshi-600 text-white"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  isEncrypting ? "Encrypt Seed Phrase" : "Decrypt Seed Phrase"
                )}
              </Button>
            </CardFooter>
          </Card>

          {output && (
            <Card className="mt-6 satoshi-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-gray-900">
                    {isEncrypting ? "Encrypted Result" : "Decrypted Result"}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={copyToClipboard}
                    className="text-satoshi-500 hover:text-satoshi-600 hover:bg-satoshi-50"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-md overflow-auto max-h-96 border border-gray-100">
                  <pre className="whitespace-pre-wrap break-all text-gray-800 text-left">{output}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="text">
          <Card className="satoshi-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-gray-900">
                {isEncrypting ? "Text to Encrypt" : "Encrypted Text to Decrypt"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isEncrypting 
                  ? "Enter the text you want to encrypt." 
                  : "Paste the encrypted text that you want to decrypt."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="textInput" className="text-gray-700">
                    {isEncrypting ? "Plain Text" : "Encrypted Text"}
                  </Label>
                  <Textarea 
                    id="textInput" 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={isEncrypting 
                      ? "Enter the text you want to encrypt" 
                      : "Paste the encrypted text here"}
                    className="min-h-32 satoshi-input"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="satoshi-input pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={togglePasswordVisibility}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                disabled={isProcessing || !textInput || !password} 
                onClick={processText}
                className="w-full bg-satoshi-500 hover:bg-satoshi-600 text-white"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  isEncrypting ? "Encrypt Text" : "Decrypt Text"
                )}
              </Button>
            </CardFooter>
          </Card>

          {output && (
            <Card className="mt-6 satoshi-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-gray-900">
                    {isEncrypting ? "Encrypted Result" : "Decrypted Result"}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={copyToClipboard}
                    className="text-satoshi-500 hover:text-satoshi-600 hover:bg-satoshi-50"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-md overflow-auto max-h-96 border border-gray-100">
                  <pre className="whitespace-pre-wrap break-all text-gray-800 text-left">{output}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="file">
          <Card className="satoshi-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-gray-900">
                {isEncrypting ? "File to Encrypt" : "Encrypted File to Decrypt"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isEncrypting 
                  ? "Select the file you want to encrypt." 
                  : "Select the encrypted file that you want to decrypt."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fileUpload" className="text-gray-700">
                    {isEncrypting ? "Select File" : "Select Encrypted File"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      ref={fileInputRef}
                      id="fileUpload" 
                      type="file" 
                      onChange={handleFileSelect}
                      className="satoshi-input"
                    />
                  </div>
                  {selectedFile && (
                    <div className="text-sm text-gray-500 mt-2">
                      Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                    </div>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="filePassword" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Input 
                      id="filePassword" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="satoshi-input pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={togglePasswordVisibility}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                disabled={isProcessing || !selectedFile || !password} 
                onClick={processFile}
                className="w-full flex items-center gap-2 bg-satoshi-500 hover:bg-satoshi-600 text-white"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    {isEncrypting ? (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Encrypt & Download File</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Decrypt & Download File</span>
                      </>
                    )}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EncryptionComponent;
