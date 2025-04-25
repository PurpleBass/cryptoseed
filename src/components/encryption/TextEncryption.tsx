
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eraser } from "lucide-react";
import { EncryptionOutput } from "./EncryptionOutput";
import { PasswordInput } from "./PasswordInput";

interface TextEncryptionProps {
  isEncrypting: boolean;
  isProcessing: boolean;
  textInput: string;
  password: string;
  showPassword: boolean;
  output: string;
  onTextChange: (text: string) => void;
  onPasswordChange: (password: string) => void;
  onTogglePassword: () => void;
  onProcess: () => void;
  onClearText: () => void;
  onClearPassword: () => void;
  onCopyOutput: () => void;
}

export const TextEncryption: React.FC<TextEncryptionProps> = ({
  isEncrypting,
  isProcessing,
  textInput,
  password,
  showPassword,
  output,
  onTextChange,
  onPasswordChange,
  onTogglePassword,
  onProcess,
  onClearText,
  onClearPassword,
  onCopyOutput,
}) => {
  return (
    <>
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-gray-900">
            {isEncrypting ? "Text to Encrypt" : "Encrypted Text to Decrypt"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isEncrypting ? "Enter the text you want to encrypt." : "Paste the encrypted text that you want to decrypt."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="textInput" className="text-gray-700">
                  {isEncrypting ? "Plain Text" : "Encrypted Text"}
                </Label>
                <Button onClick={onClearText} variant="outline" size="sm" className="text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700">
                  <Eraser className="h-3.5 w-3.5 mr-1.5" />
                  <span>Clear</span>
                </Button>
              </div>
              <Textarea
                id="textInput"
                value={textInput}
                onChange={(e) => onTextChange(e.target.value)}
                placeholder={isEncrypting ? "Enter the text you want to encrypt" : "Paste the encrypted text here"}
                className="min-h-32 satoshi-input"
              />
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
            disabled={isProcessing || !textInput || !password}
            onClick={onProcess}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {isProcessing ? "Processing..." : isEncrypting ? "Encrypt Text" : "Decrypt Text"}
          </Button>
        </CardFooter>
      </Card>

      {output && <EncryptionOutput output={output} isEncrypting={isEncrypting} onCopy={onCopyOutput} />}
    </>
  );
};
