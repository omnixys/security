/**
 * @license GPL-3.0-or-later
 */

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export interface GeoIpResult {
  status?: string;
  countryCode?: string;
  regionName?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  isp?: string;
  as?: string;
  query?: string;

  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  org?: string;

  ip: string;
  hostname?: string;
  loc?: string;
  postal?: string;
  readme?: string;
}

type Provider = 'ip-api' | 'ipinfo';

@Injectable()
export class GeoIpService {
  private readonly provider: Provider;
  private readonly timeout = 800;

  constructor(private readonly http: HttpService) {
    this.provider = (process.env.GEOIP_PROVIDER as Provider) ?? 'ip-api';
  }

  async lookup(ip: string | undefined): Promise<GeoIpResult | null> {
    if (!ip) return null;

    try {
      switch (this.provider) {
        case 'ipinfo':
          return await this.lookupIpInfo(ip);
        case 'ip-api':
        default:
          return await this.lookupIpApi(ip);
      }
    } catch {
      return { ip };
    }
  }

  // ------------------------------
  // Provider: ip-api (FREE, no key)
  // ------------------------------
  private async lookupIpApi(ip: string): Promise<GeoIpResult> {
    const url = `http://ip-api.com/json/${ip}`;

    const res = await firstValueFrom(this.http.get(url, { timeout: this.timeout }));

    const data = res.data;

    if (!data || data.status !== 'success') {
      return { ip };
    }

    return {
      ...data,
      ip,
    };
  }

  // ------------------------------
  // Provider: ipinfo (FREE tier)
  // ------------------------------
  private async lookupIpInfo(ip: string): Promise<GeoIpResult> {
    const token = process.env.IPINFO_TOKEN;
    const url = `https://ipinfo.io/${ip}/json`;

    const res = await firstValueFrom(
      this.http.get(url, {
        timeout: this.timeout,
        params: token ? { token } : {},
      }),
    );

    return res.data;
  }
}
