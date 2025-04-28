
interface CSPViolationReport {
  'csp-report'?: {
    'document-uri': string;
    'violated-directive': string;
    'original-policy': string;
    'blocked-uri': string;
  };
  // Modern CSP report format
  type?: string;
  disposition?: string;
  body?: {
    documentURL?: string;
    violatedDirective?: string;
    effectiveDirective?: string;
    originalPolicy?: string;
    blockedURL?: string;
    sourceFile?: string;
    lineNumber?: number;
    columnNumber?: number;
  }
}

export function handleCSPViolation(report: CSPViolationReport) {
  // Handle both legacy and modern report formats
  if (report['csp-report']) {
    // Legacy format
    console.warn('CSP Violation:', {
      documentUri: report['csp-report']['document-uri'],
      violatedDirective: report['csp-report']['violated-directive'],
      originalPolicy: report['csp-report']['original-policy'],
      blockedUri: report['csp-report']['blocked-uri']
    });
  } else if (report.type === 'csp-violation' && report.body) {
    // Modern format
    console.warn('CSP Violation:', {
      documentUri: report.body.documentURL,
      violatedDirective: report.body.violatedDirective || report.body.effectiveDirective,
      originalPolicy: report.body.originalPolicy,
      blockedUri: report.body.blockedURL,
      sourceFile: report.body.sourceFile,
      lineNumber: report.body.lineNumber,
      columnNumber: report.body.columnNumber
    });
  } else {
    // Unknown format
    console.warn('Unknown CSP Violation format:', report);
  }
}
