
import React from "react";
import EncryptionContainer from "./encryption/EncryptionContainer";
import EncryptionVisual from "./EncryptionVisual";
import OfflineGuide from "./OfflineGuide";

/**
 * EncryptionComponent
 * 
 * Main component that renders the encryption functionality of the application.
 * This component serves as the primary wrapper for all encryption-related components
 * including the main encryption interface, educational visuals, and offline usage guides.
 * 
 * Features:
 * - Encryption Container: Handles text, file, and seed phrase encryption
 * - Visual Encryption Explainer: Interactive diagrams explaining encryption processes
 * - Offline Usage Guide: Comprehensive instructions for offline operation
 * 
 * The encryption functionality is implemented using AES-256-GCM with enhanced
 * key derivation (PBKDF2 with 600,000 iterations) for secure encryption and decryption.
 * All operations are performed locally in the browser without sending any data online.
 * 
 * @returns {JSX.Element} The complete encryption interface with visual aids
 */
const EncryptionComponent = () => {
  return (
    <div className="space-y-6 md:space-y-10 py-6">
      <EncryptionContainer />
      <EncryptionVisual />
      <OfflineGuide />
    </div>
  );
};

export default EncryptionComponent;
