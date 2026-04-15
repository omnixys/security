import jwksRsa, { type JwksClient } from 'jwks-rsa';

export function createJwksClient(jwksUri: string): JwksClient {
  return jwksRsa({
    jwksUri,
    cache: true,
    cacheMaxEntries: 5,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
  });
}
