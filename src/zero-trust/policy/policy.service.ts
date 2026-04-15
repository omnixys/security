import { RiskResult } from '../risk/risk.types.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PolicyService {
  enforce(result: RiskResult): RiskResult {
    return result;
  }
}
