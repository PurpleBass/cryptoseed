import { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff, X, Download, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * OfflineIndicator Component
 * 
 * Displays network connectivity status to the user and provides information
 * about offline capabilities of the application. Shows as a non-intrusive alert
 * when offline and provides toast notifications on connectivity changes.
 * 
 * Features:
 * - Real-time network status monitoring
 * - Toast notifications for connectivity changes
 * - Dismissible offline alert
 * - Modal with offline usage instructions
 */
export const OfflineIndicator = () => {
  // Default to online if navigator.onLine is undefined (SSR case)
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);

  useEffect(() => {
    console.log('[OfflineIndicator] Mounted. navigator.onLine:', navigator.onLine);
    // Skip effect if running in SSR environment
    if (typeof window === 'undefined') return;
    
    /**
     * Handle online status change
     * Updates state and shows a success toast
     */
    const handleOnline = () => {
      console.log('[OfflineIndicator] Online event fired');
      setIsOffline(false);
      setIsAlertVisible(true); // Reset visibility when coming back online
      toast.success('You are back online', {
        description: 'All features are now available',
        icon: <Wifi className="h-4 w-4" />, 
      });
    };

    /**
     * Handle offline status change
     * Updates state and shows a warning toast
     */
    const handleOffline = () => {
      console.log('[OfflineIndicator] Offline event fired');
      setIsOffline(true);
      setIsAlertVisible(true); // Reset visibility when going offline
      toast.warning('You are offline', {
        description: 'App is running in offline mode',
        icon: <WifiOff className="h-4 w-4" />,
        duration: 5000,
      });
    };

    // Add event listeners for online/offline status changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    console.log('[OfflineIndicator] Event listeners added');

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      console.log('[OfflineIndicator] Event listeners removed');
    };
  }, []);

  /**
   * Dismiss the offline alert
   * User can hide the alert if they don't want to see it
   */
  const dismissAlert = () => {
    setIsAlertVisible(false);
  };

  /**
   * Open the offline usage guide dialog
   */
  const openOfflineGuide = () => {
    setShowOfflineDialog(true);
  };

  // Show nothing if online or if alert has been dismissed
  if (!isOffline || !isAlertVisible) return null;

  return (
    <>
      <Alert 
        variant="warning" 
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-in fade-in slide-in-from-bottom-5 pr-10"
        aria-label="Offline Mode Alert"
      >
        <WifiOff className="h-4 w-4" />
        <AlertTitle className="flex items-center gap-2">
          Offline Mode
          <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
            Limited Features
          </span>
        </AlertTitle>
        <AlertDescription>
          <p className="mb-1">You are currently offline. The app will continue to work with encryption and decryption features.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-1 text-xs h-7 bg-white"
            onClick={openOfflineGuide}
          >
            <Download className="h-3 w-3 mr-1" />
            Offline Guide
          </Button>
        </AlertDescription>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
          onClick={dismissAlert}
          aria-label="Dismiss offline alert"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </Alert>

      <Dialog open={showOfflineDialog} onOpenChange={setShowOfflineDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Using CryptoSeed Offline
            </DialogTitle>
            <DialogDescription>
              Get the most secure experience by using this app offline
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-secure-600" />
                Benefits of offline usage
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Maximum security - no data can be intercepted</li>
                <li>All encryption and decryption happens locally</li>
                <li>Protection from network-based attacks</li>
                <li>Works during internet outages</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Install as an offline app</h4>
              <p className="text-muted-foreground">
                For the best offline experience, install CryptoSeed as a Progressive Web App:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                <li>Look for the install icon (↓) in your browser's address bar</li>
                <li>Select "Install" or "Add to Home Screen"</li>
                <li>Once installed, you can use CryptoSeed completely offline</li>
              </ol>
            </div>
            
            <div className="rounded-md bg-muted p-3">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-secure-600" />
                <p className="text-muted-foreground">
                  For maximum security with sensitive data, always disconnect from the internet before entering passwords or sensitive information.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OfflineIndicator;
