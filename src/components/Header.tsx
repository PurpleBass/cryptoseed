import React from "react";
import { FileText, HelpCircle, Shield } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-mobile";
import { Logo } from "@/components/ui/logo";

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
          <div className="flex items-center gap-2 md:gap-3">
            <Logo 
              size="64"
              className="h-8 w-8 md:h-10 md:w-10"
            />
            <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-gray-900">
              Crypto Seed
            </h1>
          </div>
          <span className="block text-secure-600 text-base md:text-lg font-semibold tracking-tight">Plant privacy. Sprout Freedom.</span>
          <p className="text-center text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
            A client-side only, open-source ChaCha20-Poly1305 encryption tool that works offline. No data leaves your device, no backdoors, completely verifiable.
          </p>
          
          {/* Technical Facts Section */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-4 max-w-3xl mx-auto mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span><strong>Serverless:</strong> No backend, no databases</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span><strong>No transmission:</strong> Data never sent anywhere</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span><strong>No users:</strong> No accounts, no registration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span><strong>No logs:</strong> No tracking, no analytics</span>
              </div>
            </div>
          </div>
          
          <Tabs 
            defaultValue="encrypt" 
            value={currentView} 
            onValueChange={(v) => setCurrentView(v as ViewType)}
            className="w-full max-w-2xl mt-2 md:mt-6"
            aria-label="Main navigation tabs"
          >
            <TabsList 
              className={cn(
                "grid w-full rounded-full p-1 bg-gray-100",
                "grid-cols-3"
              )}
              aria-label="Main navigation"
              role="tablist"
            >
              {isMobile ? (
                // Mobile Layout: Show all tabs with smaller text and icons
                <>
                  <TabsTrigger 
                    value="encrypt" 
                    id="tab-encrypt"
                    aria-controls="content-encrypt"
                    aria-label="Switch to encrypt and decrypt view"
                    className="flex items-center justify-center gap-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-600 data-[state=active]:shadow-sm text-xs py-1.5"
                  >
                    <Shield className="h-3 w-3" />
                    <span>Encrypt</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="verify" 
                    id="tab-verify"
                    aria-controls="content-verify"
                    aria-label="Switch to code verification view"
                    className="flex items-center justify-center gap-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-600 data-[state=active]:shadow-sm text-xs py-1.5"
                  >
                    <FileText className="h-3 w-3" />
                    <span>Verify</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="faq" 
                    id="tab-faq"
                    aria-controls="content-faq"
                    aria-label="Switch to FAQ and best practices view"
                    className="flex items-center justify-center gap-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-600 data-[state=active]:shadow-sm text-xs py-1.5"
                  >
                    <HelpCircle className="h-3 w-3" />
                    <span>FAQ</span>
                  </TabsTrigger>
                </>
              ) : (
                // Desktop Layout: Show all tabs with normal size
                <>
                  <TabsTrigger 
                    value="encrypt" 
                    id="tab-encrypt-desktop"
                    aria-controls="content-encrypt"
                    aria-label="Switch to encrypt and decrypt view"
                    className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-600 data-[state=active]:shadow-sm"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Encrypt & Decrypt</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="verify" 
                    id="tab-verify-desktop"
                    aria-controls="content-verify"
                    aria-label="Switch to code verification view"
                    className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-600 data-[state=active]:shadow-sm"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Verify Code</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="faq" 
                    id="tab-faq-desktop"
                    aria-controls="content-faq"
                    aria-label="Switch to FAQ and best practices view"
                    className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-600 data-[state=active]:shadow-sm"
                  >
                    <HelpCircle className="h-4 w-4" />
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
