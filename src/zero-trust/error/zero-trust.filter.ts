/**
 * @license GPL-3.0-or-later
 */

import { StepUpRequiredException } from './zero-trust.exception.js';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(StepUpRequiredException)
export class ZeroTrustExceptionFilter implements ExceptionFilter {
  catch(exception: StepUpRequiredException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    const acr = exception.method === 'WEBAUTHN' ? 'webauthn' : 'otp';

    res.status(401).json({
      error: 'step_up_required',
      code: exception.code,
      message: exception.message,
      requestId: exception.requestId,
      correlationId: exception.correlationId,
      traceId: exception.traceId,
      actorId: exception.actorId,
      tenantId: exception.tenantId,
      acr,
      reasons: exception.reasons,
    });
  }
}
