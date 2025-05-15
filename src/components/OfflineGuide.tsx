
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Shield, FileCheck, WifiOff, Smartphone, Laptop } from 'lucide-react';
import { Steps } from '@/components/ui/steps';

/**
 * OfflineGuide Component
 * 
 * Provides a comprehensive guide on how to use the application in offline mode,
 * including the benefits of offline use and step-by-step installation instructions
 * for different platforms.
 * 
 * @returns {JSX.Element} Offline usage guide UI component
 */
const OfflineGuide = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4" id="offline-guide">
      <h3 className="text-lg font-medium text-center mb-4">Offline Usage Guide</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-secure-600" />
              <span>Why Use Offline?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3">
              <div className="bg-secure-50 rounded-md p-3">
                <h4 className="text-sm font-medium mb-1">Maximum Security</h4>
                <p className="text-xs text-muted-foreground">
                  When offline, no data can potentially be intercepted or exfiltrated through network channels.
                  This creates a complete air-gap for your sensitive encryption operations.
                </p>
              </div>
              
              <div className="border rounded-md p-3">
                <h4 className="text-sm font-medium mb-1">Data Protection</h4>
                <p className="text-xs text-muted-foreground">
                  Offline use eliminates the risk of data leakage through browser extensions,
                  network monitoring tools, or any other form of online surveillance.
                </p>
              </div>
              
              <div className="border rounded-md p-3">
                <h4 className="text-sm font-medium mb-1">Always Available</h4>
                <p className="text-xs text-muted-foreground">
                  Access your encryption tools anytime, anywhere, even without internet connectivity.
                  Perfect for secure environments with restricted network access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="h-5 w-5 text-secure-600" />
              <span>Installing As PWA</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2 text-sm">
              <p className="text-xs mb-3 text-muted-foreground">
                Installing CryptoSeed as a Progressive Web App (PWA) allows you to use it offline
                and provides a more app-like experience on your device.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-secure-600 mt-1 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">On Mobile</h4>
                    <p className="text-xs text-muted-foreground">
                      Tap the share icon (iOS) or menu (Android), then "Add to Home Screen" or "Install"
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Laptop className="h-5 w-5 text-secure-600 mt-1 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">On Desktop</h4>
                    <p className="text-xs text-muted-foreground">
                      Look for the install icon in the address bar or menu options to install
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <WifiOff className="h-5 w-5 text-secure-600" />
            <span>How To Use CryptoSeed Offline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <Steps>
            <Steps.Step>
              <Steps.StepNumber>1</Steps.StepNumber>
              <Steps.StepTitle>Install the App</Steps.StepTitle>
              <Steps.StepDescription>
                Install CryptoSeed as a PWA using your browser's install option or add to home screen.
              </Steps.StepDescription>
            </Steps.Step>
            
            <Steps.Step>
              <Steps.StepNumber>2</Steps.StepNumber>
              <Steps.StepTitle>Disconnect from the Internet</Steps.StepTitle>
              <Steps.StepDescription>
                For maximum security, enable airplane mode or disconnect from WiFi and mobile data.
              </Steps.StepDescription>
            </Steps.Step>
            
            <Steps.Step>
              <Steps.StepNumber>3</Steps.StepNumber>
              <Steps.StepTitle>Launch the App</Steps.StepTitle>
              <Steps.StepDescription>
                Open CryptoSeed from your home screen or app drawer - it will work completely offline.
              </Steps.StepDescription>
            </Steps.Step>
            
            <Steps.Step>
              <Steps.StepNumber>4</Steps.StepNumber>
              <Steps.StepTitle>Perform Encryption</Steps.StepTitle>
              <Steps.StepDescription>
                All encryption features work normally offline. Enter your data and encrypt/decrypt as needed.
              </Steps.StepDescription>
            </Steps.Step>
            
            <Steps.Step>
              <Steps.StepNumber>5</Steps.StepNumber>
              <Steps.StepTitle>Save Your Results</Steps.StepTitle>
              <Steps.StepDescription>
                Save encrypted data securely. You can reconnect to the internet after closing the app.
              </Steps.StepDescription>
            </Steps.Step>
          </Steps>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-secure-600" />
            <span>Best Practices for Offline Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 bg-secure-100 rounded-full p-1 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-secure-800">1</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Use a Clean Environment</h4>
                <p className="text-xs text-muted-foreground">
                  Use private/incognito browser mode before installing, or better yet, a browser
                  dedicated to sensitive operations.
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="mt-0.5 bg-secure-100 rounded-full p-1 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-secure-800">2</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Clear Browser Data</h4>
                <p className="text-xs text-muted-foreground">
                  After usage, clear your browsing history, cookies, and cache to remove any potential traces.
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="mt-0.5 bg-secure-100 rounded-full p-1 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-secure-800">3</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Avoid Screen Recording</h4>
                <p className="text-xs text-muted-foreground">
                  Ensure no screen recording apps or software are running during your encryption session.
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="mt-0.5 bg-secure-100 rounded-full p-1 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-secure-800">4</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Secure Physical Environment</h4>
                <p className="text-xs text-muted-foreground">
                  Be aware of your surroundings, including security cameras or people who might observe your screen.
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="mt-0.5 bg-secure-100 rounded-full p-1 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-secure-800">5</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Regular Updates</h4>
                <p className="text-xs text-muted-foreground">
                  Periodically go online to check for CryptoSeed security updates, then return to offline mode.
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineGuide;
