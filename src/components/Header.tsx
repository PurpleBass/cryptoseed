
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
    <header className="w-full py-6">
      <div className="container">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-secure-700" />
            <h1 className="text-3xl font-bold tracking-tight">
              Secure Nomad Encryptor
            </h1>
          </div>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            A zero-knowledge, open-source AES-256 encryption tool that works offline.
            No data leaves your device, no backdoors, completely verifiable.
          </p>
          
          <Tabs 
            defaultValue="encrypt" 
            value={currentView} 
            onValueChange={(v) => setCurrentView(v as ViewType)}
            className="w-full max-w-2xl"
          >
            <TabsList className={cn("grid w-full", isMobile ? "grid-cols-1 gap-2" : "grid-cols-3")}>
              <TabsTrigger value="encrypt" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>{isMobile ? "Encrypt" : "Encrypt & Decrypt"}</span>
              </TabsTrigger>
              <TabsTrigger value="verify" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Verify Code</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
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
