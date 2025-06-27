import { useState, useEffect } from "react";
import { Key, Lock, FileText } from "lucide-react";
import Header, { ViewType } from "@/components/Header";
import EncryptionComponent from "@/components/EncryptionComponent";
import CodeVerification from "@/components/CodeVerification";
import FAQComponent from "@/components/FAQComponent";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>("encrypt");
  // const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('faq')) {
      setCurrentView("faq");
    }
  }, [location]);

  // Track if we should start in decrypt mode and prefill cipher
  const [initialEncrypting, setInitialEncrypting] = useState(true);
  const [initialCipher, setInitialCipher] = useState<string | undefined>(undefined);
  // Remove unused prefillCipher state

  useEffect(() => {
    // Hash-based prefill for decryption
    if (window.location.hash && window.location.hash.length > 1) {
      setCurrentView("encrypt");
      setInitialEncrypting(false); // Start in decrypt mode
      setInitialCipher(decodeURIComponent(window.location.hash.slice(1)));
    }
  }, [location]);

  return <div className="min-h-screen flex flex-col bg-background">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      {currentView === "encrypt" && <div className="bg-gradient-to-b from-secure-50 to-white pt-4 md:pt-8 pb-4 md:pb-6 border-b border-gray-100">
          <div className="satoshi-container text-center">
            <div className="flex flex-col items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
              <img src="/CryptoSeed Logo No Background.png" alt="Crypto Seed Logo" className="h-12 w-12 md:h-16 md:w-16 mb-2" />
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                Secure Your Crypto Seed Phrases
              </h1>
              <span className="block text-secure-700 text-base md:text-lg font-semibold tracking-tight mt-1 md:mt-2">Plant privacy. Sprout Freedom.</span>
            </div>
            
            <div className="max-w-3xl mx-auto px-2 md:px-0">
              <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
                Protect your critical seed phrases with advanced zero-knowledge encryption. 
                Safeguard the keys to your crypto wallets with military-grade security.
              </p>
              
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6 text-left">
                <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-1 md:mb-2">
                    <Key className="h-4 w-4 md:h-5 md:w-5 text-secure-600 mr-2" />
                    <h3 className="font-medium text-sm md:text-base text-gray-900">Seed Phrase Protection</h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 min-h-[3rem]">
                    Securely encrypt and store your wallet recovery phrases using AES-256 encryption. 
                    Prevent unauthorized access to your crypto assets.
                  </p>
                </div>
                
                <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-1 md:mb-2">
                    <FileText className="h-4 w-4 md:h-5 md:w-5 text-secure-600 mr-2" />
                    <h3 className="font-medium text-sm md:text-base text-gray-900">Text Encryption</h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 min-h-[3rem]">
                    Encrypt sensitive text messages, passwords, or confidential notes with robust encryption.
                  </p>
                </div>
                
                <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-1 md:mb-2">
                    <Lock className="h-4 w-4 md:h-5 md:w-5 text-secure-600 mr-2" />
                    <h3 className="font-medium text-sm md:text-base text-gray-900">File Encryption</h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 min-h-[3rem]">
                    Encrypt any file with a password. Secure your documents, images, and other sensitive files.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>}
      
      <main className="flex-1">
        {currentView === "encrypt" && <EncryptionComponent initialEncrypting={initialEncrypting} initialCipher={initialCipher} />}
        {currentView === "verify" && <CodeVerification />}
        {currentView === "faq" && <FAQComponent />}
      </main>
      
      <footer className="py-6 md:py-10 bg-gray-50 border-t border-gray-100">
        <div className="satoshi-container">
          <div className="mb-3 md:mb-4 text-center">
            <img src="/CryptoSeed Logo No Background.png" alt="Crypto Seed Logo" className="h-6 w-6 md:h-8 md:w-8 inline-block" />
            <p className="text-base md:text-lg text-gray-800 mt-1 md:mt-2 font-bold">Crypto Seed</p>
          </div>
          <p className="text-xs md:text-sm text-gray-600 max-w-xl mx-auto text-center px-4 md:px-0">
            Open Source, Zero-Knowledge Encryption. Your data never leaves your device.
            All encryption happens locally in your browser.
          </p>
          <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-3 md:gap-6 px-2 md:px-0">
            <a href="https://github.com/PurpleBass/cryptoseed" target="_blank" rel="noopener noreferrer" className="text-secure-500 hover:text-secure-700 hover:underline text-xs md:text-sm">
              GitHub Repository
            </a>
            <a href="#" onClick={e => {
            e.preventDefault();
            setCurrentView("verify");
          }} className="text-secure-500 hover:text-secure-700 hover:underline text-xs md:text-sm">
              Verify Code
            </a>
            <a href="#" onClick={e => {
            e.preventDefault();
            setCurrentView("faq");
          }} className="text-secure-500 hover:text-secure-700 hover:underline text-xs md:text-sm">
              Security FAQ
            </a>
          </div>
          
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-3 md:mb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-xs text-gray-500 hover:text-secure-600 h-auto py-1 px-2">
                    Terms of Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] md:max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Terms of Service</DialogTitle>
                    <DialogDescription>Last updated: {new Date().toLocaleDateString()}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm text-gray-600">
                    <p>These Terms of Service ("Terms") govern your access to and use of Crypto Seed ("the Service"). Please read these Terms carefully before using the Service.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">1. Acceptance of Terms</h3>
                    <p>By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to all the terms and conditions, you may not access or use the Service.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">2. Description of Service</h3>
                    <p>Crypto Seed is a client-side encryption tool that allows users to encrypt sensitive information using AES-256 encryption. The Service operates entirely within your browser and does not transmit your data to any servers.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">3. No Warranty</h3>
                    <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">4. Limitation of Liability</h3>
                    <p>IN NO EVENT SHALL THE SERVICE PROVIDERS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">5. User Responsibilities</h3>
                    <p>You are solely responsible for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>The security of your passwords used with the Service</li>
                      <li>Maintaining backups of your encrypted data</li>
                      <li>Ensuring the lawful use of the Service</li>
                      <li>Understanding that lost passwords cannot be recovered by us and will result in permanent loss of access to encrypted data</li>
                    </ul>
                    
                    <h3 className="text-base font-medium text-gray-900">6. Prohibited Uses</h3>
                    <p>You agree not to use the Service for any illegal or unauthorized purpose, including but not limited to violating any applicable laws or regulations.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">7. Modifications to Terms</h3>
                    <p>We reserve the right to modify these Terms at any time. Your continued use of the Service after such modifications constitutes your acceptance of the modified Terms.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">8. Governing Law</h3>
                    <p>These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law principles.</p>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-xs text-gray-500 hover:text-secure-600 h-auto py-1 px-2">
                    Privacy Policy
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] md:max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Privacy Policy</DialogTitle>
                    <DialogDescription>Last updated: {new Date().toLocaleDateString()}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm text-gray-600">
                    <p>This Privacy Policy describes how Crypto Seed ("we", "our", or "us") handles user privacy and data protection.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">1. Information Collection</h3>
                    <p>We do not collect, store, or process any personal data. The Crypto Seed application operates entirely client-side, within your browser. Your data never leaves your device, and we do not have access to any information you enter or encrypt using our Service.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">2. Local Storage</h3>
                    <p>We do not use cookies, local storage, or any other browser storage mechanisms to store or track your data.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">3. Analytics</h3>
                    <p>We do not use any analytics tools or tracking mechanisms to monitor your usage of the Service.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">4. Third-Party Services</h3>
                    <p>The Service does not integrate with any third-party services that would collect or process your data.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">5. Security</h3>
                    <p>All encryption operations occur locally on your device. We use standard, well-reviewed cryptographic libraries to perform encryption functions. For maximum security, we recommend using the Service offline once it has loaded in your browser.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">6. Changes to This Privacy Policy</h3>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                    
                    <h3 className="text-base font-medium text-gray-900">7. Contact Us</h3>
                    <p>If you have any questions about this Privacy Policy, please contact us through the GitHub repository linked on this page.</p>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-xs text-gray-500 hover:text-secure-600 h-auto py-1 px-2">
                    GNU GPL v3.0 License
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] md:max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>GNU General Public License v3.0</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 text-sm text-gray-600 font-mono">
                    <p>Copyright (c) {new Date().getFullYear()} Crypto Seed</p>
                    <p>
                      This program is free software: you can redistribute it and/or modify
                      it under the terms of the GNU General Public License as published by
                      the Free Software Foundation, either version 3 of the License, or
                      (at your option) any later version.
                    </p>
                    <p>
                      This program is distributed in the hope that it will be useful,
                      but WITHOUT ANY WARRANTY; without even the implied warranty of
                      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
                      GNU General Public License for more details.
                    </p>
                    <p>
                      You should have received a copy of the GNU General Public License
                      along with this program. If not, see &lt;https://www.gnu.org/licenses/&gt;.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto px-4 md:px-0">
              <strong>Disclaimer:</strong> We are not responsible for the use of this application or the data it manages. 
              This tool is provided for educational and security purposes only. Users are solely responsible for their 
              data, password management, and any consequences of using this service. Lost passwords cannot be recovered 
              and will result in permanent loss of encrypted data.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
