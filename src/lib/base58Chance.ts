import { BASE58_ALPHABET } from "../wallets/vanity";
import type { Base58Range } from "../types/wallet";

const BASE = 58n;
const BYTE = 256n;

/** Digit value of each base58 character */
const DIGITS = new Map(
  [...BASE58_ALPHABET].map((char, value) => [char, BigInt(value)]),
);

/** Numbers in [min, max) whose base58 form starts with the given digits */
function countWithLeadingDigits(digits: bigint[], min: bigint, max: bigint) {
  const prefix = digits.reduce((value, digit) => value * BASE + digit, 0n);
  let count = 0n;

  /* Every length a number in the range can have, from the prefix's own */
  for (
    let length = digits.length, low = BASE ** BigInt(length - 1);
    low < max;
    length++, low *= BASE
  ) {
    const scale = BASE ** BigInt(length - digits.length);
    const from = [prefix * scale, low, min].reduce((a, b) => (a > b ? a : b));
    const to = [(prefix + 1n) * scale, low * BASE, max].reduce((a, b) =>
      a < b ? a : b,
    );

    if (to > from) count += to - from;
  }

  return count;
}

/**
 * Chance that the base58 form of a uniformly random value starts with a
 * prefix. Leading "1"s stand for leading zero bytes, as base58 encodes them.
 */
function exactPrefixChance(prefix: string, range: Base58Range) {
  const leadingOnes = prefix.length - prefix.replace(/^1+/, "").length;
  const rest = prefix.slice(leadingOnes);

  if (range.leadingByte !== undefined) {
    /* A fixed non-zero first byte means the string never starts with "1" */
    if (leadingOnes > 0) return 0;

    const span = BYTE ** BigInt(range.bytes - 1);
    const min = BigInt(range.leadingByte) * span;
    const digits = [...rest].map((char) => DIGITS.get(char)!);

    return (
      Number(countWithLeadingDigits(digits, min, min + span)) / Number(span)
    );
  }

  /* Exactly that many zero bytes, then a value whose first byte isn't zero */
  const zeroBytesChance = Number(BYTE) ** -leadingOnes;

  if (!rest) return zeroBytesChance;

  const remaining = range.bytes - leadingOnes;
  const max = BYTE ** BigInt(remaining);
  const min = BYTE ** BigInt(remaining - 1);
  const digits = [...rest].map((char) => DIGITS.get(char)!);

  return (
    (zeroBytesChance * Number(countWithLeadingDigits(digits, min, max))) /
    Number(max)
  );
}

/** Every spelling of a prefix that matches it when case is ignored */
function caseVariants(prefix: string): string[] {
  return [...prefix].reduce<string[]>(
    (variants, char) => {
      const options = [
        ...new Set([char, char.toLowerCase(), char.toUpperCase()]),
      ].filter((option) => DIGITS.has(option));

      return variants.flatMap((variant) =>
        options.map((option) => variant + option),
      );
    },
    [""],
  );
}

/** Chance that a random address in the range starts with a prefix */
export function base58PrefixChance(
  prefix: string,
  range: Base58Range,
  ignoreCase: boolean,
) {
  const spellings = ignoreCase ? caseVariants(prefix) : [prefix];

  return spellings.reduce(
    (total, spelling) => total + exactPrefixChance(spelling, range),
    0,
  );
}
