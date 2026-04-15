import { GeoIpService } from '../core/geoip.service.js';
import { DeviceService } from '../device/device.service.js';
import { RiskContext, RiskResult } from './risk.types.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RiskEngineService {
  constructor(
    private readonly geo: GeoIpService,
    private readonly devices: DeviceService,
  ) {}

  async evaluate(context: RiskContext): Promise<RiskResult> {
    const reasons: string[] = [];
    let score = 0;

    const geo = await this.geo.lookup(context.ip);
    const previousGeo =
      context.previousIp && context.previousIp !== context.ip
        ? await this.geo.lookup(context.previousIp)
        : null;

    const isKnownDevice = context.clientDeviceId
      ? await this.devices.isKnown(context.userId, context.clientDeviceId)
      : false;

    // Device Risk
    if (!isKnownDevice) {
      score += 20;
      reasons.push('unknown_device');
    }

    // IP Change
    if (context.previousIp && context.previousIp !== context.ip) {
      score += 15;
      reasons.push('ip_changed');
    }

    // Geo: Country Change
    if (geo && previousGeo && geo.countryCode !== previousGeo.countryCode) {
      score += 30;
      reasons.push('country_changed');
    }

    // Geo: High Risk Countries
    const HIGH_RISK_COUNTRIES = ['RU', 'IR', 'KP', 'SY'];

    if (geo?.countryCode && HIGH_RISK_COUNTRIES.includes(geo.countryCode)) {
      score += 40;
      reasons.push('high_risk_country');
    }

    // Failed Attempts
    if (context.failedAttempts >= 3) {
      score += 20;
      reasons.push('failed_attempts>=3');
    }

    if (context.failedAttempts >= 6) {
      score += 30;
      reasons.push('failed_attempts>=6');
    }

    // Flow Signals
    if (context.isResetFlow) {
      score += 15;
      reasons.push('reset_flow');
    }

    if (context.isPasswordless) {
      score += 10;
      reasons.push('passwordless_flow');
    }

    // Clamp Score
    score = Math.max(0, Math.min(100, score));

    // Decision
    if (score >= 85) {
      return { score, decision: 'BLOCK', reasons };
    }

    if (score >= 60) {
      return { score, decision: 'STEP_UP', stepUp: 'WEBAUTHN', reasons };
    }

    if (score >= 35) {
      return { score, decision: 'STEP_UP', stepUp: 'TOTP', reasons };
    }

    return { score, decision: 'ALLOW', reasons };
  }
}
