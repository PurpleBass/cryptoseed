import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load the Code Verification Component
const CodeVerificationLazy = lazy(() => import('./CodeVerification'));

// Loading fallback component
const CodeVerificationLoading = () => (
  <div className="w-full min-h-[200px] flex items-center justify-center">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">Loading Code Verification...</span>
    </div>
  </div>
);

export const LazyCodeVerification: React.FC = () => {
  return (
    <Suspense fallback={<CodeVerificationLoading />}>
      <CodeVerificationLazy />
    </Suspense>
  );
};
