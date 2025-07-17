import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load the FAQ Component
const FAQComponentLazy = lazy(() => import('./FAQComponent'));

// Loading fallback component
const FAQLoading = () => (
  <div className="w-full min-h-[200px] flex items-center justify-center">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">Loading FAQ...</span>
    </div>
  </div>
);

export const LazyFAQComponent: React.FC = () => {
  return (
    <Suspense fallback={<FAQLoading />}>
      <FAQComponentLazy />
    </Suspense>
  );
};
