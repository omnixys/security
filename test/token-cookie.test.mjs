import { CookieService, TokenCookieService } from '../dist/index.js';
import assert from 'node:assert/strict';
import test from 'node:test';

test('sets distinct access and refresh token cookies with separate lifetimes', () => {
  const options = {
    jwt: { issuer: 'issuer', jwksUri: 'jwks' },
    cookie: {
      secure: true,
      sameSite: 'strict',
      domain: '.example.com',
      path: '/',
      accessTokenName: 'app_access',
      refreshTokenName: 'app_refresh',
      accessTokenMaxAgeMs: 60_000,
      refreshTokenMaxAgeMs: 3_600_000,
    },
  };
  const calls = [];
  const reply = {
    setCookie: (...args) => calls.push(['set', ...args]),
    clearCookie: (...args) => calls.push(['clear', ...args]),
  };
  const service = new TokenCookieService(options, new CookieService(options));

  service.setTokens(reply, {
    accessToken: 'access-value',
    refreshToken: 'refresh-value',
  });

  assert.deepEqual(calls, [
    [
      'set',
      'app_access',
      'access-value',
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        domain: '.example.com',
        path: '/',
        maxAge: 60,
      },
    ],
    [
      'set',
      'app_refresh',
      'refresh-value',
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        domain: '.example.com',
        path: '/',
        maxAge: 3_600,
      },
    ],
  ]);
});

test('clears both configured token cookie names with matching policy', () => {
  const options = {
    jwt: { issuer: 'issuer', jwksUri: 'jwks' },
    cookie: {
      domain: '.example.com',
      accessTokenName: 'app_access',
      refreshTokenName: 'app_refresh',
    },
  };
  const calls = [];
  const reply = {
    setCookie() {},
    clearCookie: (...args) => calls.push(args),
  };
  const service = new TokenCookieService(options, new CookieService(options));

  service.clearTokens(reply);

  assert.equal(calls[0][0], 'app_access');
  assert.equal(calls[1][0], 'app_refresh');
  assert.equal(calls[0][1].domain, '.example.com');
  assert.equal(calls[0][1].httpOnly, true);
});

test('rejects invalid token cookie lifetimes', () => {
  const options = { jwt: { issuer: 'issuer', jwksUri: 'jwks' } };
  const service = new TokenCookieService(options, new CookieService(options));
  const reply = { setCookie() {}, clearCookie() {} };

  assert.throws(
    () =>
      service.setTokens(
        reply,
        { accessToken: 'access', refreshToken: 'refresh' },
        { accessTokenMaxAgeMs: Number.NaN },
      ),
    RangeError,
  );
});
