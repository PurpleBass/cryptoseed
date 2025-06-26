import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { formatSeedPhraseWithNumbers } from "@/lib/encryptionProcessing";
import QRCode from "react-qr-code";
import { QrCode, Download, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  // Debug console log to verify the formatting
  console.log('Mode:', mode);
  console.log('IsEncrypting:', isEncrypting);
  console.log('Original output:', output);
  console.log('Formatted output:', displayOutput);

  const [showQR, setShowQR] = React.useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    const img = new window.Image();
    const size = 180;
    canvas.width = size;
    canvas.height = size;
    img.onload = function () {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'cryptoseed-qr.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgString)));
  };

  const handleCopyUrl = () => {
    if (!output) return;
    const url = `${window.location.origin}/#${encodeURIComponent(output)}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "The shareable decryption link has been copied to your clipboard. For security, the clipboard will be erased in 30 seconds.",
      variant: "default"
    });
  };

  return (
    <Card className="mt-6 satoshi-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-gray-900">
            {isEncrypting ? "Encrypted Result" : "Decrypted Result"}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCopy}
              className="text-satoshi-500 hover:text-satoshi-600 hover:bg-satoshi-50"
              aria-label="Copy Output"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyUrl}
              className="text-satoshi-500 hover:text-satoshi-600 hover:bg-satoshi-50"
              aria-label="Copy Link to Result"
            >
              <Link2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQR((v) => !v)}
              className="text-satoshi-500 hover:text-satoshi-600 hover:bg-satoshi-50"
              aria-label="Show QR Code"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-gray-50 rounded-md overflow-auto max-h-96 border border-gray-100">
          <pre className="whitespace-pre-wrap break-all text-gray-800 text-left">{displayOutput}</pre>
        </div>
        {showQR && output && (
          <div className="flex flex-col items-center mt-4" ref={qrRef}>
            <QRCode value={output} size={180} />
            <Button
              variant="outline"
              size="sm"
              className="mt-2 flex items-center gap-2"
              onClick={handleDownloadQR}
            >
              <Download className="h-4 w-4" /> Download QR Code
            </Button>
            <span className="text-xs text-gray-500 mt-2">Scan or download QR code for the encrypted result</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
