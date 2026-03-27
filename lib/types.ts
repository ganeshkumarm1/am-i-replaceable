export type RiskLabel =
  | "Already Replaced"
  | "Living on Borrowed Time"
  | "Partially Automatable"
  | "Human Still Needed"
  | "AI-Proof for Now"
  | "Uniquely Human";

export interface AnalyzeRequest {
  situation: string;
  values: string[];
  language: string;
  tone: 'Nice' | 'Honest' | 'Brutal';
}

export interface AnalyzeResponse {
  months_until_replaced: number;
  annual_savings: number;
  risk_label: RiskLabel;
  explanation: string;
  what_ai_would_do: string;
  share_message: string;
}

export interface ErrorResponse {
  error: string;
}

export type AppState =
  | { phase: "form"; error?: string }
  | { phase: "loading" }
  | { phase: "result"; data: AnalyzeResponse };
