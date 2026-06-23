import { ForbiddenException } from '@nestjs/common';
import { ErrorCode } from '@omnixys/contracts';
import { errorDetails } from './security.exception.js';

export class EventAccessDeniedException extends ForbiddenException {
  readonly code = ErrorCode.EVENT_ACCESS_DENIED;

  constructor(
    eventId: string,
    reason: string,
  ) {
    const details = errorDetails(ErrorCode.EVENT_ACCESS_DENIED, 'Event access denied', {
      eventId,
      reason,
    });
    super(details);
  }
}
