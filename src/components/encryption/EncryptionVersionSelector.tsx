/**
 * Encryption Version Selector Component
 * 
 * Allows users to choose between legacy (V1), enhanced (V2), and future-proof (V3) encryption algorithms.
 * Displays security information and recommendations for each version.
 */

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Shield, ShieldCheck, AlertTriangle, ChevronDown, Info } from "lucide-react";
import { EncryptionVersion } from "@/lib/encryptionProcessing";

interface EncryptionVersionSelectorProps {
  selectedVersion: EncryptionVersion;
  onVersionChange: (version: EncryptionVersion) => void;
  disabled?: boolean;
}

export const EncryptionVersionSelector: React.FC<EncryptionVersionSelectorProps> = ({
  selectedVersion,
  onVersionChange,
  disabled = false
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card className="border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base text-gray-900">Encryption Algorithm</CardTitle>
          </div>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
        <CardDescription className="text-sm text-gray-600">
          Choose your encryption security level
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <RadioGroup 
          value={selectedVersion} 
          onValueChange={(value) => onVersionChange(value as EncryptionVersion)}
          disabled={disabled}
          className="space-y-4"
        >
          {/* Future-Proof Encryption (V3) - Recommended */}
          <div className="relative">
            <Label 
              htmlFor="v3" 
              className="flex items-start gap-3 p-3 rounded-lg border-2 border-purple-200 bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors"
            >
              <RadioGroupItem value="v3" id="v3" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-900">Future-Proof Encryption (V3)</span>
                  <Badge variant="default" className="bg-purple-100 text-purple-800 text-xs">
                    Recommended
                  </Badge>
                </div>
                <p className="text-sm text-purple-700 mb-2">
                  ChaCha20-Poly1305 + Argon2id key derivation
                </p>
                <div className="text-xs text-purple-600">
                  ✓ Post-quantum resistant ✓ Memory-hard KDF ✓ OWASP recommended
                </div>
              </div>
            </Label>
          </div>

          {/* Enhanced Encryption (V2) */}
          <div className="relative">
            <Label 
              htmlFor="v2" 
              className="flex items-start gap-3 p-3 rounded-lg border-2 border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
            >
              <RadioGroupItem value="v2" id="v2" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">Enhanced Encryption (V2)</span>
                  <Badge variant="outline" className="border-green-300 text-green-700 text-xs">
                    Secure
                  </Badge>
                </div>
                <p className="text-sm text-green-700 mb-2">
                  ChaCha20-Poly1305 + scrypt key derivation
                </p>
                <div className="text-xs text-green-600">
                  ✓ Modern algorithms ✓ Better security ✓ Constant-time operations
                </div>
              </div>
            </Label>
          </div>

          {/* Legacy Encryption (V1) */}
          <div className="relative">
            <Label 
              htmlFor="v1" 
              className="flex items-start gap-3 p-3 rounded-lg border-2 border-amber-200 bg-amber-50 cursor-pointer hover:bg-amber-100 transition-colors"
            >
              <RadioGroupItem value="v1" id="v1" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-900">Legacy Encryption (V1)</span>
                  <Badge variant="outline" className="border-amber-300 text-amber-700 text-xs">
                    Compatibility
                  </Badge>
                </div>
                <p className="text-sm text-amber-700 mb-2">
                  AES-256-GCM + PBKDF2 key derivation
                </p>
                <div className="text-xs text-amber-600">
                  ⚠️ Older algorithms ⚠️ Known limitations ⚠️ Use only for compatibility
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Detailed Information (Collapsible) */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-600" />
                  Future-Proof Encryption (V3) Details
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>ChaCha20-Poly1305:</strong> Modern stream cipher with authenticated encryption</li>
                  <li>• <strong>Argon2id KDF:</strong> State-of-the-art password hashing, OWASP recommended</li>
                  <li>• <strong>Memory-hard:</strong> Extremely resistant to ASIC/GPU attacks</li>
                  <li>• <strong>Post-quantum considerations:</strong> Designed for long-term security</li>
                  <li>• <strong>Optimal parameters:</strong> Balanced security vs performance for modern systems</li>
                </ul>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Enhanced Encryption (V2) Details
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>ChaCha20-Poly1305:</strong> Modern stream cipher with authenticated encryption</li>
                  <li>• <strong>scrypt KDF:</strong> Memory-hard key derivation function resistant to ASIC attacks</li>
                  <li>• <strong>Larger salt/nonce:</strong> 256-bit salt, improved security parameters</li>
                  <li>• <strong>Constant-time:</strong> Resistant to timing attacks</li>
                  <li>• <strong>64-bit timestamps:</strong> Y2038-safe and precise metadata</li>
                </ul>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Legacy Encryption (V1) Details
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>AES-256-GCM:</strong> Industry standard but potential timing vulnerabilities</li>
                  <li>• <strong>PBKDF2:</strong> Older key derivation, vulnerable to specialized hardware</li>
                  <li>• <strong>Smaller parameters:</strong> 128-bit salt, moderate security settings</li>
                  <li>• <strong>Compatibility:</strong> Use only for decrypting old files or compatibility needs</li>
                  <li>• <strong>32-bit timestamps:</strong> Y2038 problem, less precise</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Migration Note</p>
                    <p className="text-blue-700">
                      The app automatically detects and decrypts V1, V2, and V3 formats. 
                      New encryptions will use your selected version. For maximum security, 
                      choose Future-Proof (V3) for all new encryptions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
