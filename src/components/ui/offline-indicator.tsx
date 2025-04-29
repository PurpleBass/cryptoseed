
import React, { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('You are back online', {
        description: 'All features are now available',
        icon: <Wifi className="h-4 w-4" />,
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
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

  if (!isOffline) return null;

  return (
    <Alert variant="warning" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-in fade-in slide-in-from-bottom-5">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Offline Mode</AlertTitle>
      <AlertDescription>
        You are currently offline. The app will continue to work with limited functionality.
      </AlertDescription>
    </Alert>
  );
};

export default OfflineIndicator;
