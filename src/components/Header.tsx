
import React from "react";
import { Shield, FileText, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export type ViewType = "encrypt" | "verify" | "faq";

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const isMobile = useIsMobile();

  return (
    <header className="w-full py-8 bg-white border-b border-gray-100">
      <div className="satoshi-container">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="h-10 w-10 text-secure-500" />
            <h1 className="text-3xl font-heading font-bold tracking-tight text-gray-900">
              Crypto Seed
            </h1>
          </div>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            A zero-knowledge, open-source AES-256 encryption tool that works offline.
            No data leaves your device, no backdoors, completely verifiable.
          </p>
          
          <Tabs 
            defaultValue="encrypt" 
            value={currentView} 
            onValueChange={(v) => setCurrentView(v as ViewType)}
            className="w-full max-w-2xl mt-6"
          >
            <TabsList className={cn(
              "grid w-full rounded-full p-1 bg-gray-100", 
              isMobile ? "grid-cols-1 gap-2" : "grid-cols-3"
            )}>
              <TabsTrigger 
                value="encrypt" 
                className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-700 data-[state=active]:shadow-sm"
              >
                <Shield className="h-4 w-4" />
                <span>{isMobile ? "Encrypt" : "Encrypt & Decrypt"}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="verify" 
                className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-700 data-[state=active]:shadow-sm"
              >
                <FileText className="h-4 w-4" />
                <span>Verify Code</span>
              </TabsTrigger>
              <TabsTrigger 
                value="faq" 
                className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-secure-700 data-[state=active]:shadow-sm"
              >
                <HelpCircle className="h-4 w-4" />
                <span>FAQ & Best Practices</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  );
};

export default Header;
