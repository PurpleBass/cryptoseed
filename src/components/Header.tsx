
import React from "react";
import { Button } from "@/components/ui/button";
import { Key, Lock, FileCheck, Book, Image, BrainCircuit } from "lucide-react";

export type ViewType = "encrypt" | "verify" | "faq" | "stego";

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="bg-background border-b border-gray-100 p-2 md:p-4">
      <div className="satoshi-container flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/a0b9a6e5-ef5a-4c95-929d-cb6a257495eb.png" alt="Crypto Seed Logo" className="h-6 w-6 md:h-8 md:w-8 text-secure-500" />
          <h1 className="text-base md:text-lg font-bold text-secure-800">Crypto Seed</h1>
        </div>
        
        <nav className="flex flex-wrap items-center gap-1 md:gap-2">
          <Button
            variant={currentView === "encrypt" ? "secure" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("encrypt")}
            className="text-xs md:text-sm h-8 md:h-9"
          >
            <Lock className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Encryption
          </Button>
          
          <Button
            variant={currentView === "stego" ? "secure" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("stego")}
            className="text-xs md:text-sm h-8 md:h-9"
          >
            <BrainCircuit className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Advanced</span> Steganography
          </Button>
          
          <Button
            variant={currentView === "verify" ? "secure" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("verify")}
            className="text-xs md:text-sm h-8 md:h-9"
          >
            <FileCheck className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Verify Code
          </Button>
          
          <Button
            variant={currentView === "faq" ? "secure" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("faq")}
            className="text-xs md:text-sm h-8 md:h-9"
          >
            <Book className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            FAQ
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
