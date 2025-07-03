/**
 * Clipboard Security Warning Component
 * Shows users the real risks before they copy sensitive data
 */

import { useState } from "react";
import { AlertTriangle, Copy, Eye, EyeOff, Shield, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface ClipboardSecurityWarningProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  contentType: "encrypted" | "decrypted" | "seed";
}

export function ClipboardSecurityWarning({ 
  isOpen, 
  onClose, 
  onProceed, 
  contentType 
}: ClipboardSecurityWarningProps) {
  const [understood, setUnderstood] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Detect platform for specific warnings
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isMac = typeof navigator !== 'undefined' && /Mac OS X/.test(navigator.userAgent);
  const isAndroid = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);

  const getContentTypeWarning = () => {
    switch (contentType) {
      case "seed":
        return "⚠️ CRITICAL: This is a cryptocurrency seed phrase. If compromised, you could lose all funds in your wallet.";
      case "decrypted":
        return "⚠️ WARNING: This is decrypted sensitive data that could be valuable to attackers.";
      case "encrypted":
        return "ℹ️ This is encrypted data, but the encryption key (your password) could still be at risk.";
      default:
        return "⚠️ This contains sensitive data that should be protected.";
    }
  };

  const getPlatformRisks = () => {
    if (isIOS) {
      return [
        "iOS stores clipboard data indefinitely until overwritten",
        "Other apps can access clipboard when active",
        "iCloud may sync clipboard across devices",
        "Automatic clipboard clearing will NOT work"
      ];
    } else if (isMac) {
      return [
        "macOS stores clipboard in memory and swap files",
        "Universal Clipboard may sync to other Apple devices",
        "Apps with accessibility permissions can read clipboard",
        "Automatic clipboard clearing may not work"
      ];
    } else if (isAndroid) {
      return [
        "Android apps can request clipboard access",
        "Clipboard history may be stored by keyboard apps",
        "Some launchers show clipboard notifications",
        "Automatic clipboard clearing typically blocked"
      ];
    } else {
      return [
        "Clipboard contents may persist in memory",
        "Other applications can potentially access clipboard",
        "Browser security policies may prevent automatic clearing",
        "Clipboard history features may store sensitive data"
      ];
    }
  };

  const handleProceed = () => {
    if (understood) {
      onProceed();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Clipboard Security Warning
          </DialogTitle>
          <DialogDescription>
            Before copying sensitive data, please understand the security implications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main Warning */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              {getContentTypeWarning()}
            </AlertDescription>
          </Alert>

          {/* Platform-Specific Risks */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Clipboard Risks on Your Platform
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              {getPlatformRisks().map((risk, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Explanation (Collapsible) */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showDetails ? "Hide" : "Show"} Technical Details
            </Button>

            {showDetails && (
              <div className="mt-3 bg-gray-50 border rounded-lg p-4 text-sm">
                <h5 className="font-semibold mb-2">Why Clipboard Clearing Often Fails:</h5>
                <ul className="space-y-1 text-gray-700">
                  <li>• Modern browsers prevent websites from clearing clipboard for security</li>
                  <li>• Operating systems protect clipboard from unauthorized access</li>
                  <li>• Mobile platforms (iOS/Android) actively block clipboard manipulation</li>
                  <li>• Even when "clearing" appears to work, data may persist in memory</li>
                </ul>
                
                <h5 className="font-semibold mt-3 mb-2">What Happens to Clipboard Data:</h5>
                <ul className="space-y-1 text-gray-700">
                  <li>• May be stored in system memory/swap files</li>
                  <li>• Could be accessible to other applications</li>
                  <li>• Might sync across devices via cloud services</li>
                  <li>• Can persist until device restart or manual clearing</li>
                </ul>
              </div>
            )}
          </div>

          {/* Safety Recommendations */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Safer Alternatives:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Type the data manually instead of copying</li>
              <li>• Use a dedicated password manager with auto-clear</li>
              <li>• Copy only when immediately needed, then paste right away</li>
              <li>• Manually clear clipboard after use (Settings → General → Reset)</li>
              <li>• Consider using QR codes for device-to-device transfer</li>
            </ul>
          </div>

          {/* User Acknowledgment */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 border rounded-lg">
            <Checkbox
              id="understood"
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(checked as boolean)}
            />
            <label htmlFor="understood" className="text-sm leading-relaxed cursor-pointer">
              I understand the clipboard security risks and take full responsibility for copying this sensitive data. 
              I will manually clear my clipboard after use and understand that automatic clearing may not work.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel (Safer Choice)
            </Button>
            <Button
              onClick={handleProceed}
              disabled={!understood}
              variant="destructive"
              className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Anyway (At My Risk)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
