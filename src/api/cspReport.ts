
import { handleCSPViolation } from "@/lib/cspReport";

/**
 * API handler for CSP violation reports
 * This would be implemented as a server endpoint in a full implementation
 * For now, we'll handle it client-side with our existing handler
 */
export async function handleCSPReportEndpoint(report: string) {
  try {
    const reportData = JSON.parse(report);
    handleCSPViolation(reportData);
    return { success: true };
  } catch (error) {
    console.error("Failed to process CSP report:", error);
    return { success: false, error: "Failed to process report" };
  }
}
