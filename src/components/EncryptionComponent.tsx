
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ArrowDownUp, Copy, Download, FileUp, Lock, Shield, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { encryptMessage, decryptMessage, encryptFile, decryptFile, isWebCryptoSupported } from "@/lib/encryption";

const EncryptionComponent = () => {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [textInput, setTextInput] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Monitor online/offline status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Clear output when switching between encryption and decryption
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
        setOutput(decrypted);
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
        const { encryptedData, fileName } = await encryptFile(selectedFile, password);
        
        // Create a download link
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
        
        // Create a download link
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
      
      // Reset the file input
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

  const cryptoSupported = isWebCryptoSupported();

  if (!cryptoSupported) {
    return (
      <div className="container my-8">
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
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{isEncrypting ? "Encrypt" : "Decrypt"}</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleEncryptDecrypt} 
              title="Switch between Encrypt and Decrypt"
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            {isOnline ? (
              <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-800 border-yellow-300">
                <Wifi className="h-3 w-3" />
                <span>Online</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-800 border-green-300">
                <WifiOff className="h-3 w-3" />
                <span>Offline (Recommended)</span>
              </Badge>
            )}
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 bg-secure-100 text-secure-800 border-secure-300"
            >
              <Shield className="h-3 w-3" />
              <span>AES-256 Encryption</span>
            </Badge>
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex gap-2 items-center">
            <Lock className="h-5 w-5 text-secure-600" />
            <CardTitle>Password</CardTitle>
          </div>
          <CardDescription>
            Enter a strong password to {isEncrypting ? "encrypt" : "decrypt"} your data. 
            This password will be required to {isEncrypting ? "decrypt" : "encrypt"} the data later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="text" value={mode} onValueChange={(v) => setMode(v as "text" | "file")}>
        <TabsList className="mb-4">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="file">File</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>{isEncrypting ? "Text to Encrypt" : "Encrypted Text to Decrypt"}</CardTitle>
              <CardDescription>
                {isEncrypting 
                  ? "Enter the text you want to encrypt." 
                  : "Paste the encrypted text that you want to decrypt."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="textInput">
                    {isEncrypting ? "Plain Text" : "Encrypted Text"}
                  </Label>
                  <Textarea 
                    id="textInput" 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={isEncrypting 
                      ? "Enter the text you want to encrypt" 
                      : "Paste the encrypted text here"}
                    className="min-h-32"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                disabled={isProcessing || !textInput || !password} 
                onClick={processText}
                className="w-full bg-secure-600 hover:bg-secure-700"
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
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{isEncrypting ? "Encrypted Result" : "Decrypted Result"}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-md overflow-auto max-h-96">
                  <pre className="whitespace-pre-wrap break-all">{output}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>{isEncrypting ? "File to Encrypt" : "Encrypted File to Decrypt"}</CardTitle>
              <CardDescription>
                {isEncrypting 
                  ? "Select the file you want to encrypt." 
                  : "Select the encrypted file that you want to decrypt."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fileUpload">
                    {isEncrypting ? "Select File" : "Select Encrypted File"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      ref={fileInputRef}
                      id="fileUpload" 
                      type="file" 
                      onChange={handleFileSelect}
                    />
                  </div>
                  {selectedFile && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                disabled={isProcessing || !selectedFile || !password} 
                onClick={processFile}
                className="w-full flex items-center gap-2 bg-secure-600 hover:bg-secure-700"
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
