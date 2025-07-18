import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, Eraser, Lock } from "lucide-react";
import { PasswordInput } from "./PasswordInput";

interface FileEncryptionProps {
  isEncrypting: boolean;
  isProcessing: boolean;
  selectedFile: File | null;
  password: string;
  showPassword: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (password: string) => void;
  onTogglePassword: () => void;
  onProcess: () => void;
  onClearFile: () => void;
  onClearPassword: () => void;
}

export const FileEncryption: React.FC<FileEncryptionProps> = ({
  isEncrypting,
  isProcessing,
  selectedFile,
  password,
  showPassword,
  fileInputRef,
  onFileSelect,
  onPasswordChange,
  onTogglePassword,
  onProcess,
  onClearFile,
  onClearPassword,
}) => {
  // Drag-and-drop state
  const [isDragActive, setIsDragActive] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Simulate file input change event
      const fileList = e.dataTransfer.files;
      if (fileInputRef.current) {
        fileInputRef.current.files = fileList;
      }
      // Call onFileSelect with a synthetic event
      const syntheticEvent = {
        target: { files: fileList },
      } as React.ChangeEvent<HTMLInputElement>;
      onFileSelect(syntheticEvent);
    }
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-gray-900">
          {isEncrypting ? "File to Encrypt" : "Encrypted File to Decrypt"}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {isEncrypting ? "Select the file you want to encrypt." : "Select the encrypted file that you want to decrypt."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="fileUpload" className="text-gray-700">
                {isEncrypting ? "Select File" : "Select Encrypted File"}
              </Label>
              {selectedFile && (
                <Button onClick={onClearFile} variant="outline" size="sm" className="h-8 px-3 text-xs">
                  <Eraser className="h-3 w-3 mr-1.5" />
                  <span>Clear</span>
                </Button>
              )}
            </div>
            {/* Drag-and-drop area */}
            <div
              ref={dropRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 border-2 rounded-md p-4 transition-colors ${isDragActive ? "border-green-500 bg-green-50" : "border-dashed border-gray-200 bg-gray-50"}`}
              style={{ cursor: "pointer" }}
            >
              <Input ref={fileInputRef} id="fileUpload" type="file" onChange={onFileSelect} className="satoshi-input" style={{ display: "none" }} />
              <span className="text-gray-500 text-sm">Drag & drop a file here, or click to select</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1"
              >
                Browse Files
              </Button>
              {selectedFile && (
                <div className="text-sm text-gray-500 mt-2">
                  Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                </div>
              )}
            </div>
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
          disabled={isProcessing || !selectedFile || !password}
          onClick={onProcess}
          className="w-full flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
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
  );
};
