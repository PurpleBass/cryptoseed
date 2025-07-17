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
  const [textInput, setTextInput] = useState<string>("");
  const [seedPhrase, setSeedPhrase] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Reset data when switching between encryption/decryption modes for cleaner UX
  useEffect(() => {
    setOutput("");
    setSelectedFile(null);
    setSeedPhrase(""); // Clear seed phrase when toggling modes
    setProgress(0);
    
    // Reset textInput based on the current mode
    if (isEncrypting) {
      // For encryption mode: use empty string
      setTextInput("");
    } else {
      // For decryption mode: use empty string for encrypted text input
      setTextInput("");
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [isEncrypting]);

  // Clear irrelevant data when switching between tabs (text/file/seedphrase) for cleaner UX
  useEffect(() => {
    setOutput("");
    setProgress(0);
    
    // Clear mode-specific data when switching tabs
    if (mode === "text") {
      // Clear file and seed phrase data when switching to text tab
      setSelectedFile(null);
      setSeedPhrase("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else if (mode === "file") {
      // Clear text and seed phrase data when switching to file tab
      setSeedPhrase("");
      if (isEncrypting) {
        setTextInput("");
      } else {
        setTextInput("");
      }
    } else if (mode === "seedphrase") {
      // Clear text and file data when switching to seed phrase tab
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (isEncrypting) {
        setTextInput("");
      } else {
        setTextInput("");
      }
    }
    // Note: Password is preserved when switching tabs for user convenience
  }, [mode, isEncrypting]);

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
  
  // Simple clipboard utilities - no clearing needed since we only copy encrypted data
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard",
      description: "Encrypted data has been copied to your clipboard."
    });
  };

  // Clear utilities
  const clearTextInput = () => {
    if (isEncrypting) {
      // For encryption mode: reset to empty string
      setTextInput("");
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
    clearTextInput,
    clearSeedPhrase,
    loadCryptoSeedFile,
    formatSeedPhrase,
    handleProgress,
    toast
  };
}
