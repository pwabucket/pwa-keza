import { describe, expect, it } from "vitest";

import {
  createVanityMatcher,
  getVanityDifficulty,
  getVanityError,
  matchesVanity,
} from "./vanity";
import {
  BASE32_ALPHABET,
  BASE58_ALPHABET,
  HEX_ALPHABET,
  LetterCase,
} from "../wallets/vanity";
import type { VanityCapability } from "../types/wallet";

const EVM: VanityCapability = {
  field: "Address",
  fixedPrefix: "0x",
  alphabet: HEX_ALPHABET,
  letterCase: LetterCase.LOWER,
};

const STELLAR: VanityCapability = {
  field: "Address",
  fixedPrefix: "G",
  alphabet: BASE32_ALPHABET,
  firstCharacters: "ABCD",
  letterCase: LetterCase.UPPER,
};

const SOLANA: VanityCapability = {
  field: "Address",
  fixedPrefix: "",
  alphabet: BASE58_ALPHABET,
  letterCase: LetterCase.MIXED,
};

const pattern = (prefix: string, suffix = "", matchCase = true) => ({
  prefix,
  suffix,
  matchCase,
});

describe("vanity patterns", () => {
  it("matches EVM addresses without regard to checksum case", () => {
    const matcher = createVanityMatcher(EVM, pattern("CaFe", "00"));

    expect(
      matchesVanity("0xcAfE1234567890abcdef1234567890ABCDEF0000", matcher),
    ).toBe(true);
    expect(
      matchesVanity("0xcafa000000000000000000000000000000000000", matcher),
    ).toBe(false);
  });

  it("respects case for base58 unless matching case is off", () => {
    const strict = createVanityMatcher(SOLANA, pattern("Ab"));
    const loose = createVanityMatcher(SOLANA, pattern("Ab", "", false));

    expect(matchesVanity("abXYZ", strict)).toBe(false);
    expect(matchesVanity("abXYZ", loose)).toBe(true);
  });

  it("rejects characters a chain's addresses never contain", () => {
    expect(getVanityError(EVM, pattern("xyz"))).toMatch(/can't appear/);
    expect(getVanityError(SOLANA, pattern("0O"))).toMatch(/can't appear/);
    expect(getVanityError(STELLAR, pattern("Z"))).toMatch(
      /next character can only be/,
    );
    expect(getVanityError(STELLAR, pattern("AZ"))).toBeNull();
    expect(getVanityError(EVM, pattern(""))).toMatch(/prefix/);
  });

  it("estimates the expected number of tries", () => {
    expect(getVanityDifficulty(EVM, pattern("cafe"))).toBe(16 ** 4);
    /* First character is one of A–D, the rest one of 32 */
    expect(getVanityDifficulty(STELLAR, pattern("AB"))).toBe(4 * 32);
    expect(getVanityDifficulty(SOLANA, pattern("1"))).toBe(58);
    /* Without case, "a" also matches "A" */
    expect(getVanityDifficulty(SOLANA, pattern("a", "", false))).toBe(29);
  });

  it("uses each chain's real address odds when it has them", () => {
    const TRON: VanityCapability = {
      field: "Address",
      fixedPrefix: "T",
      alphabet: BASE58_ALPHABET,
      firstCharacters: "9ABCDEFGHJKLMNPQRSTUVWXYZ",
      letterCase: LetterCase.MIXED,
      base58Range: { bytes: 25, leadingByte: 0x41 },
    };

    /* T9 is about 32 times rarer than the flat 1 in 25 suggests */
    expect(getVanityDifficulty(TRON, pattern("9"))).toBeGreaterThan(500);
    expect(getVanityDifficulty(TRON, pattern("A"))).toBeLessThan(30);
    expect(getVanityError(TRON, pattern("a"))).toMatch(/next character/);
  });
});
