
import React from "react";
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
                <Button onClick={onClearFile} variant="outline" size="sm" className="text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700">
                  <Eraser className="h-3.5 w-3.5 mr-1.5" />
                  <span>Clear</span>
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input ref={fileInputRef} id="fileUpload" type="file" onChange={onFileSelect} className="satoshi-input" />
            </div>
            {selectedFile && (
              <div className="text-sm text-gray-500 mt-2">
                Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
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
