export class StepUpRequiredException extends Error {
  constructor(
    public readonly method: 'TOTP' | 'WEBAUTHN',
    public readonly reasons: string[],
  ) {
    super('Step-up authentication required');
  }
}

export class AccessBlockedException extends Error {
  constructor(public readonly reasons: string[]) {
    super('Access blocked due to high risk');
  }
}
