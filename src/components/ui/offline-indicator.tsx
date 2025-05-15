
import React, { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setIsAlertVisible(true); // Reset visibility when coming back online
      toast.success('You are back online', {
        description: 'All features are now available',
        icon: <Wifi className="h-4 w-4" />,
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsAlertVisible(true); // Reset visibility when going offline
      toast.warning('You are offline', {
        description: 'App is running in offline mode',
        icon: <WifiOff className="h-4 w-4" />,
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const dismissAlert = () => {
    setIsAlertVisible(false);
  };

  // Show nothing if online or if alert has been dismissed
  if (!isOffline || !isAlertVisible) return null;

  return (
    <Alert variant="warning" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-in fade-in slide-in-from-bottom-5 pr-10">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Offline Mode</AlertTitle>
      <AlertDescription>
        You are currently offline. The app will continue to work with limited functionality.
      </AlertDescription>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
        onClick={dismissAlert}
      >
        <X className="h-3.5 w-3.5" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </Alert>
  );
};

export default OfflineIndicator;
