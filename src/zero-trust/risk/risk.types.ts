export type RiskDecision = 'ALLOW' | 'STEP_UP' | 'BLOCK';

export type StepUpMethod = 'TOTP' | 'WEBAUTHN';

export interface RiskContext {
  userId: string;
  ip?: string;
  userAgent?: string;
  acceptLanguage?: string;
  clientDeviceId?: string;

  isPasswordless: boolean;
  isResetFlow: boolean;

  failedAttempts: number;

  previousIp?: string;
}

export interface RiskResult {
  score: number;
  decision: RiskDecision;
  stepUp?: StepUpMethod;
  reasons: string[];
}
