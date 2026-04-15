export interface SecurityAuditEvent {
  type: 'LOGIN' | 'LOGOUT' | 'TOKEN_REVOKED' | 'ACCESS_DENIED';
  userId?: string;
  ip?: string;
  userAgent?: string;
  timestamp: number;
  meta?: Record<string, unknown>;
}
