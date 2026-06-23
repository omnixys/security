/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

export function extractEventId(req: any): string | null {
  const vars = req.body?.variables ?? {};

  // 1) Direct eventId argument
  if (typeof vars.eventId === 'string') {
    return vars.eventId;
  }

  // 2) Inside input object
  if (vars.input && typeof vars.input.eventId === 'string') {
    return vars.input.eventId;
  }

  // 3) Input array (e.g. SetTimelineInput[])
  const input = vars.input;
  if (Array.isArray(input)) {
    const first: unknown = input[0];

    if (
      typeof first === 'object' &&
      first !== null &&
      typeof (first as Record<string, unknown>).eventId === 'string'
    ) {
      return (first as Record<string, unknown>).eventId as string;
    }
  }

  return null;
}
