import {
  GeoIpService,
  RateLimitService,
  RiskMemoryService,
  SecureSessionService,
  SessionExpiredException,
  ZeroTrustModule,
} from '../dist/index.js';
import assert from 'node:assert/strict';
import test from 'node:test';
import { throwError } from 'rxjs';

test('issues sessions with canonical session and authentication metadata', async () => {
  let encrypted;
  const jwe = {
    async encrypt(value) {
      encrypted = value;
      return 'encrypted';
    },
    async decrypt() {
      return encrypted;
    },
  };
  const service = new SecureSessionService(jwe, {
    session: { ttlMs: 60_000 },
  });

  const token = await service.issue(
    { subject: 'subject-1' },
    {
      sessionId: 'session-1',
      authenticatedAtEpochMs: 1234,
      authStrength: 'mfa',
    },
  );
  const metadata = await service.metadata(token);

  assert.equal(token, 'encrypted');
  assert.equal(encrypted.subject, 'subject-1');
  assert.equal(metadata.sessionId, 'session-1');
  assert.equal(metadata.authenticatedAtEpochMs, 1234);
  assert.equal(metadata.authStrength, 'mfa');
  assert.equal(metadata.expiresAtEpochMs - metadata.issuedAtEpochMs, 60_000);
});

test('maps expired sessions to a structured compatibility exception', async () => {
  const service = new SecureSessionService(
    {
      async decrypt() {
        return { exp: Date.now() - 1 };
      },
    },
    {},
  );

  await assert.rejects(service.read('expired'), (error) => {
    assert.ok(error instanceof SessionExpiredException);
    assert.equal(error.code, 'SESSION_EXPIRED');
    assert.equal(error.requestId, 'unscoped');
    return true;
  });
});

test('risk memory has safe behavior when no optional store is configured', async () => {
  const service = new RiskMemoryService();

  assert.equal(await service.incrementFailures('user-1'), 0);
  assert.equal(await service.getFailures('user-1'), 0);
  assert.equal(await service.getLastIp('user-1'), null);
  assert.equal(await service.isStepUpValid('user-1', {}), false);
  await service.resetFailures('user-1');
  await service.storeLastIp('user-1', '192.0.2.1');
  await service.markStepUpVerified('user-1', {});
  await service.clearStepUp('user-1', {});
});

test('ZeroTrustModule registers configured device and risk-memory stores', () => {
  const device = { get() {}, set() {}, del() {} };
  const riskMemoryStore = {
    ...device,
    incr() {},
    expire() {},
  };
  const module = ZeroTrustModule.forRoot({ device, riskMemoryStore });
  const providers = module.providers.filter(
    (provider) => typeof provider === 'object' && provider !== null,
  );

  assert.equal(
    providers.find((provider) => provider.provide === 'DEVICE_STORE').useValue,
    device,
  );
  assert.equal(
    providers.find((provider) => provider.provide === 'RISK_MEMORY_STORE')
      .useValue,
    riskMemoryStore,
  );
});

test('rate limiting is optional but fails fast when enabled without a store', async () => {
  const disabled = new RateLimitService({ rateLimit: { enabled: false } });
  assert.deepEqual(await disabled.isAllowed('key'), { allowed: true });

  const enabled = new RateLimitService({ rateLimit: { enabled: true } });
  await assert.rejects(
    enabled.isAllowed('key'),
    /no rateLimitStore is configured/,
  );
});

test('rate limiting reports remaining capacity and retry timing', async () => {
  let current = 0;
  const store = {
    async incr() {
      return ++current;
    },
    async expire() {},
    async ttl() {
      return 7;
    },
  };
  const service = new RateLimitService(
    { rateLimit: { enabled: true, defaultLimit: 1, defaultWindowMs: 10_000 } },
    store,
  );

  const before = Date.now();
  const allowed = await service.isAllowed('key');
  assert.equal(allowed.allowed, true);
  assert.equal(allowed.remaining, 0);
  assert.ok(allowed.resetAt >= before + 7_000);
  assert.ok(allowed.resetAt <= Date.now() + 7_000);
  const denied = await service.isAllowed('key');
  assert.equal(denied.allowed, false);
  assert.equal(denied.retryAfterSeconds, 7);
  assert.equal(denied.remaining, 0);
});

test('localhost GeoIP never fabricates production location metadata', async () => {
  const requests = [];
  const service = new GeoIpService({
    get(url) {
      requests.push(url);
      return throwError(() => new Error('offline'));
    },
  });

  assert.deepEqual(await service.lookup('127.0.0.1'), { ip: '127.0.0.1' });
  assert.deepEqual(requests, ['http://ip-api.com/json/127.0.0.1']);
});
