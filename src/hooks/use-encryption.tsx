
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type EncryptionMode = "seedphrase" | "text" | "file";

export function useEncryption() {
  // Encryption mode state (seed phrase, text, or file)
  const [mode, setMode] = useState<EncryptionMode>("seedphrase");
  
  // Core encryption states
  const [isEncrypting, setIsEncrypting] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [output, setOutput] = useState("");
  
  // Mode-specific states
  const [textInput, setTextInput] = useState("");
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
      description: "The output has been copied to your clipboard"
    });
  };

  // Clear utilities
  const clearTextInput = () => setTextInput("");
  const clearSeedPhrase = () => setSeedPhrase("");

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
    formatSeedPhrase,
    handleProgress,
    toast
  };
}
