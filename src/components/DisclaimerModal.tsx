import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    // Check if user has already accepted the disclaimer
    const disclaimerAccepted = localStorage.getItem('cryptoseed-disclaimer-accepted');
    if (!disclaimerAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (acknowledged) {
      localStorage.setItem('cryptoseed-disclaimer-accepted', 'true');
      setIsOpen(false);
    }
  };

  const handleDecline = () => {
    // Redirect away from the site
    window.location.href = 'https://github.com/PurpleBass/cryptoseed';
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <DialogTitle className="text-xl font-bold text-red-700">
              Educational Software - Important Warning
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-bold text-red-800 mb-2 text-base">
              🚨 DO NOT USE WITH REAL CRYPTOCURRENCY DATA 🚨
            </h3>
            <p className="text-red-700 font-medium">
              This application is under active development and is provided for educational and demonstration purposes only.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">By continuing, you understand and agree that:</h4>
            
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">•</span>
                <span><strong>This is experimental software</strong> not intended for production use with real cryptocurrency assets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">•</span>
                <span><strong>You will only use test data</strong> such as example seed phrases like "abandon abandon abandon... art" (BIP39 test mnemonic)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">•</span>
                <span><strong>No warranties are provided</strong> regarding security, reliability, or fitness for any particular purpose</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">•</span>
                <span><strong>The developers are not responsible</strong> for any loss of funds, data, or other damages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">•</span>
                <span><strong>This is for educational purposes only</strong> to demonstrate encryption concepts and security practices</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Recommended Test Data:</h4>
            <p className="text-amber-700 text-xs font-mono bg-amber-100 p-2 rounded">
              abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
            </p>
            <p className="text-amber-700 text-xs mt-1">
              (This is a standard BIP39 test mnemonic safe for educational use)
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Checkbox 
              id="acknowledge" 
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
            />
            <label 
              htmlFor="acknowledge" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand this is educational software and I will only use test data, never real cryptocurrency information
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={handleDecline}
            className="flex-1"
          >
            I Don't Agree - Take Me Away
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={!acknowledged}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            I Understand - Continue with Test Data Only
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
