import {
  errorDetails,
  type SecurityErrorMetadata,
} from '../../errors/security.exception.js';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export class StepUpRequiredException extends UnauthorizedException {
  readonly code = 'STEP_UP_REQUIRED';
  readonly requestId!: string;
  readonly correlationId!: string;
  readonly traceId?: string;
  readonly actorId?: string;
  readonly tenantId?: string;
  readonly metadata!: SecurityErrorMetadata;

  constructor(
    public readonly method: 'TOTP' | 'WEBAUTHN',
    public readonly reasons: string[],
  ) {
    const details = errorDetails(
      'STEP_UP_REQUIRED',
      'Step-up authentication required',
      { method, reasons },
    );
    super(details);
    Object.assign(this, details);
  }
}

export class AccessBlockedException extends ForbiddenException {
  readonly code = 'ACCESS_BLOCKED';
  readonly requestId!: string;
  readonly correlationId!: string;
  readonly traceId?: string;
  readonly actorId?: string;
  readonly tenantId?: string;
  readonly metadata!: SecurityErrorMetadata;

  constructor(public readonly reasons: string[]) {
    const details = errorDetails(
      'ACCESS_BLOCKED',
      'Access blocked due to high risk',
      { reasons },
    );
    super(details);
    Object.assign(this, details);
  }
}
