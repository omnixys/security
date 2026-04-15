import { SecurityAuditEvent } from './audit.types.js';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SecurityAuditService {
  constructor(
    @Inject('AUDIT_PRODUCER')
    private readonly producer: {
      send(topic: string, message: unknown): Promise<void>;
    },
  ) {}

  async log(event: SecurityAuditEvent): Promise<void> {
    await this.producer.send('security.audit', {
      ...event,
      timestamp: Date.now(),
    });
  }
}
