
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Smartphone, Laptop, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * PWAInstallGuide Component
 * 
 * Provides step-by-step instructions for installing the application
 * as a Progressive Web App (PWA) on different devices.
 * 
 * @returns {JSX.Element} PWA installation guide with platform-specific instructions
 */
const PWAInstallGuide = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Download className="h-5 w-5 text-secure-600" />
        <h3 className="text-lg font-medium">Install CryptoSeed for Offline Use</h3>
      </div>
      
      <Alert className="mb-4 bg-secure-50 border-secure-200">
        <AlertCircle className="h-4 w-4 text-secure-600" />
        <AlertDescription className="text-sm">
          Installing as a PWA gives you the most secure experience with complete offline functionality.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="chrome" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="chrome">Chrome / Edge</TabsTrigger>
              <TabsTrigger value="android">Android</TabsTrigger>
              <TabsTrigger value="ios">iOS / iPadOS</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chrome" className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-muted rounded-full p-2 mt-1">
                  <Laptop className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Installing on Chrome, Edge, or other Chromium browsers</h4>
                  <ol className="mt-2 text-sm text-muted-foreground space-y-3">
                    <li className="flex flex-col">
                      <span>Look for the install icon in your browser's address bar</span>
                      <span className="mt-1 text-xs bg-muted inline-block px-2 py-1 rounded">
                        Usually appears as a <strong>+</strong> or <strong>↓</strong> icon
                      </span>
                    </li>
                    <li>Click <strong>"Install"</strong> or <strong>"Install CryptoSeed"</strong></li>
                    <li>The app will open in its own window and work completely offline</li>
                  </ol>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <strong>Note:</strong> If you don't see the installation icon, the app may already be installed
                    or your browser may not support PWAs.
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="android" className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-muted rounded-full p-2 mt-1">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Installing on Android devices</h4>
                  <ol className="mt-2 text-sm text-muted-foreground space-y-3">
                    <li>Tap the <strong>menu button</strong> (⋮) in your browser</li>
                    <li>Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
                    <li>Confirm by tapping <strong>"Add"</strong> or <strong>"Install"</strong></li>
                    <li>The app will now appear on your home screen</li>
                  </ol>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <strong>Note:</strong> For the most secure experience, use the installed app version
                    instead of accessing through the browser.
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ios" className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-muted rounded-full p-2 mt-1">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Installing on iOS / iPadOS devices</h4>
                  <ol className="mt-2 text-sm text-muted-foreground space-y-3">
                    <li>Open CryptoSeed in <strong>Safari</strong> browser</li>
                    <li>Tap the <strong>share button</strong> (box with arrow) at the bottom of the screen</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                    <li>Tap <strong>"Add"</strong> in the top-right corner</li>
                    <li>The app icon will appear on your home screen</li>
                  </ol>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <strong>Important:</strong> PWAs on iOS have some limitations. For the best experience,
                    consider using a device with Chrome or Edge browser.
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallGuide;
