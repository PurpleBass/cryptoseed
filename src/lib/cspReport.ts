
interface CSPViolationReport {
  'csp-report': {
    'document-uri': string;
    'violated-directive': string;
    'original-policy': string;
    'blocked-uri': string;
    'source-file'?: string;
    'line-number'?: number;
    'column-number'?: number;
    'status-code'?: number;
  }
}

export function handleCSPViolation(report: CSPViolationReport) {
  // Log CSP violations for monitoring
  console.warn('CSP Violation:', {
    documentUri: report['csp-report']['document-uri'],
    violatedDirective: report['csp-report']['violated-directive'],
    originalPolicy: report['csp-report']['original-policy'],
    blockedUri: report['csp-report']['blocked-uri'],
    sourceFile: report['csp-report']['source-file'],
    lineNumber: report['csp-report']['line-number'],
    columnNumber: report['csp-report']['column-number'],
    statusCode: report['csp-report']['status-code']
  });

  // In production, you might want to send this to your logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement production logging
  }
}
