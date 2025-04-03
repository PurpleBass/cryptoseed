
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Image, FileUp, Eye, Lock, Download, Key, Upload, File, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  hideMessageWithAllTechniques,
  extractMessageWithAllTechniques,
  prepareFileForSteganography,
  extractFileFromSteganography
} from "@/lib/steganography";

type InputType = "text" | "file";

const SteganographyComponent: React.FC = () => {
  // General state
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [secretMessage, setSecretMessage] = useState("");
  const [extractedMessage, setExtractedMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<"hide" | "extract">("hide");
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [seed, setSeed] = useState<number>(0);
  const [inputType, setInputType] = useState<InputType>("text");
  const [secretFile, setSecretFile] = useState<File | null>(null);
  const [extractedFile, setExtractedFile] = useState<{ data: Blob, fileType: string, isFile: boolean } | null>(null);
  
  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stegoFileInputRef = useRef<HTMLInputElement>(null);
  const secretFileInputRef = useRef<HTMLInputElement>(null);

  // Generate a random seed when component mounts
  useEffect(() => {
    generateRandomSeed();
  }, []);

  // Generate a random seed
  const generateRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);
    console.log(`Generated random seed: ${newSeed}`);
  };

  // Handle cover image upload
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              setCoverImage(canvas.toDataURL());
            }
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle stego image upload
  const handleStegoImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              setStegoImage(canvas.toDataURL());
            }
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle secret file upload
  const handleSecretFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSecretFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  // Hide message in the cover image
  const hideMessage = useCallback(async () => {
    if (!coverImage) {
      toast.error("Please upload a cover image");
      return;
    }

    if (inputType === 'text' && !secretMessage) {
      toast.error("Please enter a secret message");
      return;
    }

    if (inputType === 'file' && !secretFile) {
      toast.error("Please select a secret file");
      return;
    }

    if (!password) {
      toast.error("Please enter a password for encryption");
      return;
    }

    setIsProcessing(true);
    
    // Small delay to allow UI to update
    setTimeout(async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error("Canvas not available");
        }
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Canvas context not available");
        }
        
        // Load the cover image
        const img = new Image();
        img.onload = async () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Prepare data based on input type
          let dataToHide = "";
          
          try {
            if (inputType === 'file' && secretFile) {
              // Prepare file data
              dataToHide = await prepareFileForSteganography(secretFile, password);
            } else {
              // For text, we'll use the secret message directly
              dataToHide = secretMessage;
            }
            
            // Use all techniques for maximum security
            const newImageData = await hideMessageWithAllTechniques(
              imageData.data,
              dataToHide,
              password,
              seed
            );
            
            // Put modified image data back to canvas
            const modifiedImageData = new ImageData(
              newImageData,
              canvas.width,
              canvas.height
            );
            ctx.putImageData(modifiedImageData, 0, 0);
            
            // Update state with the steganographic image
            setStegoImage(canvas.toDataURL());
            toast.success("Secret data hidden successfully!");
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error("Failed to hide secret data");
            }
            console.error("Error hiding data:", error);
          } finally {
            setIsProcessing(false);
          }
        };
        
        img.src = coverImage;
      } catch (error) {
        setIsProcessing(false);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to process image");
        }
        console.error("Error processing image:", error);
      }
    }, 100);
  }, [coverImage, secretMessage, secretFile, password, seed, inputType]);

  // Extract message from the stego image
  const extractMessage = useCallback(async () => {
    if (!stegoImage) {
      toast.error("Please upload a steganographic image");
      return;
    }

    if (!password) {
      toast.error("Please enter the password used for encryption");
      return;
    }

    setIsProcessing(true);
    
    // Small delay to allow UI to update
    setTimeout(async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error("Canvas not available");
        }
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Canvas context not available");
        }
        
        // Load the stego image
        const img = new Image();
        img.onload = async () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          try {
            // Extract using all techniques
            const extractedData = await extractMessageWithAllTechniques(
              imageData.data,
              "all", // Always use all techniques
              password,
              seed
            );
            
            try {
              // Try to process as a file first
              const fileData = await extractFileFromSteganography(extractedData, password);
              
              if (fileData.isFile) {
                // It's a file, save the extracted file data
                setExtractedFile(fileData);
                setExtractedMessage(`Extracted ${fileData.fileType} file successfully.`);
              } else {
                // It's just text
                setExtractedMessage(fileData.data.text ? await fileData.data.text() : "");
                setExtractedFile(null);
              }
              
              toast.success("Data extracted successfully!");
            } catch (error) {
              // If file extraction fails, try as plain text
              setExtractedMessage(extractedData);
              setExtractedFile(null);
              toast.success("Message extracted successfully!");
            }
            
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error("Failed to extract message");
            }
            console.error("Error extracting message:", error);
          } finally {
            setIsProcessing(false);
          }
        };
        
        img.src = stegoImage;
      } catch (error) {
        setIsProcessing(false);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to process image");
        }
        console.error("Error processing image:", error);
      }
    }, 100);
  }, [stegoImage, password, seed]);

  // Download stego image
  const downloadStegoImage = () => {
    if (!stegoImage) return;
    
    const link = document.createElement("a");
    link.href = stegoImage;
    link.download = "stego-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download extracted file
  const downloadExtractedFile = () => {
    if (!extractedFile) return;
    
    const url = URL.createObjectURL(extractedFile.data);
    const link = document.createElement("a");
    link.href = url;
    
    // Set filename based on file type
    let filename = "extracted";
    const fileType = extractedFile.fileType;
    
    if (fileType === "image/jpeg") filename += ".jpg";
    else if (fileType === "image/png") filename += ".png";
    else if (fileType === "application/pdf") filename += ".pdf";
    else if (fileType === "text/plain") filename += ".txt";
    else if (fileType.includes("image")) filename += "." + fileType.split("/")[1];
    else filename += "." + fileType.split("/")[1];
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="satoshi-container max-w-4xl p-2 md:p-4 lg:p-6 mx-auto">
      <div className="mb-4 bg-secure-50 p-1 border border-secure-100 shadow-sm rounded-full">
        <div className="flex gap-1 md:gap-2 justify-center">
          <Button
            variant="ghost"
            className={`rounded-full ${
              mode === "hide" ? "bg-white shadow-sm" : ""
            }`}
            onClick={() => setMode("hide")}
          >
            <Lock className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
            <span className="text-xs md:text-sm">Hide Data</span>
          </Button>
          
          <Button
            variant="ghost"
            className={`rounded-full ${
              mode === "extract" ? "bg-white shadow-sm" : ""
            }`}
            onClick={() => setMode("extract")}
          >
            <Eye className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
            <span className="text-xs md:text-sm">Extract Data</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6 justify-center">
        <div className="flex items-center border rounded-lg p-2 bg-gray-50">
          <Lock className="h-4 w-4 mr-2 text-secure-600" />
          <Label htmlFor="stego-password" className="text-sm mr-2 whitespace-nowrap">Password:</Label>
          <Input
            id="stego-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter encryption password"
            className="h-8 min-w-40 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {mode === "hide" ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Cover Image</CardTitle>
                <CardDescription>
                  Upload an image to hide your data in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCoverImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {coverImage && (
                    <div className="relative aspect-video w-full max-h-[200px] border rounded-md overflow-hidden">
                      <img
                        src={coverImage}
                        alt="Cover"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Secret Data</CardTitle>
                <CardDescription>
                  Choose what to hide in the image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="text" value={inputType} onValueChange={(v) => setInputType(v as InputType)} className="w-full">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="text" className="flex-1">Text Message</TabsTrigger>
                    <TabsTrigger value="file" className="flex-1">File</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="secret-message">Secret Message</Label>
                      <Textarea
                        id="secret-message"
                        placeholder="Type your secret message here..."
                        className="min-h-[120px]"
                        value={secretMessage}
                        onChange={(e) => setSecretMessage(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="file" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="secret-file">Secret File</Label>
                      <div className="flex flex-col items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => secretFileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Select File
                        </Button>
                        <input
                          type="file"
                          id="secret-file"
                          ref={secretFileInputRef}
                          onChange={handleSecretFileUpload}
                          className="hidden"
                        />
                        
                        {secretFile && (
                          <div className="w-full p-2 border rounded bg-gray-50">
                            <p className="text-sm font-medium">{secretFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(secretFile.size / 1024).toFixed(2)} KB
                              {secretFile.type && ` • ${secretFile.type}`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={hideMessage}
                  disabled={!coverImage || (!secretMessage && !secretFile) || !password || isProcessing}
                  variant="secure"
                >
                  {isProcessing ? "Processing..." : "Hide Secret Data"}
                </Button>
              </CardFooter>
            </Card>
            
            {stegoImage && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Steganographic Image</CardTitle>
                  <CardDescription>
                    Your data is now hidden in this image using triple-layer protection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative aspect-video w-full max-h-[300px] border rounded-md overflow-hidden">
                      <img
                        src={stegoImage}
                        alt="Steganographic"
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <Button
                      variant="secure"
                      onClick={downloadStegoImage}
                      className="w-full md:w-auto"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Steganographic Image</CardTitle>
                <CardDescription>
                  Upload an image with hidden data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => stegoFileInputRef.current?.click()}
                    className="w-full"
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  <input
                    type="file"
                    ref={stegoFileInputRef}
                    onChange={handleStegoImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {stegoImage && (
                    <div className="relative aspect-video w-full max-h-[200px] border rounded-md overflow-hidden">
                      <img
                        src={stegoImage}
                        alt="Steganographic"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={extractMessage}
                  disabled={!stegoImage || !password || isProcessing}
                  variant="secure"
                >
                  {isProcessing ? "Processing..." : "Extract Hidden Data"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Extracted Data</CardTitle>
                <CardDescription>
                  The hidden data from the image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="border rounded-md p-4 min-h-[120px] bg-gray-50">
                      {extractedMessage ? (
                        <p className="text-gray-900">{extractedMessage}</p>
                      ) : (
                        <p className="text-gray-400 italic">
                          No data extracted yet
                        </p>
                      )}
                    </div>
                    
                    {extractedFile && (
                      <div className="flex justify-center mt-4">
                        <Button 
                          variant="outline" 
                          onClick={downloadExtractedFile}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download Extracted File</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <div className="mt-6 md:mt-8">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              {isOpen ? "Hide" : "Show"} Steganography Information
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 p-4 bg-gray-50 rounded-md text-sm">
            <h3 className="font-medium mb-2">What is Steganography?</h3>
            <p className="mb-3">
              Steganography is the practice of hiding secret information within non-secret data or a physical object to avoid detection. This application uses three advanced techniques combined for maximum security.
            </p>
            
            <h3 className="font-medium mb-2">Triple-Layer Steganography</h3>
            <p className="mb-3">
              This tool implements three different steganography techniques applied simultaneously for military-grade security:
            </p>
            
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li><strong>Least Significant Bit (LSB):</strong> Replaces the least significant bit of each pixel's color channels with bits from the secret data.</li>
              <li><strong>Sequential Color Cycle (SCC):</strong> Cycles through color channels in a pattern, making detection more difficult.</li>
              <li><strong>Uniform Distribution (UD):</strong> Uses a seed-based algorithm to spread data uniformly throughout the image.</li>
            </ul>
            
            <h3 className="font-medium mb-2">Password Protection</h3>
            <p className="mb-3">
              All data is encrypted with AES-256 encryption before being hidden in the image, adding an extra layer of security. Even if someone suspects steganography was used, they cannot extract the data without the password.
            </p>
            
            <h3 className="font-medium mb-2">Security Considerations</h3>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Always use a strong, unique password that you can remember</li>
              <li>The seed is automatically generated and encrypted along with your data</li>
              <li>The image format matters - PNG is lossless and preserves the hidden data</li>
              <li>Image compression or editing will likely destroy the hidden data</li>
              <li>This implementation uses all three techniques for maximum security</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default SteganographyComponent;
