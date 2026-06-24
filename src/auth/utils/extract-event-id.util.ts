/* eslint-disable @typescript-eslint/no-explicit-any */

export function extractEventId(req: any): string | null {
  const vars = req.body?.variables ?? {};

  if (typeof vars.eventId === 'string') {
    return vars.eventId;
  }

  if (
    vars.input &&
    typeof vars.input === 'object' &&
    typeof vars.input.eventId === 'string'
  ) {
    return vars.input.eventId;
  }

  if (Array.isArray(vars.input)) {
    const first = vars.input[0];

    if (
      first &&
      typeof first === 'object' &&
      typeof first.eventId === 'string'
    ) {
      return first.eventId;
    }
  }

  if (
    vars.filter &&
    typeof vars.filter === 'object' &&
    typeof vars.filter.eventId === 'string'
  ) {
    return vars.filter.eventId;
  }

  return null;
}