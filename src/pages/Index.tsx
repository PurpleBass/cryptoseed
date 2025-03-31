
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
      
      <main className="flex-1">
        {currentView === "encrypt" && <EncryptionComponent />}
        {currentView === "verify" && <CodeVerification />}
        {currentView === "faq" && <FAQComponent />}
      </main>
      
      <footer className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="satoshi-container text-center">
          <div className="mb-4">
            <Shield className="h-8 w-8 text-satoshi-500 inline-block" />
            <p className="text-lg font-medium text-gray-800 mt-2">Secure Nomad Encryptor</p>
          </div>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Open Source, Zero-Knowledge Encryption. Your data never leaves your device.
            All encryption happens locally in your browser.
          </p>
          <div className="mt-6 flex justify-center space-x-6">
            <a 
              href="https://github.com/yourusername/secure-nomad-encryptor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-satoshi-500 hover:text-satoshi-700 hover:underline text-sm"
            >
              GitHub Repository
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setCurrentView("verify"); }}
              className="text-satoshi-500 hover:text-satoshi-700 hover:underline text-sm"
            >
              Verify Code
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setCurrentView("faq"); }}
              className="text-satoshi-500 hover:text-satoshi-700 hover:underline text-sm"
            >
              Security FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
