/**
 * Encryption Security Information Component
 * 
 * Displays information about the V3 (Argon2id) encryption used by CryptoSeed.
 * No version selection needed - only the most secure encryption is available.
 */

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Shield, ChevronDown, Info } from "lucide-react";

interface EncryptionSecurityInfoProps {
  disabled?: boolean;
}

export const EncryptionVersionSelector: React.FC<EncryptionSecurityInfoProps> = ({
  disabled = false
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card className="border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-base text-gray-900">Encryption Security</CardTitle>
          </div>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={disabled}>
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
        <CardDescription className="text-sm text-gray-600">
          Professional-grade V3 encryption with Argon2id
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Current encryption standard */}
        <div className="p-3 rounded-lg border-2 border-purple-200 bg-purple-50">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-purple-900">Future-Proof Encryption (V3)</span>
            <Badge variant="default" className="bg-purple-100 text-purple-800 text-xs">
              Current Standard
            </Badge>
          </div>
          <p className="text-sm text-purple-700 mb-2">
            ChaCha20-Poly1305 + Argon2id key derivation
          </p>
          <div className="text-xs text-purple-600">
            ✓ Memory-hard KDF ✓ Post-quantum resistant ✓ OWASP recommended ✓ Maximum security
          </div>
        </div>

        {/* Detailed Information (Collapsible) */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  V3 Encryption Technical Details
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Encryption:</strong> ChaCha20-Poly1305 (authenticated encryption)</li>
                  <li>• <strong>Key Derivation:</strong> Argon2id (memory-hard, OWASP recommended)</li>
                  <li>• <strong>Memory Usage:</strong> 64MB (extremely ASIC/GPU resistant)</li>
                  <li>• <strong>Iterations:</strong> 3 rounds with 4-way parallelism</li>
                  <li>• <strong>Key Size:</strong> 256 bits with 96-bit nonces</li>
                  <li>• <strong>Security Level:</strong> Designed for next 10+ years</li>
                </ul>
              </div>

              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-900 mb-1">Security Guarantee</p>
                    <p className="text-green-700">
                      This is professional-grade encryption that can protect high-value cryptocurrency 
                      seeds against nation-state level attackers. The app has eliminated all legacy 
                      vulnerabilities for maximum security.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Why V3-Only?</p>
                    <p className="text-blue-700">
                      Previous versions (V1 PBKDF2, V2 scrypt) had security limitations. 
                      By supporting only V3, we eliminate attack vectors and ensure 
                      every user gets maximum protection without compromise.
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
