import {
  AccessBlockedException,
  StepUpRequiredException,
} from '../error/zero-trust.exception.js';
import { ZeroTrustService } from './zero-trust.service.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getRequest } from '@omnixys/context';

@Injectable()
export class ZeroTrustGuard implements CanActivate {
  constructor(private readonly zeroTrust: ZeroTrustService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = getRequest(context);
    const user = req.user;

    if (!user) return false;

    const result = await this.zeroTrust.evaluate({
      userId: user.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      acceptLanguage: req.headers['accept-language'],
      clientDeviceId: req.cookies?.device_id,
      isPasswordless: false,
      isResetFlow: false,
    });

    if (result.decision === 'BLOCK') {
      throw new AccessBlockedException(result.reasons);
    }

    if (result.decision === 'STEP_UP') {
      throw new StepUpRequiredException(result.stepUp!, result.reasons);
    }

    return true;
  }
}
