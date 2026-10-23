/** How letter case works in a chain's addresses */
export const LetterCase = {
  /** Hex addresses: matched without regard to case */
  LOWER: "lower",
  /** Base32 addresses, which are all uppercase */
  UPPER: "upper",
  /** Base58 addresses, where case matters unless the user turns it off */
  MIXED: "mixed",
} as const;

export type LetterCase = (typeof LetterCase)[keyof typeof LetterCase];

export const HEX_ALPHABET = "0123456789abcdef";
export const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
