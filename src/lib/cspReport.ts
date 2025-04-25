
interface CSPViolationReport {
  'csp-report': {
    'document-uri': string;
    'violated-directive': string;
    'original-policy': string;
    'blocked-uri': string;
  }
}

export function handleCSPViolation(report: CSPViolationReport) {
  console.warn('CSP Violation:', {
    documentUri: report['csp-report']['document-uri'],
    violatedDirective: report['csp-report']['violated-directive'],
    originalPolicy: report['csp-report']['original-policy'],
    blockedUri: report['csp-report']['blocked-uri']
  });
}
