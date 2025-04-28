
import type { CSPViolationReport } from './cspReport';

interface CSPViolationReport {
  'csp-report': {
    'document-uri': string;
    'violated-directive': string;
    'original-policy': string;
    'blocked-uri': string;
    'disposition': string;
    'source-file'?: string;
    'line-number'?: number;
    'column-number'?: number;
    'status-code'?: number;
  }
}

export function handleCSPViolation(report: CSPViolationReport) {
  console.warn('CSP Violation:', {
    documentUri: report['csp-report']['document-uri'],
    violatedDirective: report['csp-report']['violated-directive'],
    originalPolicy: report['csp-report']['original-policy'],
    blockedUri: report['csp-report']['blocked-uri'],
    disposition: report['csp-report']['disposition'],
    sourceFile: report['csp-report']['source-file'],
    lineNumber: report['csp-report']['line-number'],
    columnNumber: report['csp-report']['column-number'],
    statusCode: report['csp-report']['status-code']
  });
  
  // In a production environment, you might want to send this to your logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement production logging
  }
}

// Generate a cryptographically secure nonce
export function generateNonce(): string {
  // Use Node crypto in Node.js environment (for Vite config)
  if (typeof globalThis !== 'undefined' && typeof globalThis.window === 'undefined' && 'crypto' in globalThis) {
    try {
      const crypto = require('crypto');
      return crypto.randomBytes(16).toString('hex');
    } catch (err) {
      // Fallback for environments where crypto isn't available
      return Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15);
    }
  }
  
  // Use Web Crypto API in browser environment
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
