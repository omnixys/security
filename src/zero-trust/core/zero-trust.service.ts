import { PolicyService } from '../policy/policy.service.js';
import { RiskEngineService } from '../risk/risk-engine.service.js';
import { RiskMemoryService } from '../risk/risk-memory.service.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ZeroTrustService {
  constructor(
    private readonly risk: RiskEngineService,
    private readonly policy: PolicyService,
    private readonly memory: RiskMemoryService,
  ) {}

  async evaluate(context: any) {
    const failures = await this.memory.getFailures(context.userId);
    const previousIp = await this.memory.getLastIp(context.userId);

    const result = await this.risk.evaluate({
      ...context,
      failedAttempts: failures,
      previousIp,
    });

    return this.policy.enforce(result);
  }
}
