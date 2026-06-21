export interface SecurityAuditEvent {
  type: 'LOGIN' | 'LOGOUT' | 'TOKEN_REVOKED' | 'ACCESS_DENIED';
  userId?: string;
  ip?: string;
  userAgent?: string;
  timestamp: number;
  requestId?: string;
  correlationId?: string;
  traceId?: string;
  actorId?: string;
  tenantId?: string;
  meta?: Record<string, unknown>;
}
