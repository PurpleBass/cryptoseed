import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type EncryptionMode = "seedphrase" | "text" | "file";

export function useEncryption(initialEncrypting?: boolean) {
  // Encryption mode state (seed phrase, text, or file)
  const [mode, setMode] = useState<EncryptionMode>("text");
  
  // Core encryption states
  const [isEncrypting, setIsEncrypting] = useState(initialEncrypting ?? true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [output, setOutput] = useState("");
  
  // Mode-specific states
  const [textInput, setTextInput] = useState<any>({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: []
      }
    ]
  });
  const [seedPhrase, setSeedPhrase] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Reset output and file selection when switching between encryption/decryption modes
  useEffect(() => {
    setOutput("");
    setSelectedFile(null);
    setProgress(0);
    
    // Reset textInput based on the current mode
    if (isEncrypting) {
      // For encryption mode: use Tiptap JSON structure
      setTextInput({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: []
          }
        ]
      });
    } else {
      // For decryption mode: use empty string for encrypted text input
      setTextInput("");
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [isEncrypting]);

  // Progress callback for encryption operations
  const handleProgress = (progressValue: number) => {
    setProgress(progressValue);
  };

  const formatSeedPhrase = (phrase: string): string => {
    return phrase.trim();
  };

  // File handling utilities
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Password utilities
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const clearPassword = () => setPassword("");
  
  // Clipboard utilities
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard",
      description: "The output has been copied to your clipboard. It will be cleared in 30 seconds for your security."
    });
    // Auto-wipe clipboard after 30 seconds
    setTimeout(async () => {
      // Only clear if clipboard still contains our output
      try {
        const current = await navigator.clipboard.readText();
        if (current === output) {
          await navigator.clipboard.writeText("");
          toast({
            title: "Clipboard cleared",
            description: "Sensitive data was removed from your clipboard for your security.",
            variant: "default"
          });
        }
      } catch (e) {
        // Ignore errors (e.g., permissions)
      }
    }, 30000); // 30 seconds
  };

  // Copy formatted content (for decryption mode - copies HTML with formatting)
  const copyFormattedContent = (htmlContent: string, plainTextContent: string) => {
    // Use the modern clipboard API to write both HTML and plain text
    const clipboardItem = new ClipboardItem({
      'text/html': new Blob([htmlContent], { type: 'text/html' }),
      'text/plain': new Blob([plainTextContent], { type: 'text/plain' })
    });
    
    navigator.clipboard.write([clipboardItem]).then(() => {
      toast({
        title: "Copied with formatting",
        description: "The formatted content has been copied to your clipboard. It will be cleared in 30 seconds for your security."
      });
      
      // Auto-wipe clipboard after 30 seconds
      setTimeout(async () => {
        try {
          const current = await navigator.clipboard.readText();
          if (current === plainTextContent) {
            await navigator.clipboard.writeText("");
            toast({
              title: "Clipboard cleared",
              description: "Sensitive data was removed from your clipboard for your security.",
              variant: "default"
            });
          }
        } catch (e) {
          // Ignore errors (e.g., permissions)
        }
      }, 30000); // 30 seconds
    }).catch(() => {
      // Fallback to plain text if HTML copying fails
      navigator.clipboard.writeText(plainTextContent);
      toast({
        title: "Copied as plain text",
        description: "The content has been copied as plain text to your clipboard."
      });
    });
  };

  // Clear utilities
  const clearTextInput = () => {
    if (isEncrypting) {
      // For encryption mode: reset to empty Tiptap structure
      setTextInput({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: []
          }
        ]
      });
    } else {
      // For decryption mode: reset to empty string
      setTextInput("");
    }
  };
  const clearSeedPhrase = () => setSeedPhrase("");

  // Load .cryptoseed file content for decryption
  const loadCryptoSeedFile = (encryptedContent: string) => {
    if (!isEncrypting) {
      setTextInput(encryptedContent);
      toast({
        title: "File loaded",
        description: "The .cryptoseed file has been loaded for decryption."
      });
    }
  };

  // Helper to securely wipe a string by overwriting with random data
  const wipeString = (strSetter: (v: string) => void, length: number) => {
    if (length > 0) {
      const arr = new Uint8Array(length);
      window.crypto.getRandomValues(arr);
      strSetter(String.fromCharCode(...arr));
    }
    strSetter("");
  };

  // Session timeout for auto-wipe (2 minutes of inactivity)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        // Overwrite sensitive state with random data before clearing
        wipeString(setOutput, output.length);
        wipeString(setPassword, password.length);
        // For textInput (now JSON), just clear it directly
        clearTextInput();
        wipeString(setSeedPhrase, seedPhrase.length);
        setSelectedFile(null);
        // Wipe clipboard if it contains our output
        try {
          const current = await navigator.clipboard.readText();
          if (current === output && output.length > 0) {
            await navigator.clipboard.writeText("");
          }
        } catch (e) {}
        toast({
          title: "Session expired",
          description: "Sensitive data was cleared after inactivity.",
          variant: "default"
        });
      }, 2 * 60 * 1000); // 2 minutes
    };
    // Listen for user activity
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    window.addEventListener("focus", resetTimer);
    resetTimer();
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      window.removeEventListener("focus", resetTimer);
    };
  }, [toast, output, password, textInput, seedPhrase]);

  return {
    // States
    mode,
    isEncrypting,
    isProcessing,
    progress,
    password,
    showPassword,
    output,
    textInput,
    seedPhrase,
    selectedFile,
    fileInputRef,
    
    // Setters
    setMode,
    setIsEncrypting,
    setIsProcessing,
    setProgress,
    setPassword,
    setOutput,
    setTextInput,
    setSeedPhrase,
    
    // Functions
    handleFileSelect,
    clearFileSelection,
    togglePasswordVisibility,
    clearPassword,
    copyToClipboard,
    copyFormattedContent,
    clearTextInput,
    clearSeedPhrase,
    loadCryptoSeedFile,
    formatSeedPhrase,
    handleProgress,
    toast
  };
}
