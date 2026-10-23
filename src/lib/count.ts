export const MIN_WALLET_COUNT = 1;
export const MAX_WALLET_COUNT = 10000;

/** Parses a wallet count, returning null when it isn't a whole number */
export function parseCount(value: string | number): number | null {
  const count = typeof value === "number" ? value : Number(value);
  return Number.isInteger(count) ? count : null;
}

/** Splits a count into `parts` sizes that differ by at most one */
export function splitCount(count: number, parts: number): number[] {
  const size = Math.floor(count / parts);
  const remainder = count % parts;

  return Array.from(
    { length: parts },
    (_, i) => size + (i < remainder ? 1 : 0),
  );
}

/** Clamps a wallet count to the supported range */
export function clampCount(count: number): number {
  return Math.min(Math.max(count, MIN_WALLET_COUNT), MAX_WALLET_COUNT);
}
