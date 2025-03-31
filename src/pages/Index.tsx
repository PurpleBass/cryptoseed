
import React, { useState } from "react";
import { Shield, Key, Lock, FileText } from "lucide-react";
import Header, { ViewType } from "@/components/Header";
import EncryptionComponent from "@/components/EncryptionComponent";
import CodeVerification from "@/components/CodeVerification";
import FAQComponent from "@/components/FAQComponent";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>("encrypt");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      {currentView === "encrypt" && (
        <div className="bg-gradient-to-b from-crypto-50 to-white pt-8 pb-6 border-b border-gray-100">
          <div className="crypto-container text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Secure Your Crypto Seed Phrases</h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-700 mb-6">
                Protect your critical seed phrases with advanced zero-knowledge encryption. 
                Safeguard the keys to your crypto wallets with military-grade security.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-2">
                    <Key className="h-5 w-5 text-crypto-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Seed Phrase Protection</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Securely encrypt and store your wallet recovery phrases using AES-256 encryption. 
                    Prevent unauthorized access to your crypto assets.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-crypto-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Text Encryption</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Encrypt sensitive text messages, passwords, or confidential notes with robust encryption.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-2">
                    <Lock className="h-5 w-5 text-crypto-600 mr-2" />
                    <h3 className="font-medium text-gray-900">File Encryption</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Encrypt any file with a password. Secure your documents, images, and other sensitive files.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1">
        {currentView === "encrypt" && <EncryptionComponent />}
        {currentView === "verify" && <CodeVerification />}
        {currentView === "faq" && <FAQComponent />}
      </main>
      
      <footer className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="crypto-container text-center">
          <div className="mb-4">
            <Shield className="h-8 w-8 text-crypto-500 inline-block" />
            <p className="text-lg font-medium text-gray-800 mt-2">Crypto Seed</p>
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
              className="text-crypto-500 hover:text-crypto-700 hover:underline text-sm"
            >
              GitHub Repository
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setCurrentView("verify"); }}
              className="text-crypto-500 hover:text-crypto-700 hover:underline text-sm"
            >
              Verify Code
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setCurrentView("faq"); }}
              className="text-crypto-500 hover:text-crypto-700 hover:underline text-sm"
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
