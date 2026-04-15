import { createHmac } from 'crypto';

export function createFingerprint(
  input: {
    userAgent: string;
    acceptLanguage?: string;
    //ip?: string;
    clientDeviceId?: string;
  },
  secret: string,
): string {
  const raw = `${input.userAgent}|${input.acceptLanguage ?? ''}|${input.clientDeviceId ?? ''}`;
  return createHmac('sha256', secret).update(raw).digest('hex');
}
