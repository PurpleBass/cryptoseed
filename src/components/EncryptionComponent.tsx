
import EncryptionContainer from "./encryption/EncryptionContainer";

/**
 * EncryptionComponent
 * 
 * Main component that renders the encryption functionality of the application.
 * This component acts as a wrapper for the EncryptionContainer which handles
 * all the various encryption options like text, file, and seed phrase encryption.
 * 
 * The encryption functionality is implemented using ChaCha20-Poly1305 with enhanced
 * key derivation (PBKDF2 with 600,000 iterations) for secure encryption and decryption.
 * All operations are performed locally in the browser without sending any data online.
 * 
 * @returns {JSX.Element} The encryption interface
 */

export interface EncryptionComponentProps {
  initialEncrypting?: boolean;
  initialCipher?: string | undefined;
}

const EncryptionComponent = ({ initialEncrypting = true, initialCipher }: EncryptionComponentProps) => {
  return <EncryptionContainer initialEncrypting={initialEncrypting} initialCipher={initialCipher} />;
};

export default EncryptionComponent;
