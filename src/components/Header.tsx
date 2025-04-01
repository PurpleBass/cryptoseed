
import React from "react";
import { FileText, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-mobile";

export type ViewType = "encrypt" | "verify" | "faq";

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  return (
    <header className="w-full py-4 md:py-8 bg-white border-b border-gray-100">
      <div className="satoshi-container">
        <div className="flex flex-col items-center space-y-4 md:space-y-6">
          <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-gray-900">
            Crypto Seed
          </h1>
          <p className="text-center text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
            A zero-knowledge, open-source AES-256 encryption tool that works offline.
            No data leaves your device, no backdoors, completely verifiable.
          </p>
          
          <Tabs 
            defaultValue="encrypt" 
            value={currentView} 
            onValueChange={(v) => setCurrentView(v as ViewType)}
            className="w-full max-w-2xl mt-2 md:mt-6"
          >
            <TabsList className={cn(
              "grid w-full rounded-full p-1 bg-gray-100",
              "grid-cols-3"
            )}>
              {isMobile ? (
                // Mobile Layout: Show all tabs with smaller text and icons
                <>
                  <TabsTrigger 
                    value="encrypt" 
                    className="flex items-center justify-center gap-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-700 data-[state=active]:shadow-sm text-xs py-1.5"
                  >
                    <span>Encrypt</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="verify" 
                    className="flex items-center justify-center gap-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-700 data-[state=active]:shadow-sm text-xs py-1.5"
                  >
                    <span>Verify</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="faq" 
                    className="flex items-center justify-center gap-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-700 data-[state=active]:shadow-sm text-xs py-1.5"
                  >
                    <span>FAQ</span>
                  </TabsTrigger>
                </>
              ) : (
                // Desktop Layout: Show all tabs with normal size
                <>
                  <TabsTrigger 
                    value="encrypt" 
                    className="flex items-center justify-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-700 data-[state=active]:shadow-sm py-2"
                  >
                    <span>Encrypt & Decrypt</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="verify" 
                    className="flex items-center justify-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-700 data-[state=active]:shadow-sm py-2"
                  >
                    <span>Verify Code</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="faq" 
                    className="flex items-center justify-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-700 data-[state=active]:shadow-sm py-2"
                  >
                    <span>FAQ & Best Practices</span>
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  );
};

export default Header;
