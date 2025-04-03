
import React, { useState, useRef, useCallback } from "react";
import { Image, FileUp, Eye, Lock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// LSB steganography functions
const hideLSB = (
  imageData: Uint8ClampedArray,
  message: string
): Uint8ClampedArray => {
  // Convert message to binary
  const binaryMessage = message
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");

  // Add delimiter to know when the message ends
  const binaryMessageWithDelimiter = binaryMessage + "00000000";

  // Create a copy of the image data
  const newImageData = new Uint8ClampedArray(imageData);

  // Check if message can fit in the image (each pixel has 3 channels: R,G,B)
  const maxBits = Math.floor((newImageData.length / 4) * 3);
  if (binaryMessageWithDelimiter.length > maxBits) {
    throw new Error("Message too long for this image");
  }

  // Hide the message
  let bitIndex = 0;
  for (let i = 0; i < binaryMessageWithDelimiter.length; i++) {
    // Skip the alpha channel (every 4th byte)
    const dataIndex = Math.floor(bitIndex / 3) * 4 + (bitIndex % 3);
    
    // Replace the least significant bit
    if (binaryMessageWithDelimiter[i] === "1") {
      newImageData[dataIndex] = newImageData[dataIndex] | 1; // Set LSB to 1
    } else {
      newImageData[dataIndex] = newImageData[dataIndex] & ~1; // Set LSB to 0
    }
    
    bitIndex++;
  }

  return newImageData;
};

const extractLSB = (imageData: Uint8ClampedArray): string => {
  let binaryMessage = "";
  let currentByte = "";
  let result = "";
  let byteCount = 0;

  // Extract bits
  for (let i = 0; i < imageData.length; i += 4) {
    for (let j = 0; j < 3; j++) { // For R, G, B channels
      const lsb = imageData[i + j] & 1; // Get the least significant bit
      currentByte += lsb;
      
      if (currentByte.length === 8) {
        // Convert binary to decimal to character
        const charCode = parseInt(currentByte, 2);
        
        // Check if we've reached the delimiter (null character)
        if (charCode === 0) {
          return result;
        }
        
        result += String.fromCharCode(charCode);
        currentByte = "";
        byteCount++;
        
        // Safety check to prevent infinite loop
        if (byteCount > 10000) {
          return result;
        }
      }
    }
  }
  
  return result;
};

const SteganographyComponent: React.FC = () => {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [secretMessage, setSecretMessage] = useState("");
  const [extractedMessage, setExtractedMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<"hide" | "extract">("hide");
  const [isOpen, setIsOpen] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stegoFileInputRef = useRef<HTMLInputElement>(null);

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

  const hideMessage = useCallback(() => {
    if (!coverImage || !secretMessage) {
      toast.error("Please upload an image and enter a message");
      return;
    }

    setIsProcessing(true);
    
    // Small delay to allow UI to update
    setTimeout(() => {
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
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Hide message using LSB
          try {
            const newImageData = hideLSB(imageData.data, secretMessage);
            
            // Put modified image data back to canvas
            const modifiedImageData = new ImageData(
              newImageData,
              canvas.width,
              canvas.height
            );
            ctx.putImageData(modifiedImageData, 0, 0);
            
            // Update state with the steganographic image
            setStegoImage(canvas.toDataURL());
            toast.success("Message hidden successfully!");
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error("Failed to hide message");
            }
          }
          
          setIsProcessing(false);
        };
        
        img.src = coverImage;
      } catch (error) {
        setIsProcessing(false);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to process image");
        }
      }
    }, 100);
  }, [coverImage, secretMessage]);

  const extractMessage = useCallback(() => {
    if (!stegoImage) {
      toast.error("Please upload a steganographic image");
      return;
    }

    setIsProcessing(true);
    
    // Small delay to allow UI to update
    setTimeout(() => {
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
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Extract message
          try {
            const message = extractLSB(imageData.data);
            setExtractedMessage(message);
            toast.success("Message extracted successfully!");
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error("Failed to extract message");
            }
          }
          
          setIsProcessing(false);
        };
        
        img.src = stegoImage;
      } catch (error) {
        setIsProcessing(false);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to process image");
        }
      }
    }, 100);
  }, [stegoImage]);

  const downloadStegoImage = () => {
    if (!stegoImage) return;
    
    const link = document.createElement("a");
    link.href = stegoImage;
    link.download = "stego-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <span className="text-xs md:text-sm">Hide Message</span>
          </Button>
          
          <Button
            variant="ghost"
            className={`rounded-full ${
              mode === "extract" ? "bg-white shadow-sm" : ""
            }`}
            onClick={() => setMode("extract")}
          >
            <Eye className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
            <span className="text-xs md:text-sm">Extract Message</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {mode === "hide" ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Cover Image</CardTitle>
                <CardDescription>
                  Upload an image to hide your message in
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
                <CardTitle className="text-lg md:text-xl">Secret Message</CardTitle>
                <CardDescription>
                  Enter the message you want to hide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="secret-message">Message</Label>
                    <Textarea
                      id="secret-message"
                      placeholder="Type your secret message here..."
                      className="min-h-[120px]"
                      value={secretMessage}
                      onChange={(e) => setSecretMessage(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={hideMessage}
                  disabled={!coverImage || !secretMessage || isProcessing}
                  variant="secure"
                >
                  {isProcessing ? "Processing..." : "Hide Message"}
                </Button>
              </CardFooter>
            </Card>
            
            {stegoImage && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Steganographic Image</CardTitle>
                  <CardDescription>
                    Your message is now hidden in this image
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
                  Upload an image with a hidden message
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
                  disabled={!stegoImage || isProcessing}
                  variant="secure"
                >
                  {isProcessing ? "Processing..." : "Extract Message"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Extracted Message</CardTitle>
                <CardDescription>
                  The hidden message from the image
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
                          No message extracted yet
                        </p>
                      )}
                    </div>
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
              Steganography is the practice of hiding secret information within non-secret data or a physical object to avoid detection. This implementation uses the Least Significant Bit (LSB) technique.
            </p>
            
            <h3 className="font-medium mb-2">Least Significant Bit (LSB) Technique</h3>
            <p className="mb-3">
              LSB steganography works by replacing the least significant bit of each pixel's color channels (R,G,B) with bits from the secret message. Because changing the last bit causes only small changes to the color (1/256), these modifications are imperceptible to the human eye.
            </p>
            
            <h3 className="font-medium mb-2">Security Considerations</h3>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>This is a simple implementation for educational purposes</li>
              <li>Avoid using it for truly sensitive information</li>
              <li>The image format matters - PNG is lossless and preserves the hidden data</li>
              <li>Image compression or editing will likely destroy the hidden message</li>
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
