
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { formatSeedPhraseWithNumbers } from "@/lib/encryptionProcessing";

interface EncryptionOutputProps {
  output: string;
  isEncrypting: boolean;
  onCopy: () => void;
  mode?: "seedphrase" | "text" | "file";  // Add mode prop to determine when to format
}

export const EncryptionOutput: React.FC<EncryptionOutputProps> = ({
  output,
  isEncrypting,
  onCopy,
  mode = "text"  // Default to text if no mode specified
}) => {
  // Format the output if it's a decrypted seed phrase
  const displayOutput = (!isEncrypting && mode === "seedphrase") 
    ? formatSeedPhraseWithNumbers(output)
    : output;

  return (
    <Card className="mt-6 satoshi-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-gray-900">
            {isEncrypting ? "Encrypted Result" : "Decrypted Result"}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
            className="text-satoshi-500 hover:text-satoshi-600 hover:bg-satoshi-50"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-gray-50 rounded-md overflow-auto max-h-96 border border-gray-100">
          <pre className="whitespace-pre-wrap break-all text-gray-800 text-left">{displayOutput}</pre>
        </div>
      </CardContent>
    </Card>
  );
};
