
import React from "react";
import EncryptionContainer from "./encryption/EncryptionContainer";

/**
 * EncryptionComponent
 * 
 * Main component that renders the encryption functionality of the application.
 * This component acts as a wrapper for the EncryptionContainer which handles
 * all the various encryption options like text, file, and seed phrase encryption.
 * 
 * The encryption functionality is implemented using AES-256-GCM with enhanced
 * key derivation (PBKDF2 with 600,000 iterations) for secure encryption and decryption.
 * All operations are performed locally in the browser without sending any data online.
 * 
 * @returns {JSX.Element} The encryption interface
 */
const EncryptionComponent = () => {
  return <EncryptionContainer />;
};

export default EncryptionComponent;
