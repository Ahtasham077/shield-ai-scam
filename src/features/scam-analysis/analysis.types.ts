export type RiskLevel = "low" | "medium" | "high" | "critical";
export type SignalSeverity = "low" | "medium" | "high";

export type ScamAnalysis = {
  risk_level: RiskLevel;
  message_category: string;
  summary: string;
  warning_signs: Array<{ phrase: string; reason: string; severity: SignalSeverity }>;
  positive_signs: string[];
  recommended_actions: string[];
  urgency_detected: boolean;
  credential_request_detected: boolean;
  financial_request_detected: boolean;
  suspicious_link_detected: boolean;
  confidence: "low" | "moderate" | "high";
  limitations: string;
};
