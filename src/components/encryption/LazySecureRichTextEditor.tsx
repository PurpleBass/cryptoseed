import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load the SecureRichTextEditor
const SecureRichTextEditorComponent = lazy(() => 
  import('./SecureRichTextEditor').then(module => ({
    default: module.SecureRichTextEditor
  }))
);

interface SecureRichTextEditorProps {
  value: any;
  onChange: (json: any) => void;
  editable?: boolean;
  onEditorReady?: (editor: any) => void;
}

// Loading fallback component
const EditorLoading = () => (
  <div className="w-full min-h-[200px] border border-input rounded-md bg-background flex items-center justify-center">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">Loading editor...</span>
    </div>
  </div>
);

export const LazySecureRichTextEditor: React.FC<SecureRichTextEditorProps> = (props) => {
  return (
    <Suspense fallback={<EditorLoading />}>
      <SecureRichTextEditorComponent {...props} />
    </Suspense>
  );
};
