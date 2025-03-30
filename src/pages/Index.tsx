
import React, { useState } from "react";
import Header, { ViewType } from "@/components/Header";
import EncryptionComponent from "@/components/EncryptionComponent";
import CodeVerification from "@/components/CodeVerification";
import FAQComponent from "@/components/FAQComponent";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>("encrypt");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      {currentView === "encrypt" && <EncryptionComponent />}
      {currentView === "verify" && <CodeVerification />}
      {currentView === "faq" && <FAQComponent />}
      
      <footer className="mt-auto py-6 bg-muted">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Secure Nomad Encryptor - Open Source, Zero-Knowledge Encryption</p>
          <p className="mt-1">
            Your data never leaves your device. All encryption happens locally in your browser.
          </p>
          <p className="mt-4">
            <a 
              href="https://github.com/yourusername/secure-nomad-encryptor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-secure-600 hover:text-secure-700 hover:underline"
            >
              GitHub Repository
            </a>
            {" | "}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setCurrentView("verify"); }}
              className="text-secure-600 hover:text-secure-700 hover:underline"
            >
              Verify Code
            </a>
            {" | "}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setCurrentView("faq"); }}
              className="text-secure-600 hover:text-secure-700 hover:underline"
            >
              Security FAQ
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
